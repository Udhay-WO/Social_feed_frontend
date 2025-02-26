import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import Cookies from "js-cookie";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Check if more posts are available

  const observer = useRef(); // Ref for Intersection Observer
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return; // Skip if loading or no more posts
      if (observer.current) observer.current.disconnect(); // Disconnect previous observer

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Increment page when last post is visible
        }
      });

      if (node) observer.current.observe(node); // Observe the last post
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setError("You need to log in to view posts.");
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/get-feed-posts?page=${page}&perPage=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const postsData = response.data.data.data;

        setPosts((prevPosts) => [...prevPosts, ...postsData]);

        setHasMore(postsData.length === 20);

        const imageRequests = postsData.map((post) =>
          axios
            .get(
              `http://localhost:5000/posts/get-feed-image?postId=${post._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((res) => ({ postId: post._id, image: res.data.imageData }))
            .catch(() => ({ postId: post._id, image: null }))
        );

        const imagesData = await Promise.all(imageRequests);
        const newImagesMap = imagesData.reduce((acc, img) => {
          acc[img.postId] = img.image;
          return acc;
        }, {});

        setImages((prevImages) => ({ ...prevImages, ...newImagesMap }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div>
      <Box sx={{ p: 3, maxWidth: "300px", mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Post Feed
        </Typography>

        {error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box>
            {posts.map((item, index) => {
              const isLastElement = posts.length === index + 1;
              return (
                <Box
                  key={item._id}
                  ref={isLastElement ? lastPostElementRef : null}
                  sx={{
                    mb: 4,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, mr: 1 }}
                      alt={item.userData?.username}
                      src={item.userData?.profilePic}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", flexGrow: 1 }}
                    >
                      {item.userData?.username || "Unknown User"}
                    </Typography>
                    <IconButton>
                      <MoreHorizIcon />
                    </IconButton>
                  </Box>

                  {images[item._id] && (
                    <Box sx={{ width: "100%", overflow: "hidden" }}>
                      <img
                        src={images[item._id]}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: "300px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}

                  <Box sx={{ p: 1, display: "flex", gap: 1 }}>
                    <IconButton>
                      <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton>
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ p: 1, pt: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {item.userData?.username}{" "}
                      <span style={{ fontWeight: "normal" }}>{item.title}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {item.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Posted by: {item.userData?.username || "Unknown User"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {!hasMore && posts.length > 0 && (
              <Typography sx={{ textAlign: "center", mt: 2 }}>
                No more posts to load.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default PostFeed;
