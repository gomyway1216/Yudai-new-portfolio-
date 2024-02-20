import * as fbConnect from './firebaseConnect';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getMenuImageRef = async (file) => {
  const storage = fbConnect.exportStorageAccess();
  const fileRef = await ref(storage, 'post/' + file.name);

  // 'file' comes from the Blob or File API
  await uploadBytes(fileRef, file);

  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

export const getImageRef = async (file, type, id) => {
  const storage = fbConnect.exportStorageAccess();
  const fileRef = await ref(storage, type + '/' + id + '/' + file.name);

  // 'file' comes from the Blob or File API
  await uploadBytes(fileRef, file);

  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};