import React, { useState } from "react";
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
import Grid from "@mui/material/Unstable_Grid2";
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
  const [setUploadedImage] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("low");
  const [openCameraDialog, setOpenCameraDialog] = useState(false);
  const [cameras, setCameras] = useState([]);


  
  


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
    setCameras((prevCameras) => prevCameras.filter((_, i) => i !== index));
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
                <IconButton
                  sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "26px",
                  }}
                  onClick={() => handleDeleteCamera(index)}
                >
                  <VideoLibraryOutlinedIcon />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: colors.red[700],
                    color: colors.grey[100],
                    fontSize: "26px",
                  }}
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
            {/* Add Camera Box */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={2}
            >
              <IconButton
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "26px",
                }}
                onClick={handleAddCamera}
              >
                <VideoLibraryOutlinedIcon />
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{ color: colors.grey[100], mt: 1 }}
              >
                Add Camera
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            
          >
            <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <StatBox
                title="Upload Image"
                subtitle="Re-Identify with Image"
                icon={
                  <ImageOutlinedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </label>
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
           
          >
            
            <StatBox
              title="Accuracy Level"
              subtitle="Set Re-Identification Accuracy"
              icon={
                <AssessmentOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
            <Select
              value={accuracyLevel}
              onChange={handleAccuracyLevelChange}
              style={{ color: colors.grey[100] }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* Additional Box */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={2}
            >
              <IconButton
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "26px",
                }}
              >
                <DownloadOutlinedIcon />
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{ color: colors.grey[100], mt: 1 }}
              >
                Start Re-Identify
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Camera Dialog */}
      <Dialog
        open={openCameraDialog}
        onClose={handleCloseCameraDialog}
        aria-labelledby="camera-dialog-title"
      >
        <DialogTitle id="camera-dialog-title">Add Camera</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the IP address, username, and password for the camera.
          </DialogContentText>
          <Box display="flex" flexDirection="column">
            <TextField
              id="ip-address"
              label="IP Address"
              variant="outlined"
              margin="dense"
            />
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              margin="dense"
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              margin="dense"
              type="password"
            />
          </Box>
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
