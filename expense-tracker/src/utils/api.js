import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7268/api',
});


// Functions for categories
export const getCategoryById = (id) => api.get(`https://localhost:7268/api/Categories/${id}`);
export const getCategories = () => api.get('/Categories');
export const createCategory = (data) => api.post('/Categories', data);
export const updateCategory = (categoryId, updatedData) => api.put(`/Categories/${categoryId}`, updatedData);
export const deleteCategory = (categoryId) => api.delete(`/Categories/${categoryId}`);

// Functions for expenses
export const getExpenses = () => api.get('/Expenses');
export const getExpensesByCategory = (categoryId) => api.get(`/Expenses/category/${categoryId}`);
export const createExpense = (data) => api.post('/Expenses', data);
export const updateExpense = (id, expenseData) => api.put(`/Expenses/${id}`, expenseData);
export const deleteExpense = (id) => api.delete(`/Expenses/${id}`);

// Funtion to download report
export const downloadReport = (startDate, endDate) => 
    api.get(`/Expenses/report?startDate=${startDate}&endDate=${endDate}`, { responseType: 'blob' });

export default api;
