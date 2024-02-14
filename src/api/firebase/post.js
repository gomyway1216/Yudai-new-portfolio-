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

export const createPost = async (post) => {
  const docRef = await addDoc(collection(getDbAccess(), `post/${post.category}/posts`),
    {
      title: post.title,
      isPublic: post.isPublic,
      body: post.body,
      created: post.created,
      lastUpdated: post.lastUpdated,
      image: post.image,
      language: post.language
    });
  return docRef.id;
};

export const updatePost = async (post) => {
  try {
    await updateDoc(doc(getDbAccess(), `post/${post.category}/posts`, post.id), {
      title: post.title,
      isPublic: post.isPublic,
      body: post.body,
      lastUpdated: post.lastUpdated ? post.lastUpdated : new Date(),
      image: post.image,
      language: post.language
    });
  } catch (err) {
    console.error('error when updating item: ', err);
    throw err;
  }
};

export const deletePostByCategory = async (id, category) => {
  try {
    await deleteDoc(doc(getDbAccess(), `post/${category}/posts`, id));
    return true;
  } catch (err) {
    console.error('updating post public status is failing.');
    return false;
  }
};

export const getPostCategories = async () => {
  const querySnapshot = await getDocs(collection(getDbAccess(), 'post'));
  const categories = [];
  querySnapshot.forEach((doc) => {
    categories.push(doc.id);
  });
  return categories;
};

const getAllCategoryPosts = async (isPublic) => {
  const categories = ['technology', 'life'];

  // Create an array of promises
  const promises = categories.map(category => getPostsByCategory(category, isPublic));

  // Use Promise.all to wait for all promises to resolve
  const allPosts = await Promise.all(promises);

  // Flatten the array of posts arrays into a single array
  const combinedPosts = allPosts.flat();

  return combinedPosts;
};

export const getPostByCategory = async (id, category) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), `post/${category}/posts`, id));
  if (querySnapshot.exists()) {
    const data = querySnapshot.data();
    try {
      const post = {
        id: querySnapshot.id,
        title: data.title,
        body: data.body,
        isPublic: data.isPublic,
        created: data.created.toDate(),
        lastUpdated: data.lastUpdated.toDate(),
        category: category,
        image: data.image,
        language: data.language
      };
      return post;
    } catch (e) {
      console.error('error when getting post: ', e);
      return null;
    }
  } else {
    console.log('No document with id: ' + id + ' exists');
    return null;
  }
};


const getPostsByCategory = async (category, isPublic) => {
  const posts = [];
  let q;

  if (isPublic !== undefined) {
    q = query(collection(getDbAccess(), `post/${category}/posts`), 
      where('isPublic', '==', isPublic));
  } else {
    q = collection(getDbAccess(), `post/${category}/posts`);
  }

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    try {
      const post = {
        id: doc.id,
        title: data.title,
        body: data.body,
        isPublic: data.isPublic,
        created: data.created.toDate(),
        lastUpdated: data.lastUpdated.toDate(),
        category: category,
        image: data.image,
        language: data.language
      };
      posts.push(post);
    } catch (e) {
      console.error('error when getting post: ', e);
    }
  });

  return posts;
};

// TODO: write a function with the pagenation 
// which matches to the number of posts in the admin page instead of above way

export const getPosts = async (category, isPublic, pageNumber, limitNumber,
  lastVisibleDocTimestamps,
  setLastVisibleDocTimestamps) => {
  const startingPage = pageNumber - 1;
  const lastVisibleDocTimestampKey = `lastVisible_${category}_${startingPage}`;
  let lastVisibleDocTimestampSeconds = lastVisibleDocTimestamps[lastVisibleDocTimestampKey];
  let q;

  if (category === 'all') {
    if (startingPage === 0 || !lastVisibleDocTimestampSeconds) {
      q = query(
        collectionGroup(getDbAccess(), 'posts'),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        limit(limitNumber)
      );
    } else {
      let lastVisibleTimestamp = 
      Timestamp.fromDate(new Date(Number(lastVisibleDocTimestampSeconds) * 1000));
      q = query(
        collectionGroup(getDbAccess(), 'posts'),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        startAfter(lastVisibleTimestamp),
        limit(limitNumber)
      );
    }
  } else {
    if (startingPage === 0 || !lastVisibleDocTimestampSeconds) {
      q = query(
        collection(getDbAccess(), `post/${category}/posts`),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        limit(limitNumber)
      );
    } else {
      let lastVisibleTimestamp = 
      Timestamp.fromDate(new Date(Number(lastVisibleDocTimestampSeconds) * 1000));
      q = query(
        collection(getDbAccess(), `post/${category}/posts`),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        startAfter(lastVisibleTimestamp),
        limit(limitNumber)
      );
    }
  }

  const docs = await getDocs(q);
  if (docs.empty) {
    console.log('No more documents!');
    return [];
  }

  const newLastVisibleDocTimestampSeconds 
    = docs.docs[docs.docs.length - 1].data().lastUpdated.seconds;
  const currentVisibleDocTimestampKey = `lastVisible_${category}_${pageNumber}`;
  const newLastVisibleDocTimestamps = {
    ...lastVisibleDocTimestamps,
    [currentVisibleDocTimestampKey]: newLastVisibleDocTimestampSeconds
  };
  setLastVisibleDocTimestamps(newLastVisibleDocTimestamps);

  // Map over the docs and convert any Firestore timestamps to JavaScript Date objects
  return docs.docs.map(doc => {
    const data = doc.data();

    // Determine the post's category based on the reference's path
    // This assumes a path structure of "post/{category}/posts/{postId}"
    const postCategory = category !== 'all' ? category : doc.ref.path.split('/')[1];

    return {
      id: doc.id,
      title: data.title,
      body: data.body,
      isPublic: data.isPublic,
      category: postCategory,
      image: data.image,
      language: data.language,
      created: data.created?.toDate(),
      lastUpdated: new Date(data.lastUpdated.seconds * 1000) // Convert to JavaScript Date object
    };
  });
};

export const getTop4Posts = async () => {
  const categories = ['technology', 'life'];
  const promises = categories.map(category => getPostsByCategory(category, true));
  const allPosts = await Promise.all(promises);
  const combinedPosts = allPosts.flat();
  const sortedPosts = combinedPosts.sort((a, b) => b.lastUpdated - a.lastUpdated);
  return sortedPosts.slice(0, 4);
};
