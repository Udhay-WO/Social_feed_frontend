import NavBar from "./Navbar";
import { useState } from "react";
import Modal from "./Modal";
import { Button } from "@mui/material";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <NavBar />
      <h1>Home</h1>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create New Post
      </Button>
      <Modal open={modalOpen} onClose={handleClose} label="Post"/>
    </div>
  );
}