import * as fbConnect from './firebaseConnect';
import {
  collection,
  getDocs
} from 'firebase/firestore';


const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getTechnologies = async () => {
  const querySnapshot = await getDocs(collection(getDbAccess(), 'technology'));
  const technologies = [];
  querySnapshot.forEach((doc) => {
    technologies.push({ id: doc.id, ...doc.data() });
  });
  return technologies;
};

export const getTechnologyNames = async () => {
  const querySnapshot = await getDocs(collection(getDbAccess(), 'technology'));
  const technologies = [];
  querySnapshot.forEach((doc) => {
    technologies.push(doc.data().name);
  });
  return technologies;
};