import React, { useState } from 'react';
import { TextField, Button, Typography, MenuItem, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/register.service';
import { IRegister } from '../models/User.model';

const secretQuestions = [
  'What is your mother’s maiden name?',
  'What was your first pet’s name?',
  'What is your favorite book?',
];

const Register: React.FC = () => {
  const [formData, setFormData] = useState<IRegister>({
    username: '',
    email: '',
    password: '',
    familySize: 1,
    SecretQuestion: '',
    answer: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'familySize' ? (value === '' ? '' : parseInt(value)) : value, 
    });
  };

  
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.SecretQuestion || !formData.answer) {
      setError('All fields are required.');
      return false;
    }
    if (isNaN(formData.familySize) || formData.familySize <= 0) {
      setError('Family size must be a positive number.');
      return false;
    }
    return true;
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/Login'), 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Register
        </Typography>

        {/* Error and Success Messages */}
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" align="center" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        {/* Registration Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Username */}
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          {/* Email */}
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

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          {/* Family Size */}
          <TextField
            label="Family Size"
            type="number"
            name="familySize"
            value={formData.familySize || ''} 
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{ inputProps: { min: 1 } }} 
          />

          {/* Security Question */}
          <TextField
  label="Security Question"
  name="SecretQuestion" 
  value={formData.SecretQuestion}
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

          {/* Answer */}
          <TextField
            label="Answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
