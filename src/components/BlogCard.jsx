import React, { useState, useEffect } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const BlogCard = (props) => {
  const { blog, deleteBlog = () => {}, showDeleteIcon = true } = props;
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(false);

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

        if (currentFavourites.includes(blog.id)) {
          console.log('Blog is already in favourites.');
          return;
        }

        await updateDoc(userFavouritesRef, {
          blogIds: [...currentFavourites, blog.id],
        });
        setIsFavourite(true);
      } else {
        await setDoc(userFavouritesRef, { blogIds: [blog.id] });
        setIsFavourite(true);
      }

      console.log(`Blog with ID ${blog.id} added to favourites.`);
    } catch (error) {
      console.error('Error adding blog to favourites:', error);
    }
  };

  
  useEffect(() => {
    const checkFavouriteStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        const userFavouritesRef = doc(db, 'favourites', user.uid);
        const userFavouritesSnapshot = await getDoc(userFavouritesRef);

        if (userFavouritesSnapshot.exists()) {
          const currentFavourites = userFavouritesSnapshot.data().blogIds || [];
          setIsFavourite(currentFavourites.includes(blog.id));
        }
      } catch (error) {
        console.error('Error checking favourite status:', error);
      }
    };

    checkFavouriteStatus();
  }, [blog.id]);

  return (
    <Card style={{ position: 'relative', color: 'white' }}>
      <CardMedia sx={{ height: 140 }} image={blog.image} title="Blog image" />
      {showDeleteIcon && (
        <IconButton
          style={{ position: 'absolute', right: '10px', top: '5px' }}
          aria-label="delete"
          size="small"
          onClick={() => deleteBlog(blog.id)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {blog.description}
        </Typography>
        <Chip label={blog.category} variant="outlined" />
      </CardContent>
      <CardActions>
        <IconButton onClick={handleAddToFavourite} color={isFavourite ? "secondary" : "default"}>
          {isFavourite ? <FavoriteIcon /> : <FavoriteOutlinedIcon />}
        </IconButton>
        <Button
          color="black"
          variant="outlined"
          onClick={() => navigate(`/viewblogs/${blog.id}`)}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
