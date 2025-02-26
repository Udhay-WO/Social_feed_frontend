import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setError("You need to log in to view posts.");
      setLoading(false);
      return;
    }
    const fetchPosts = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          "http://localhost:5000/posts/get-feed-posts?page=1&perPage=20&search&isMyPostsOnly&isPrivate",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Post Feed
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box>
            {posts.map((item) => (
              <Box
                key={item._id}
                sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
              >
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {item.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted by: {item.userData?.username}
                </Typography>
              </Box>
            ))}
          </Box> )} 
          </Box>
    </div>
  );
};

export default PostFeed;
