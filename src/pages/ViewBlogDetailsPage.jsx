import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';  // Ensure auth is imported
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import BlogCard from '../components/BlogCard';

const ViewBlogDetailsPage = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

  // Fetch the blog data
  useEffect(() => {
    const getBlogData = async () => {
      try {
        const snap = await getDoc(doc(db, 'blogs', id));
        if (snap.exists()) {
          setBlogData(snap.data());
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    getBlogData();
  }, [id]);

  // Handle adding to favourites
  const handleAddToFavourite = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User is not logged in.");
      return;
    }

    try {
      const userFavouritesRef = doc(db, 'favourites', user.uid);
      const userFavouritesSnapshot = await getDoc(userFavouritesRef);

      if (userFavouritesSnapshot.exists()) {
        const currentFavourites = userFavouritesSnapshot.data().blogIds || [];

        if (currentFavourites.includes(id)) {
          console.log('Blog is already in favourites.');
          return;
        }

        await updateDoc(userFavouritesRef, {
          blogIds: [...currentFavourites, id],
        });
        setIsFavourite(true);
      } else {
        await setDoc(userFavouritesRef, { blogIds: [id] });
        setIsFavourite(true);
      }

      console.log(`Blog with ID ${id} added to favourites.`);
    } catch (error) {
      console.error('Error adding blog to favourites:', error);
    }
  };

  // Check favourite status when blog data is loaded
  useEffect(() => {
    const checkFavouriteStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userFavouritesRef = doc(db, 'favourites', user.uid);
      const userFavouritesSnapshot = await getDoc(userFavouritesRef);

      if (userFavouritesSnapshot.exists()) {
        const currentFavourites = userFavouritesSnapshot.data().blogIds || [];
        setIsFavourite(currentFavourites.includes(id));
      }
    };

    checkFavouriteStatus();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BlogCard
      blog={blogData}
      showDeleteIcon={false}
      handleAddToFavourite={handleAddToFavourite}
      isFavourite={isFavourite}
    />
  );
};

export default ViewBlogDetailsPage;
