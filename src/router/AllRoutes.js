import React from 'react';
import HomeLightAnimation from '../views/all-home-version/HomeLightAnimation';
import NotFound from '../views/NotFound';
import { Routes, Route } from 'react-router-dom';
import ScrollTopBehaviour from '../components/ScrollTopBehaviour';
import PrivateRoute from './PrivateRoute';
import SignInPage from '../page/signIn/SignInPage';
import AdminPage from '../page/admin/AdminPage';

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AllRoutes;
