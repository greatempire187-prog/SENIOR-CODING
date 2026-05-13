package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"

    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
    "github.com/jung-kurt/gofpdf"
)

type studentResponse struct {
    Data studentData `json:"data"`
}

type studentData struct {
    ID        string `json:"id"`
    Name      string `json:"name"`
    Email     string `json:"email"`
    ClassID   string `json:"classId"`
    CreatedAt string `json:"createdAt"`
    UpdatedAt string `json:"updatedAt"`
}

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, falling back to environment")
    }

    backendURL := os.Getenv("BACKEND_URL")
    if backendURL == "" {
        log.Fatal("BACKEND_URL is required")
    }

    router := mux.NewRouter()
    router.HandleFunc("/api/v1/students/{id}/report", reportHandler(backendURL)).Methods("GET")
    router.Use(loggingMiddleware)

    port := os.Getenv("PORT")
    if port == "" {
        port = "4001"
    }

    log.Printf("PDF service listening on %s", port)
    if err := http.ListenAndServe(":"+port, router); err != nil {
        log.Fatal(err)
    }
}

func reportHandler(backendURL string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        studentID := vars["id"]
        if studentID == "" {
            http.Error(w, "student id is required", http.StatusBadRequest)
            return
        }

        target := fmt.Sprintf("%s/api/students/%s", backendURL, studentID)
        client := http.Client{Timeout: 10 * time.Second}
        resp, err := client.Get(target)
        if err != nil {
            log.Printf("backend request failed: %v", err)
            http.Error(w, "Unable to fetch student details", http.StatusBadGateway)
            return
        }
        defer resp.Body.Close()

        if resp.StatusCode != http.StatusOK {
            http.Error(w, "Student not available", resp.StatusCode)
            return
        }

        var payload studentResponse
        if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
            log.Printf("invalid json payload: %v", err)
            http.Error(w, "Invalid response from backend", http.StatusInternalServerError)
            return
        }

        pdfBytes, err := buildPdf(payload.Data)
        if err != nil {
            log.Printf("pdf generation error: %v", err)
            http.Error(w, "Unable to generate report", http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/pdf")
        w.Header().Set("Content-Disposition", "attachment; filename=student-report.pdf")
        w.WriteHeader(http.StatusOK)
        if _, err := w.Write(pdfBytes); err != nil {
            log.Printf("failed to write pdf response: %v", err)
        }
    }
}

func buildPdf(student studentData) ([]byte, error) {
    pdf := gofpdf.New("P", "mm", "A4", "")
    pdf.AddPage()
    pdf.SetFont("Helvetica", "B", 16)
    pdf.Cell(0, 10, "Student Report")
    pdf.Ln(12)

    pdf.SetFont("Helvetica", "", 12)
    pdf.Cell(40, 8, "Name:")
    pdf.Cell(0, 8, student.Name)
    pdf.Ln(8)

    pdf.Cell(40, 8, "Email:")
    pdf.Cell(0, 8, student.Email)
    pdf.Ln(8)

    pdf.Cell(40, 8, "Class ID:")
    pdf.Cell(0, 8, student.ClassID)
    pdf.Ln(8)

    pdf.Cell(40, 8, "Created:")
    pdf.Cell(0, 8, student.CreatedAt)
    pdf.Ln(8)

    pdf.Cell(40, 8, "Updated:")
    pdf.Cell(0, 8, student.UpdatedAt)
    pdf.Ln(14)

    pdf.MultiCell(0, 8, "This report summarizes the current student profile and verifies that the record was generated from the student management API.", "", "L", false)

    buf, err := pdf.OutputBytes()
    if err != nil {
        return nil, err
    }
    return buf, nil
}
