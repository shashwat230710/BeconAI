import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useVerification = (id) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(id ? 'processing' : 'idle');
  const [error, setError] = useState(null);

  const fetchVerification = useCallback(async (verId) => {
    try {
      const response = await api.get(`/v1/api/verify/${verId}`);
      const result = response.data.data;
      
      if (result.status === 'completed') {
        setData(result);
        setStatus('completed');
      } else {
        setStatus('processing');
      }
    } catch (err) {
      console.error('Error fetching verification:', err);
      setError(err.response?.data?.detail || 'Failed to fetch verification result.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    let intervalId;
    
    if (id && status === 'processing') {
      // Initial fetch
      fetchVerification(id);
      
      // Poll every 3 seconds
      intervalId = setInterval(() => {
        fetchVerification(id);
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, status, fetchVerification]);

  const submitVerification = async (payload) => {
    setStatus('processing');
    setError(null);
    try {
      // POST to either /text or /url based on type
      const endpoint = payload.type === 'url' ? '/v1/api/verify/url' : '/v1/api/verify/text';
      const response = await api.post(endpoint, {
        content: payload.content,
        mode: payload.mode || 'quick'
      });
      return response.data.data.verification_id;
    } catch (err) {
      console.error('Error submitting verification:', err);
      setError(err.response?.data?.detail || 'Failed to submit content.');
      setStatus('error');
      throw err;
    }
  };

  return {
    data,
    status,
    error,
    submitVerification
  };
};
