import api from './axios';

export const login = async () => {
  try {
    const response = await api.post('/auth/login', {
      email: 'magang@mail.com',
      password: 'magang',
    });
    const accessToken = response.data.data?.access_token || response.data.access_token;
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      return accessToken;
    }
    throw new Error('Token tidak ditemukan');
  } catch (error) {
    console.error('Login gagal:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
};