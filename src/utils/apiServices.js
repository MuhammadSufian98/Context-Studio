import axiosInstance from './axiosInstance';

export const refineText = async (payload, onDownloadProgress, signal) => {
  return axiosInstance.post('/refine', payload, {
    responseType: 'text', // We want to handle the stream manually or as text chunks
    onDownloadProgress,
    signal,
  });
};
