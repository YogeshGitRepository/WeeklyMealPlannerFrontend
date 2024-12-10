import React, { useState } from 'react';
import { TextField, Button, Typography, MenuItem, Container, Box, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from '../services/forgotpassword.service'; 
import { useNavigate } from 'react-router-dom';

const secretQuestions = [
  'What is your mother’s maiden name?',
  'What was your first pet’s name?',
  'What is your favorite book?',
];

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    secretQuestion: '',
    answer: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await resetPassword(formData); 
      const { success, message } = response.data; 
      if (success) {
        toast.success('Password reset successful!');
        navigate('/login');
      } else {
        toast.error(message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      toast.error('Error resetting password. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <ToastContainer position="top-center" autoClose={3000} />
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Forgot Password
          </Typography>

          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Secret Question"
            name="secretQuestion"
            value={formData.secretQuestion}
            onChange={handleChange}
            select
            required
            fullWidth
            variant="outlined"
          >
            {secretQuestions.map((question, index) => (
              <MenuItem key={index} value={question}>
                {question}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
