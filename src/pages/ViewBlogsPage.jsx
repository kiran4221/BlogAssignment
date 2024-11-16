import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Box, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';

const ViewBlogsPage = () => {
  const blogCollectionReference = collection(db, "blogs");
  const [blogsList, setBlogsList] = useState([]);
  const [alertConfig, setAlertConfig] = useState({});
  const [loading, setLoading] = useState(true);

  const getBlogsList = async () => {
    setLoading(true);
    try {
      const blogs = await getDocs(blogCollectionReference);
      const extractedBlogs = blogs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogsList(extractedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      setAlertConfig({ message: 'Successfully deleted the blog', color: 'success', isOpen: true });
      await getBlogsList(); // Refresh data
    } catch (error) {
      setAlertConfig({ message: 'Error deleting the blog', color: 'error', isOpen: true });
    }
  };

  useEffect(() => {
    getBlogsList();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <Typography variant="h3">View Blogs</Typography>
      <Divider />
      {loading ? (
        <div>Loading blogs...</div>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="12px">
          {blogsList.map((blog) => (
            <BlogCard key={blog.id} blog={blog} deleteBlog={deleteBlog} />
          ))}
        </Box>
      )}
      <Alert alertConfig={alertConfig} />
    </Box>
  );
};

export default ViewBlogsPage;
