import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// interface PostsContextProps {
//   postsByCategory: { [category: string]: Array<Post> };
//   setPostsByCategory: (category: string, posts: Array<Post>) => void;
//   currentPageByCategory: { [category: string]: number };
//   setCurrentPageByCategory: (category: string, pageNum: number) => void;
//   scrollPosition: number;
//   setScrollPosition: (position: number) => void;
//   lastVisibleDocTimestamps: { [key: string]: number };
//   setLastVisibleDocTimestamps: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
// }

const defaultValues = {
  postsByCategory: {},
  setPostsByCategory: () => { },
  currentPageByCategory: {},
  setCurrentPageByCategory: () => { },
  scrollPosition: 0,
  setScrollPosition: () => { },
  lastVisibleDocTimestamps: {},
  setLastVisibleDocTimestamps: () => { }
};

const PostsContext = createContext(defaultValues);

export const usePosts = () => {
  return useContext(PostsContext);
};

// type PostsProviderProps = {
//   children: React.ReactNode;
// };

export const PostsProvider = ({ children }) => {
  const [postsByCategory, setInternalPostsByCategory] = useState({});
  const [lastVisibleDocTimestamps, setLastVisibleDocTimestamps] = useState({});
  const [currentPageByCategory, setCurrentPageByCategoryState] = useState({});
  const [scrollPosition, setScrollPosition] = useState(0);

  const setPostsByCategory = (category, posts) => {
    setInternalPostsByCategory(prevState => ({
      ...prevState,
      [category]: posts
    }));
  };

  const setCurrentPageByCategory = (category, pageNum) => {
    setCurrentPageByCategoryState(prevState => ({
      ...prevState,
      [category]: pageNum
    }));
  };

  return (
    <PostsContext.Provider value={{
      postsByCategory,
      setPostsByCategory,
      currentPageByCategory,
      setCurrentPageByCategory,
      scrollPosition,
      setScrollPosition,
      lastVisibleDocTimestamps,
      setLastVisibleDocTimestamps
    }}>
      {children}
    </PostsContext.Provider>
  );
};

// Prop validation for PostsProvider
PostsProvider.propTypes = {
  children: PropTypes.node.isRequired
};