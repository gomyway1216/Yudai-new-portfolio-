import * as fbConnect from './firebaseConnect';
import {
  addDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const createContact = async (contact) => {
  const docRef = await addDoc(collection(getDbAccess(), 'contact'), {
    blogId: contact.blogId,
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    comment: contact.comment,
    created: new Date()
  });
  return docRef.id;
};

export const getContacts = async () => {
  const querySnapshot = await getDocs(collection(getDbAccess(), 'contact'));
  const contacts = [];
  querySnapshot.forEach((doc) => {
    contacts.push({ id: doc.id, ...doc.data() });
  });
  return contacts;
};