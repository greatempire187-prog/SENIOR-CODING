import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { useWallet } from '../../hooks/useWallet';
import { ethers } from 'ethers';
import CertificateRegistry from './CertificateRegistry.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Local Hardhat address

const Certificates: React.FC = () => {
  const { account, signer, connectWallet, isConnecting } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [metadataUri, setMetadataUri] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const issueCertificate = async () => {
    if (!signer) return;
    setLoading(true);
    setError('');
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistry.abi, signer);
      const tx = await contract.issueCertificate(recipient, metadataUri);
      await tx.wait();
      alert('Certificate issued successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async () => {
    if (!signer) return;
    setLoading(true);
    setError('');
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistry.abi, signer);
      const tx = await contract.revokeCertificate(certificateId);
      await tx.wait();
      alert('Certificate revoked successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async () => {
    if (!signer) return;
    setLoading(true);
    setError('');
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistry.abi, signer);
      const result = await contract.verifyCertificate(verifyId);
      setVerificationResult({
        valid: result[0],
        issuer: result[1],
        recipient: result[2],
        metadataUri: result[3],
        issuedAt: new Date(Number(result[4]) * 1000).toLocaleString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Certificate Management
      </Typography>

      {!account ? (
        <Button variant="contained" onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <Chip label={`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`} color="success" />
      )}

      {account && (
        <Stack spacing={3} sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Issue Certificate</Typography>
              <TextField
                fullWidth
                label="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Metadata URI"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={issueCertificate}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                Issue Certificate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Revoke Certificate</Typography>
              <TextField
                fullWidth
                label="Certificate ID"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                color="error"
                onClick={revokeCertificate}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                Revoke Certificate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Verify Certificate</Typography>
              <TextField
                fullWidth
                label="Certificate ID"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={verifyCertificate}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                Verify Certificate
              </Button>
              {verificationResult && (
                <Box sx={{ mt: 2 }}>
                  <Typography>Valid: {verificationResult.valid ? 'Yes' : 'No'}</Typography>
                  <Typography>Issuer: {verificationResult.issuer}</Typography>
                  <Typography>Recipient: {verificationResult.recipient}</Typography>
                  <Typography>Metadata: {verificationResult.metadataUri}</Typography>
                  <Typography>Issued At: {verificationResult.issuedAt}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Certificates;