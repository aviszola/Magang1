import { useState, useEffect } from 'react';
import { login } from '../api/auth';

export default function useAuth() {
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setReady(true);
      return;
    }
    login()
      .then(() => setReady(true))
      .catch((err) =>
        setAuthError('Gagal login: ' + (err.response?.data?.message ?? err.message))
      );
  }, []);

  return { ready, authError };
}
