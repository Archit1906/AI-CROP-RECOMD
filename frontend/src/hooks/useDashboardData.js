import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useWeather = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get('/api/weather?city=Chennai');
        setData(response.data);
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return { data, loading, error };
};

export const useCropData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await api.get('/api/crop/current');
        setData(response.data);
      } catch (err) {
        setError('Failed to load crop data');
      } finally {
        setLoading(false);
      }
    };
    fetchCropData();
  }, []);

  return { data, loading, error };
};

export const useMarketPrices = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        const response = await api.get('/api/market/latest');
        setData(response.data);
      } catch (err) {
        setError('Failed to load market prices');
      } finally {
        setLoading(false);
      }
    };
    fetchMarketPrices();
  }, []);

  return { data, loading, error };
};

export const useFarmHealth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmHealth = async () => {
      try {
        const response = await api.get('/api/farm/health');
        setData(response.data);
      } catch (err) {
        setError('Failed to load farm health');
      } finally {
        setLoading(false);
      }
    };
    fetchFarmHealth();
  }, []);

  return { data, loading, error };
};
