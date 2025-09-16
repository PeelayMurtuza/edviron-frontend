import axios from "axios";

const API_URL = "http://localhost:5000/api/payments"; 

export const createPayment = (paymentData) =>
  axios.post(`${API_URL}/create-payment`, paymentData);

export const getTransactions = (page = 1, limit = 10) =>
  axios.get(`${API_URL}/transactions?page=${page}&limit=${limit}`);

export const getTransactionsBySchool = (schoolId, page = 1, limit = 10) =>
  axios.get(`${API_URL}/transactions/school/${schoolId}?page=${page}&limit=${limit}`);

export const getTransactionStatus = (orderId) =>
  axios.get(`${API_URL}/transaction-status/${orderId}`);
