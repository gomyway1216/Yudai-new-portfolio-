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
import EditProjectPage from '../page/editProject/EditProjectPage';
import VoiceChatPage from '../page/voicechat/VoiceChatPage';

const AllRoutes = () => {
  return (
    <>
      <ScrollTopBehaviour />
      <Routes>
        <Route path="/" element={<HomeLightAnimation />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route exact path='/admin' element={<PrivateRoute />}>
          <Route exact path='/admin' element={<AdminPage />} />
        </Route>
        <Route path='/blog/:category' element={<CategoryPostPage />} />
        <Route path='/blog/:category/:id' element={<PostPage />} />
        <Route path='/blog/:category/:id/edit' element={<PrivateRoute />}>
          <Route path='/blog/:category/:id/edit' element={<EditPostPage />} />
        </Route>
        <Route path='/new-post' element={<PrivateRoute />}>
          <Route path='/new-post' element={<EditPostPage />} />
        </Route>
        <Route path='/project/:id/edit' element={<PrivateRoute />}>
          <Route path='/project/:id/edit' element={<EditProjectPage />} />
        </Route>
        <Route path='/new-project' element={<PrivateRoute />}>
          <Route path='/new-project' element={<EditProjectPage />} />
        </Route>
        <Route path='/voice-chat' element={<VoiceChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AllRoutes;