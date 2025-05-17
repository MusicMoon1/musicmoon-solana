import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

const storage = getStorage();

/**
 * Upload a file to Firebase Storage
 * @param file File to upload
 * @param folder Folder to upload to (e.g., 'user-images', 'nft-images', 'nft-audio')
 * @returns URL of uploaded file or null if upload failed
 */
export const uploadFile = async (
  file: File,
  folder: 'user-images' | 'nft-images' | 'nft-audio'
): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `${folder}/${uniqueFilename}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    toast.success('File uploaded successfully');
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param url URL of the file to delete
 * @returns true if deletion was successful, false otherwise
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    toast.success('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    toast.error('Failed to delete file');
    throw error;
  }
};
