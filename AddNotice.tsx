import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useCreateNoticeMutation, CreateNoticeInput, createNoticeSchema } from '../../api/noticesApi';
import { useNavigate } from 'react-router-dom';

const AddNotice: React.FC = () => {
  const navigate = useNavigate();
  const [createNotice, { isLoading, error }] = useCreateNoticeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNoticeInput>({
    resolver: zodResolver(createNoticeSchema),
  });

  const onSubmit = async (data: CreateNoticeInput) => {
    try {
      await createNotice(data).unwrap();
      navigate('/app/notices');
    } catch (err) {
      console.error('Failed to create notice:', err);
    }
  };

  const errorMessage =
    'status' in (error || {})
      ? 'Failed to create notice. Please check your input and try again.'
      : 'Unable to connect to the server.';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Notice
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={4}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to save notice. Please try again.
          </Alert>
        )}
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => navigate('/app/notices')}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddNotice;