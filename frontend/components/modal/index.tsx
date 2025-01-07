"use client";

import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import { toast } from "sonner";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNotify = () => {
    toast("Thank you for your contribution!", {
      duration: 4000,
      position: "top-right",
      style: { backgroundColor: "#333", color: "white", borderRadius: "5px" },
    });
  };

  return (
    <div className="flex flex-row items-start justify-start gap-8">
      <button
        onClick={handleNotify}
        className="btn glow-on-hover"
        aria-label="Notify"
      >
        Notify!
      </button>
      <Button className="btn glow-on-hover" onClick={handleOpen} aria-label="Open modal">
        Open modal
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Hello Builder 👋
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2, mb: 2 }}>
              We encourage you to contribute to this project by adding your own
              components to the BARK Protocol´s Solana dApp Scaffold.
            </Typography>
            <Button
              href="https://github.com/bark-protocol/bark-dapp-scaffold"
              target="__blank"
              variant="outlined"
              color="secondary"
              endIcon={<GitHubIcon />}
              aria-label="GitHub Repository"
            >
              Contribute
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
