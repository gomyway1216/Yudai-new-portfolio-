import * as fbConnect from './firebaseConnect';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';


const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const createProject = async (project) => {
  const docRef = await addDoc(collection(getDbAccess(), 'project'),
    {
      title: project.title,
      date: project.date.toDate(),
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
      date: project.date.toDate(), // convert from dayjs object to date object
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
        date: data.date.toDate(),
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

// Function to read projects from Firestore and return them as an array of objects
export const getProjects = async () => {
  const projectsCollection = collection(getDbAccess(), 'project');
  const querySnapshot = await getDocs(projectsCollection);
  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() });
  });
  return projects; // Return an array of project objects
};

export const getProjectCategories = () => {
  return ['Web App', 'Mobile', 'AI/ML', 'Console'];
};

export const getUrlTypeList = async () => {
  const urlTypes = await getDocs(collection(getDbAccess(), 'urlType'));
  const urlTypeList = [];
  urlTypes.forEach((doc) => {
    urlTypeList.push(doc.data().name);
  });
  return urlTypeList;
};