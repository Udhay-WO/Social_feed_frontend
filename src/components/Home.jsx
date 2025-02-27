import NavBar from "./Navbar";
import { useState } from "react";
import Modals from "./Modal";
import { Button } from "@mui/material";
import PostFeed from "./PostFeed";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <NavBar />
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modals onClose={handleClose} label="Post" />
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
