import React, { useEffect, useState, useRef } from 'react';
import PostListItem from '../../components/blog/PostListItem';
import * as postApi from '../../api/firebase/post';
import SuggestionBar from '../../components/blog/SuggestionBar';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../../provider/PostsProvider';
import { useInView } from 'react-intersection-observer';

const CategoryPostPage = () => {
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();

  // Getting values and functions from the context
  const {
    postsByCategory,
    setPostsByCategory,
    currentPageByCategory,
    setCurrentPageByCategory,
    scrollPosition,
    setScrollPosition,
    lastVisibleDocTimestamps,
    setLastVisibleDocTimestamps
  } = usePosts();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To determine if there are more posts to fetch
  const category = routeCategory || 'all';
  const [tabValue, setTabValue] = useState(category);
  // const observerRef = useRef(null);

  // Setup intersection observer
  const [ref, inView] = useInView({
    threshold: 0.1, // Adjust this value as per your need. 0.1 means 10% of the target is visible.
    triggerOnce: false, // Observe continuously, not just once.
  });

  const resetScrollPosition = () => {
    window.scrollTo(0, 0);
  };


  const getPageLimitBasedOnScreenSize = () => {
    return 5;
    // if (window.innerWidth <= 480) {  // Small devices (e.g., mobile phones)
    //   return 5;
    // } else if (window.innerWidth <= 768) {  // Medium devices (e.g., tablets)
    //   return 10;
    // } else {  // Large devices (e.g., desktops)
    //   return 20;
    // }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    const pageLimit = getPageLimitBasedOnScreenSize();
    const currentCategoryPage = currentPageByCategory[category] || 1;
    const fetchedPosts = await postApi.getPosts(category, 
      true, currentCategoryPage, pageLimit, lastVisibleDocTimestamps,
      setLastVisibleDocTimestamps);

    if (fetchedPosts.length === 0) {
      setHasMore(false);
    } else {
      // Combining existing posts with the newly fetched ones
      const updatedPosts = [...(postsByCategory[category] || []), ...fetchedPosts];
      setPostsByCategory(category, updatedPosts);

      setCurrentPageByCategory(category, currentCategoryPage + 1);
    }

    setIsLoading(false);
  };

  const handleClickPost = (id, postCategory) => {
    setScrollPosition(window.scrollY); // Store scroll position when navigating away
    navigate(`/${postCategory}/${id}`);
  };

  // When the component mounts or when category changes:
  useEffect(() => {
    resetScrollPosition();

    if (!postsByCategory[category]) {
      setHasMore(true);
      fetchPosts();
    } else {
      setHasMore(postsByCategory[category].length > 0); 
      // If there's data, set it based on the length
      window.scrollTo(0, scrollPosition);
    }
  }, [category]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      // We integrate inView into the scroll logic
      if (inView && !isLoading && hasMore) {
        fetchPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [inView, isLoading, hasMore, category]); // Note: we added inView here

  return (
    <div
      className="container"
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      <div
        className="postsList"
        style={{
          borderRight: 'solid 1px rgba(242, 242, 242, 1)',
          width: '69%',
          paddingTop: '3vh',
          minHeight: '97vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '38px',
          marginRight: 'auto',
        }}
      >
        <SuggestionBar activeTab={tabValue} setActiveTab={setTabValue} />
        <div
          className="inner_container_main"
          style={{
            width: '90%',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            marginTop: '22px'
          }}
        >
          {postsByCategory[category]?.map((item, index) => {
            const totalPosts = postsByCategory[category].length;
            if (totalPosts - 3 === index) {
              return (
                <PostListItem
                  key={item.id}
                  ref={ref}
                  id={item.id}
                  title={item.title}
                  body={item.body}
                  isPublic={item.isPublic}
                  created={item.created}
                  lastUpdated={item.lastUpdated}
                  category={item.category}
                  image={item.image}
                  language={item.language}
                  handleClick={handleClickPost}
                />
              );
            } else {
              return (
                <PostListItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  body={item.body}
                  isPublic={item.isPublic}
                  created={item.created}
                  lastUpdated={item.lastUpdated}
                  category={item.category}
                  image={item.image}
                  language={item.language}
                  handleClick={handleClickPost}
                />
              );
            }
          })}
          {/* {postsByCategory[category as string]?.map((item) => {
            return (
              <PostListItem
                key={item.id}
                id={item.id}
                title={item.title}
                body={item.body}
                isPublic={item.isPublic}
                created={item.created}
                lastUpdated={item.lastUpdated}
                category={item.category}
                image={item.image}
                language={item.language}
                handleClick={handleClickPost}
              />
            );
          })} */}
          {isLoading && <p>Loading more posts...</p>}
        </div>
      </div>
      <div
        className="rightbar"
        style={{
          width: '31%',
          paddingTop: '3vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '38px',
        }}
      >
        Placeholder for rightbar
      </div>
    </div>
  );

};

export default CategoryPostPage;