import axios from 'axios';

const API_URL = 'http://localhost:5000/api';


export const resetPassword = async (resetData: {
  email: string;
  newPassword: string;
  secretQuestion: string;
  answer: string;
}) => {
  return axios.post(`${API_URL}/User/forgotpassword`, resetData);
};
