import axios from 'axios';
import { IRegister } from '../models/User.model';
const API_URL = 'http://localhost:5000/api';

export const register = async (data: IRegister) => {
  return axios.post(`${API_URL}/User/register`, {
    username: data.username,
    email: data.email,
    password: data.password,
    familySize: data.familySize,
    SecretQuestion: data.SecretQuestion,  
    answer: data.answer,
  });
};
