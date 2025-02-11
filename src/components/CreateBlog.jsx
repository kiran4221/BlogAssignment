import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig';
import Alert from './Alert';
import useLocalStorage from '../hooks/useLocalStorage';
import { Link } from 'react-router-dom';

const categories = [
    'Tech',
    'News',
    'Sports',
    'Science'
];

const CreateBlog = () => {

    const [currentUser, setCurrentUser] = useLocalStorage('current_user', null);
    const [blogInfo, setBlogInfo] = useState({
        userId: currentUser?.uid || "",
        title: '',
        description: '',
        category: '',
        image: ''
    });
    const blogCollectionReference = collection(db, "blogs");
    const [alertConfig, setAlertConfig] = useState({});


    const handleCreateBlog = async () => {
        if (!blogInfo.title || !blogInfo.description || !blogInfo.category || !blogInfo.image) {
            setAlertConfig({
                ...alertConfig,
                message: 'Please fill in all fields!',
                color: 'error',
                isOpen: true
            });
            return;
        }

        try {
            await addDoc(blogCollectionReference, blogInfo);
            setAlertConfig({
                ...alertConfig, message: 'Successfully created a blog!', color: 'success', isOpen: true
            });
            setBlogInfo({
                userId: currentUser?.uid || "",
                title: '',
                description: '',
                category: '',
                image: ''
            });
        } catch (error) {
            setAlertConfig({
                ...alertConfig, message: 'There was an error creating the blog.', color: 'error', isOpen: true
            });
        }
    };

    const handleCategoryClick = (category) => {
        setBlogInfo({...blogInfo, category});
    };

    return (
        <Box border="1px solid black" padding="50px" borderRadius="12px" display="flex" flexDirection="column" gap="20px">
            <Typography variant="h3">Create your own Blogs</Typography>

            <TextField 
                type="text" 
                placeholder='Enter Blog Title here!' 
                value={blogInfo.title} 
                onChange={(e) => setBlogInfo({ ...blogInfo, title: e.target.value })} 
                fullWidth 
                sx={{
                    '& input': {
                        color: 'black'
                    }
                }} 
            />

            <TextField 
                type="text" 
                placeholder='Enter Blog Description here!' 
                value={blogInfo.description} 
                onChange={(e) => setBlogInfo({ ...blogInfo, description: e.target.value })} 
                fullWidth 
                sx={{
                    '& input': {
                        color: 'black' 
                    }
                }} 
            />

            <Box display="flex" gap="4px">
                {
                    categories.map((category) => {
                        return <Chip label={category} variant="outlined" onClick={() => handleCategoryClick(category)} />
                    })
                }
            </Box>

            <TextField 
                type="text" 
                placeholder='Please Paste url of the image' 
                value={blogInfo.image} 
                onChange={(e) => setBlogInfo({ ...blogInfo, image: e.target.value })} 
                fullWidth 
                sx={{
                    '& input': {
                        color: 'black'
                    }
                }} 
            />

            <Button variant="contained" onClick={handleCreateBlog}>Create Blog</Button>
            <Alert alertConfig={alertConfig} />
            <Link to="/viewblogs">View Blogs</Link>
        </Box>
    );
};

export default CreateBlog;
