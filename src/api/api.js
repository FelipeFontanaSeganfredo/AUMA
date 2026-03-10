export const API_BASE_URL = 'https://auma-api-9w04.onrender.com';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('jwtToken');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  return response;
};

export const getPosts = (page = 0, size = 10) =>
  apiFetch(`/posts?page=${page}&size=${size}`);

export const getPostById = (id) => apiFetch(`/posts/${id}`);

export const getProducts = (page = 0, size = 16) =>
  apiFetch(`/products?page=${page}&size=${size}`);

export const getProductById = (id) => apiFetch(`/products/${id}`);

export const getPartners = (page = 0, size = 100) =>
  apiFetch(`/partners?page=${page}&size=${size}`);

export const login = (email, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
