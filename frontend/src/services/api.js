import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Backend base URL

export const signupUser = async (userData) => {
  return axios.post(`${API_URL}/users/signup`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/users/signin`, credentials);
};

export const fetchTransactions = async (token) => {
  return axios.get(`${API_URL}/transactions/getall`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTransaction = async (transaction, token) => {
  return axios.post(`${API_URL}/transactions/create`, transaction, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTransaction = async (id, token) => {
  return axios.delete(`${API_URL}/transactions/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
