import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { ILogin } from '../models/User.model';
import { login } from '../services/login.service';

interface LoginPopupProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void; 
}

const LoginPopup: React.FC<LoginPopupProps> = ({ open, onClose, onLogin }) => {
  const [formData, setFormData] = useState<ILogin>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await login(formData);
      const token = response.data.token;
      const username = response.data.username;
      if(username){
        localStorage.setItem('username', username);
      }
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        onLogin(); 
        onClose(); 
        navigate('/config'); 
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
            />
          </Box>
        </DialogContent>
        <DialogActions>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" align="left">
                Don’t have an account?{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  variant="body2"
                  onClick={onClose}
                >
                  Register here
                </MuiLink>
              </Typography>
              <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                Forgot your password?{' '}
                <MuiLink
                  component={Link}
                  to="/forgotpassword"
                  variant="body2"
                  onClick={onClose}
                >
                  Reset here
                </MuiLink>
              </Typography>
            </Grid>
            <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
              <Grid item>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          </Grid>
              <Grid item>
          <Button onClick={onClose} variant="outlined" color="secondary" disabled={loading}>
            Cancel
          </Button>
          </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginPopup;
