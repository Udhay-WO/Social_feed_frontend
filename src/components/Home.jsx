import NavBar from "./Navbar";
import CreatePost from "./CreatePost";
import { Button } from "@mui/material";
import PostFeed from "./PostFeed";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useEffect } from "react";

import { useState } from "react";
export default function Home() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (location.state?.showSuccess) {
      setSnackbarMessage("Login successful!");
      setSnackbarOpen(true);
      // Clear the location state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <NavBar />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          elevation={6}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreatePost
          onClose={handleClose}
          label="Post"
          onPostCreated={() => {
            setSnackbarMessage("Post created successfully!");
            setSnackbarOpen(true);
          }}
        />
      </Modal>
      <PostFeed />
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ position: "fixed", bottom: "50px", right: "2rem" }}
      >
        <AddIcon />
      </Button>
    </div>
  );
}
