import * as fbConnect from './firebaseConnect';
import {
  addDoc,
  collection,
  collectionGroup,
  Timestamp,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  orderBy,
  startAfter
} from 'firebase/firestore';


const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const createProject = async (project) => {
  const docRef = await addDoc(collection(getDbAccess(), 'project'),
    {
      title: project.title,
      date: project.date,
      description: project.description,
      client: project.client,
      industry: project.industry,
      thumbImage: project.thumbImage,
      images: project.images,
      urls: project.urls,
      technologies: project.technologies,
      categories: project.categories
    });
  return docRef.id;
};

export const updateProject = async (project) => {
  try {
    await updateDoc(doc(getDbAccess(), 'project', project.id), {
      title: project.title,
      date: project.date,
      description: project.description,
      client: project.client,
      industry: project.industry,
      thumbImage: project.thumbImage,
      images: project.images,
      urls: project.urls,
      technologies: project.technologies,
      categories: project.categories
    });
  } catch (err) {
    console.error('error when updating item: ', err);
    throw err;
  }
};

export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(getDbAccess(), 'project', id));
    return true;
  } catch (err) {
    console.error('deleting project error: ', err);
    return false;
  }
};

export const getProject = async (id) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'project', id));
  if (querySnapshot.exists()) {
    const data = querySnapshot.data();
    try {
      const project = {
        id: querySnapshot.id,
        title: data.title,
        date: data.date,
        description: data.description,
        client: data.client,
        industry: data.industry,
        thumbImage: data.thumbImage,
        images: data.images,
        urls: data.urls,
        technologies: data.technologies,
        categories: data.categories
      };
      return project;
    } catch (e) {
      console.error('error when getting project: ', e);
      return null;
    }
  } else {
    console.log('No document with id: ' + id + ' exists');
    return null;
  }
};


const getProjects = async () => {
  const projects = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'projects'));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    try {
      const project = {
        id: doc.id,
        title: data.title,
        date: data.date,
        description: data.description,
        client: data.client,
        industry: data.industry,
        thumbImage: data.thumbImage,
        images: data.images,
        urls: data.urls,
        technologies: data.technologies,
        categories: data.categories
      };
      projects.push(project);
    } catch (e) {
      console.error('error when getting post: ', e);
    }
  });

  return projects;
};

export const getProjectCategories = () => {
  return ['Web App', 'Mobile', 'AL/ML'];
};