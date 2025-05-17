import { useState } from 'react';
import { uploadFile as uploadFileToStorage, deleteFile as deleteFileFromStorage } from '@/services/storageService';
import { toast } from 'react-hot-toast';

type StorageFolder = 'user-images' | 'nft-images' | 'nft-audio';

export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder: StorageFolder) => {
    setLoading(true);
    setError(null);
    try {
      const url = await uploadFileToStorage(file, folder);
      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload file';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFileFromStorage(url);
      toast.success('File deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete file';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    uploadFile,
    deleteFile
  };
}; 