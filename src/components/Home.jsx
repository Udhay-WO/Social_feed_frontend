import NavBar from "./Navbar";
import CreatePost from "./CreatePost";
import { Button } from "@mui/material";
import PostFeed from "./PostFeed";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import SnackBar from "./SnackBar";
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
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <NavBar />
      <SnackBar
        open={snackbarOpen}
        message={snackbarMessage}
        set={handleSnackbarClose}
      />
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
