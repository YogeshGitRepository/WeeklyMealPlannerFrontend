import React, { useState } from 'react';
import { TextField, Button, Typography, Link as MuiLink, Container, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ILogin } from '../models/User.model';
import { login } from '../services/login.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<ILogin>({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await login(formData);
      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        console.log('Login successful:', response.data);
        navigate('/config');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer position="top-center" autoClose={3000} />
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
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
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>

          <Typography variant="body2" align="center">
            Don’t have an account?{' '}
            <MuiLink component={Link} to="/register" variant="body2">
              Register here
            </MuiLink>
          </Typography>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Forgot your password?{' '}
            <MuiLink component={Link} to="/forgotpassword" variant="body2">
              Reset here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
