import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.05,          // 50KB target
    maxWidthOrHeight: 150,     // Small dimensions
    useWebWorker: true,        // Non-blocking compression
    fileType: 'image/webp',    // Efficient format
    initialQuality: 0.5        // Aggressive quality reduction
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Compression error:', error);
    return file;
  }
};

export const isImageValid = (file) => {
  if (!file) return false;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return false;
  }
  return true;
};