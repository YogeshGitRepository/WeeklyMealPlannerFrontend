import axios from 'axios';
import { ILogin } from '../models/User.model';

const API_URL = 'http://localhost:5000/api';




export const login = async (loginData: ILogin) => {
  return axios.post(`${API_URL}/User/login`, loginData);
};
