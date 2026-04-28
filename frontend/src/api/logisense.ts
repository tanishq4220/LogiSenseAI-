import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 3;
      config.retryCount = 0;
    }
    if (config.retryCount < config.retry) {
      config.retryCount += 1;
      return new Promise((resolve) => setTimeout(() => resolve(api(config)), 1000));
    }
    return Promise.reject(error);
  }
);

export const getLiveVehicles = () => api.get('/vehicles/live').then(res => res.data);
export const getAlerts = () => api.get('/vehicles/alerts').then(res => res.data);
export const getDisruptions = () => api.get('/disruption-status').then(res => res.data);
export const startStream = () => api.post('/vehicles/start-stream').then(res => res.data);
export const stopStream = () => api.post('/vehicles/stop-stream').then(res => res.data);
export const optimizeFleet = (data: any) => api.post('/optimize-fleet', data).then(res => res.data);
export const getCarbonReport = () => api.get('/carbon/daily-report').then(res => res.data);
export const sendVoiceCommand = (data: {transcript: string}) => api.post('/voice/command', data).then(res => res.data);
export const optimizeChatRoute = (message: string) => axios.post('https://logisense-ai-backend-1417068932.asia-south1.run.app/api/v1/chat', { message, history: [] }).then(res => res.data);
