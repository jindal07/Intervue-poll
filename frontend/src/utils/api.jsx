import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Poll API
export const pollAPI = {
  createPoll: (data) => api.post('/polls', data),
  getActivePoll: () => api.get('/polls/active'),
  getPollById: (id) => api.get(`/polls/${id}`),
  completePoll: (id) => api.put(`/polls/${id}/complete`),
  getPollResults: (id) => api.get(`/polls/${id}/results`),
  getPollHistory: () => api.get('/polls/history')
};

// Vote API
export const voteAPI = {
  submitVote: (data) => api.post('/votes', data),
  getStudentVote: (pollId, studentId) => api.get(`/votes/${pollId}/${studentId}`),
  checkIfVoted: (pollId, studentId) => api.get(`/votes/${pollId}/${studentId}/check`)
};

// Participant API
export const participantAPI = {
  getParticipants: () => api.get('/participants'),
  getParticipantById: (id) => api.get(`/participants/${id}`),
  kickParticipant: (id) => api.delete(`/participants/${id}/kick`)
};

export default api;

