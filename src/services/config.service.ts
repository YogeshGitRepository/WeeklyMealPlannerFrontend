import axios from 'axios';
import jwt_decode from 'jwt-decode';  

import { IIngredient } from '../models/FamilySizeAndIngredients.model';

const API_URL = 'http://localhost:5000/api';


const isTokenExpired = (token: string) => {
    const decoded: any = jwt_decode(token); 
    const exp = decoded.exp * 1000;  
    return Date.now() > exp;
};


const getHeaderWithAuth = () => {
    const token = localStorage.getItem("token");

    
    if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        return null;
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    };
};


export const FamilySizeGet = async (): Promise<number> => {
    const headers = getHeaderWithAuth();
    if (!headers) {
        throw new Error('Token expired or missing');
    }
    const response = await axios.get<number>(`${API_URL}/familysize`, headers);
    return response.data;
};


export const ingredientsGet = async (): Promise<IIngredient[]> => {
    const headers = getHeaderWithAuth();
    if (!headers) {
        throw new Error('Token expired or missing');
    }
    const response = await axios.get<IIngredient[]>(`${API_URL}/AvailableGrocery`, headers);
    return response.data;
};


export const ingredientsSet = async (ingredient: IIngredient): Promise<IIngredient> => {
    const headers = getHeaderWithAuth();
    if (!headers) {
        throw new Error('Token expired or missing');
    }
    const response = await axios.post<IIngredient>(`${API_URL}/AvailableGrocery`, ingredient, headers);
    return response.data;
};
