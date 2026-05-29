import axiosInstance from './axiosInstance';

export const refineText = async (payload, onDownloadProgress, signal) => {
  const criteria = payload.transformation || (payload.followUp ? 'refinement' : 'initial');
  console.log(`[Service] Initiating refinement request [Type: ${criteria}]`);

  return axiosInstance.post('/refine', payload, {
    responseType: 'text',
    onDownloadProgress,
    signal,
  });
};
