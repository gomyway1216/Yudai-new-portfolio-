import React from 'react';
import HomeLightAnimation from '../views/all-home-version/HomeLightAnimation';
import NotFound from '../views/NotFound';
import { Routes, Route } from 'react-router-dom';
import ScrollTopBehaviour from '../components/ScrollTopBehaviour';
import PrivateRoute from './PrivateRoute';
import SignInPage from '../page/signIn/SignInPage';
import AdminPage from '../page/admin/AdminPage';
import EditPostPage from '../page/editPost/EditPostPage';
import CategoryPostPage from '../page/blog/CategoryPostPage';
import PostPage from '../page/blog/PostPage';

const AllRoutes = () => {
  return (
    <>
      <ScrollTopBehaviour />
      <Routes>
        <Route path="/" element={<HomeLightAnimation />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route exact path='/admin' element={<PrivateRoute/>}>
          <Route exact path='/admin' element={<AdminPage/>}/>
        </Route>
        <Route path='/:category' element={<CategoryPostPage />} />
        <Route path='/:category/:id' element={<PostPage />} />
        <Route path='/:category/:id/edit' element={<PrivateRoute />}>
          <Route path='/:category/:id/edit' element={<EditPostPage />} />
        </Route>
        <Route path='/new-post' element={<PrivateRoute />}>
          <Route path='/new-post' element={<EditPostPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AllRoutes;