import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import BlogCard from '../components/BlogCard';

const ViewFavouritesPage = () => {
  const [favouriteBlogs, setFavouriteBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
        setFavouriteBlogs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFavouriteBlogs = async () => {
      if (!currentUser) return;

      try {
        const userFavouritesRef = doc(db, 'favourites', currentUser);
        const userFavouritesSnapshot = await getDoc(userFavouritesRef);

        if (userFavouritesSnapshot.exists()) {
          const favouriteBlogIds = userFavouritesSnapshot.data().blogIds || [];
          
          if (favouriteBlogIds.length === 0) {
            setFavouriteBlogs([]);
            setLoading(false);
            return;
          }

          const blogsRef = collection(db, 'blogs');
          const blogsSnapshot = await getDocs(blogsRef);

          const allBlogs = blogsSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          const filteredBlogs = allBlogs.filter((blog) =>
            favouriteBlogIds.includes(blog.id)
          );

          setFavouriteBlogs(filteredBlogs);
        } else {
          console.log('No favourites found for this user.');
          setFavouriteBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching favourite blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteBlogs();
  }, [currentUser]);

  return (
    <Box padding="20px">
      <Typography variant="h4" marginBottom="20px">
        Favourite Blogs
      </Typography>
      {loading ? (
        <Typography>Loading favourites...</Typography>
      ) : favouriteBlogs.length === 0 ? (
        <Typography>No favourite blogs found.</Typography>
      ) : (
        favouriteBlogs.map((blog) => (
          <Box
            key={blog.id}
            border="1px solid #ccc"
            padding="10px"
            margin="10px 0"
            borderRadius="5px"
          >
            <BlogCard blog={blog} showDeleteIcon={false} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default ViewFavouritesPage;
