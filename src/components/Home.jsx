import NavBar from "./Navbar";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { Button } from "@mui/material";
import PostFeed from "./PostFeed";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  return (
    <div>
      <NavBar />
      {isLoggedIn ? "" : navigate("/")}
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreatePost onClose={handleClose} label="Post" />
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
