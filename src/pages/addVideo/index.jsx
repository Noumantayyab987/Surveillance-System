import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  DialogContent,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { Select, MenuItem } from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
  const [video, setVideo] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reIdentifyInProgress, setReIdentifyInProgress] = useState(false);
  const [accuracyLevel, setAccuracyLevel] = useState("low");
  const [displayMessage, setDisplayMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [videoError, setVideoError] = useState(false);



  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("video/")) {
      setErrorMessage("Please upload a valid video file");
      return;
    }
    setVideoError(false); // Reset videoError state
    setVideo(file);
  };
  

  const handlePictureUpload = (e) => {
    const files = Array.from(e.target.files);
    const unsupportedFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (unsupportedFiles.length > 0) {
      setErrorMessage("Please upload valid image files");
      return;
    }
    const newPictures = [...pictures, ...files];
    setPictures(newPictures);
    setSelectedImage(files[0]);
  };

  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
  }

  const handleReIdentifyStart = async () => {
    console.log("Re-Identify button clicked");
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      alert("You need to be logged in to use this feature");
      return;
    }
    setReIdentifyInProgress(true);
    setDisplayMessage(
      "Your task is being processed. Your task is in queue. After completion, the video will be sent to your Email address"
    );

    const formData = new FormData();
    formData.append("video", video, video.name);

    for (let i = 0; i < pictures.length; i++) {
      formData.append("target_image", selectedImage, pictures[i].name);
    }

    if (!video || !pictures.length || reIdentifyInProgress) {
      console.log("Invalid video or pictures");
      return;
    }

    try {
      const apiUrl = `http://34.170.11.146/video-reid/upload?accuracy=${accuracyLevel}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setDisplayMessage(
        `Your task is being processed. Your task is in queue. After completion, the video will be sent to your Email address. Queue Number: ${data.queue_number}, Email: ${data.email}`
      );

      setReIdentifyInProgress(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccuracyLevelChange = (e) => setAccuracyLevel(e.target.value);

  const handleDeleteVideo = () => {
    setVideo(null);
  };

  const handleDeletePicture = (index) => {
    const newPictures = [...pictures];
    newPictures.splice(index, 1);
    setPictures(newPictures);
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
            onClick={handleReIdentifyStart}
            disabled={!video || pictures.length === 0 || reIdentifyInProgress}
          >
            {reIdentifyInProgress ? "Re-Identifying in process..." : "Start Re-Identify"}
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
          >
            <label htmlFor="video-upload" style={{ cursor: "pointer" }}>
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleVideoUpload}
              />
              <StatBox
                title="Upload Video"
                subtitle="Re-Identify with Video Footage"
                icon={
                  <VideoLibraryOutlinedIcon
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
            <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePictureUpload}
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
              {pictures.map((picture, index) => (
                <div key={index} className="picture-item">
                  {/* eslint-disable-next-line */}
                  <img
                    src={URL.createObjectURL(picture)}
                    className="uploaded-image"
                    alt={`Uploaded Image ${index}`}
                    height={100}
                    width={100}
                  />
                  {pictures.map((picture, index) => (
              <Box key={index} ml={1}>
                <Typography variant="subtitle2">{picture.name}</Typography>
                
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1,
                  color: "#FFFFFF", // Text color
                  backgroundColor: "#FF0000", // Background color
                  }}
                  onClick={() => handleDeletePicture(index)}
                >
                  Delete
                </Button>
              </Box>
            ))}
                </div>
              ))}
              {video && (
                <div className="picture-item">
                  <video
  src={URL.createObjectURL(video)}
  className="uploaded-image"
  height={100}
  width={100}
  onMouseEnter={(e) => e.target.play()}
  onMouseLeave={(e) => e.target.pause()}
  onError={() => setVideoError(true)} // Handle video error
/>
                  
                  {video && (
              <Box ml={1}>
                <Typography variant="subtitle2">{video.name}</Typography>
                
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1,
                    color: "#FFFFFF", // Text color
                    backgroundColor: "#FF0000", // Background color
                    }}
                  onClick={handleDeleteVideo}
                >
                  Delete
                </Button>
              </Box>
            )}
                </div>
              )}
            </Box>
          </Box>
          {displayMessage && <p className="message">{displayMessage}</p>}
          <DialogContent>
  {/* Existing JSX content */}
  {errorMessage && (
    <Box
      mt={2}
      bgcolor="error.main"
      color="error.contrastText"
      p={2}
      borderRadius={4}
    >
      {errorMessage}
    </Box>
  )}
  {videoError && (
  <Box
    mt={2}
    bgcolor="error.main"
    color="error.contrastText"
    p={2}
    borderRadius={4}
  >
    Error playing the video. Please make sure it is a supported format.
  </Box>
)}

</DialogContent>
          
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
