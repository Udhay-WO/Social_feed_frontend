/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import Cookies from "js-cookie";
import {
  useGetPostQuery,
  useGetImagePostQuery,
} from "../../Store/Slice/apiSlice";

const PostFeed = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {
    data: postData = [],
    isLoading,
    isError,
    error: queryError,
    isFetching,
  } = useGetPostQuery({ page, perPage: 20 });
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setHasMore(false);
      return;
    }
    if (postData) {
      setHasMore(postData.length === 20);
    }
  }, [postData, page]);

  const PostItem = useMemo(() => {
    return function PostItem({ post, isLast }) {
      const {
        data: imageData,
        isLoading: imageLoading,
        isError: imageError,
      } = useGetImagePostQuery(post._id);

      return (
        <Box
          ref={isLast ? lastPostElementRef : null}
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
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                bgcolor: "gray",
                fontSize: "1rem",
              }}
              alt={post.userData?.username || "Unknown User"}
            >
              {post.userData?.firstname?.slice(0, 1).toUpperCase() +
                post.userData?.lastname?.slice(0, 1).toUpperCase() || "UN"}
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", flexGrow: 1 }}
            >
              {post.userData?.username || "Unknown User"}
            </Typography>
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </Box>
          {imageLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : imageError ? (
            <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
              Image not found.
            </Typography>
          ) : imageData ? (
            <Box sx={{ width: "100%", overflow: "hidden" }}>
              <img
                src={imageData}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          ) : null}
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
              {post.userData?.username}
              <span style={{ fontWeight: "normal" }}>{post.title}</span>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {post.description}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Posted by: {post.userData?.username || "Unknown User"}
            </Typography>
          </Box>
        </Box>
      );
    };
  }, [lastPostElementRef]);

  const renderedPosts = useMemo(() => {
    return postData.map((item, index) => (
      <PostItem
        key={item._id}
        post={item}
        isLast={postData.length === index + 1}
      />
    ));
  }, [postData, PostItem]);

  if (isError) {
    return (
      <Box sx={{ p: 3, maxWidth: "300px", mx: "auto" }}>
        <Typography color="error" sx={{ mt: 2 }}>
          {queryError?.data?.message || "Failed to fetch posts"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "300px", mx: "auto" }}>
      <Box>
        {renderedPosts}
        {(isLoading || isFetching) && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {!hasMore && postData.length > 0 && (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            No more posts to load.
          </Typography>
        )}
        {!hasMore && postData.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            No Post found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PostFeed;
