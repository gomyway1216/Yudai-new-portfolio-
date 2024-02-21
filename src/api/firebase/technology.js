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
  let technologies = [];
  querySnapshot.forEach((doc) => {
    technologies.push({ id: doc.id, ...doc.data() });
  });

  // Sorting priorities for types
  const typePriority = { 'language': 1, 'framework': 2, 'database': 3 };

  technologies.sort((a, b) => {
    // Sort by type using the defined priorities
    const typeDifference = (typePriority[a.type] || 4) - (typePriority[b.type] || 4);
    if (typeDifference !== 0) return typeDifference;

    // If types are the same, sort by name alphabetically
    return a.name.localeCompare(b.name);
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