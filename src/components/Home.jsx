import NavBar from "./Navbar";
import { useState } from "react";
import Modal from "./Modal";
import { Button } from "@mui/material";
import PostFeed from "./PostFeed";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <NavBar />
      <PostFeed />
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ position: "absolute", top: "100px", right: "2rem" }}
      >
        Create New Post
      </Button>
      <Modal open={modalOpen} onClose={handleClose} label="Post" />
    </div>
  );
}
