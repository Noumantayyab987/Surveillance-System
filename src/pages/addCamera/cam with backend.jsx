import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { Select, MenuItem } from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("low");
  const [openCameraDialog, setOpenCameraDialog] = useState(false);
  const [cameras, setCameras] = useState([]);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const cameraIP = "192.168.1.110:8080"; // Replace with the appropriate camera IP address
    const streamCameraURL = `ws://127.0.0.1:8000/live-camera-reid/stream_camera/${cameraIP}`; // Adjust the URL if necessary

    socketRef.current = new WebSocket(streamCameraURL);

    socketRef.current.onmessage = function (event) {
      if (event.data instanceof ArrayBuffer) {
        const buffer = new Uint8Array(event.data);
        const blob = new Blob([buffer], { type: "image/jpeg" });

        const image = new Image();
        image.onload = function () {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = URL.createObjectURL(blob);
      }
    };

    socketRef.current.onclose = function () {
      console.error(socketRef.current);
      alert("Camera stream connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImage(file);
  };

  const handleAccuracyLevelChange = (event) => {
    setAccuracyLevel(event.target.value);
  };

  const handleStartReidentify = () => {
    // Add your logic for starting the re-identification process
  };

  const handleAddCamera = () => {
    setOpenCameraDialog(true);
  };

  const handleCloseCameraDialog = () => {
    setOpenCameraDialog(false);
  };

  const handleSaveCamera = () => {
    const ip = document.getElementById("ip-address").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const newCamera = { ip, username, password };
    setCameras((prevCameras) => [...prevCameras, newCamera]);
    setOpenCameraDialog(false);
  };

  const handleDeleteCamera = (index) => {
    setCameras((prevCameras) => {
      const updatedCameras = [...prevCameras];
      updatedCameras.splice(index, 1);
      return updatedCameras;
    });
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box
        display={smScreen ? "flex" : "block"}
        flexDirection={smScreen ? "row" : "column"}
        justifyContent={smScreen ? "space-between" : "start"}
        alignItems={smScreen ? "center" : "start"}
        m="10px 0"
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleStartReidentify}
          >
            Start Re-Identify
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {cameras.map((camera, index) => (
          <Grid key={index} item xs={12} sm={12} md={6} lg={4} xl={4}>
            <Box
              width="100%"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* Updated Box */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                  Camera {index + 1}
                </Typography>
                <canvas
                  ref={canvasRef}
                  id={`canvas-${index}`}
                  width="640"
                  height="480"
                ></canvas>
                <IconButton
                  sx={{ color: colors.grey[100] }}
                  onClick={() => handleDeleteCamera(index)}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* ADD CAMERA */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={2}
              cursor="pointer"
              onClick={handleAddCamera}
            >
              <Typography
                variant="h6"
                sx={{ color: colors.grey[100], textAlign: "center" }}
              >
                Add Camera
              </Typography>
              <VideoLibraryOutlinedIcon
                sx={{ fontSize: 60, color: colors.grey[100] }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* CAMERA DIALOG */}
      <Dialog open={openCameraDialog} onClose={handleCloseCameraDialog}>
        <DialogTitle>Add Camera</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the details of the camera.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="ip-address"
            label="IP Address"
            fullWidth
          />
          <TextField
            margin="dense"
            id="username"
            label="Username"
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCameraDialog}>Cancel</Button>
          <Button onClick={handleSaveCamera}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
