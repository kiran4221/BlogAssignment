import './App.css'
import { useRoutes } from 'react-router-dom';
import SignInPage from './pages/Signin';
import SignupPage from './pages/Signup';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ViewBlogsPage from './pages/ViewBlogsPage';
import ViewBlogDetailsPage from './pages/ViewBlogDetailsPage';
import Navbar from './components/Navbar';
import ViewFavouritesPage from './pages/ViewFavouritesPage';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const routes = useRoutes([
    { path: '/', element: <SignInPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/home', element: currentUser ? <HomePage /> : <SignInPage /> },
    { path: '/viewblogs', element: <ViewBlogsPage /> },
    { path: '/viewblogs/:id', element: <ViewBlogDetailsPage /> },
    { path: '/favourites', element: <ViewFavouritesPage /> },
    { path: '*', element: <NotFoundPage /> }
  ]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />
      {routes}
    </>
  );
}

export default App;
