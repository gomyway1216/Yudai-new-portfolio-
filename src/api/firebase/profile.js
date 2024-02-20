import * as fbConnect from './firebaseConnect';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getResumeLink = async () => {
  const db = getDbAccess();
  let resumeLink = '';
  
  const querySnapshot = await getDocs(collection(db, 'profile'));
  querySnapshot.forEach((doc) => {
    // Check if the document's 'name' field is 'resume'
    if (doc.data().name === 'resume') {
      // Assign the value of the 'value' field to resumeLink
      resumeLink = doc.data().value;
    }
  });

  return resumeLink;
};