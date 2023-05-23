import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
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
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reIdentifyInProgress, setReIdentifyInProgress] = useState(false);
  const [accuracyLevel, setAccuracyLevel] = useState("low");
  const [displayMessage, setDisplayMessage] = useState("");

  const handleVideoUpload = (e) => {
    const newVideos = [...videos];
    newVideos.push(e.target.files[0]);
    setVideos(newVideos);
    setSelectedVideo(e.target.files[0]);
  };

  const handlePictureUpload = (e) => {
    const newPictures = [...pictures];
    for (let i = 0; i < e.target.files.length; i++) {
      newPictures.push(e.target.files[i]);
    }
    setPictures(newPictures);
    setSelectedImage(e.target.files[0]);
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
    formData.append("video", selectedVideo, selectedVideo.name);

    for (let i = 0; i < pictures.length; i++) {
      formData.append("target_image", selectedImage, pictures[i].name);
    }
    console.log("Videos:", videos);
console.log("Pictures:", pictures);

if (!videos || !pictures || reIdentifyInProgress) {
  console.log("Invalid videos or pictures");
  return;
}

    try {
      const apiUrl = `https://34.30.143.245/video-reid/upload?accuracy=${accuracyLevel}`;
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
            disabled={!videos || !pictures || reIdentifyInProgress}
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
            {videos && (
              <Box ml={1}>
                <Typography variant="subtitle2">{videos.name}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    // Handle view video
                  }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    // Handle delete video
                  }}
                >
                  Delete
                </Button>
              </Box>
            )}
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
            {pictures && (
              <Box ml={1}>
                <Typography variant="subtitle2">{pictures.name}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    // Handle view image
                  }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    // Handle delete image
                  }}
                >
                  Delete
                </Button>
              </Box>
            )}
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
              {videos.map((video, index) => (
              <div key={index} className="picture-item">
                <video src={URL.createObjectURL(video)} className="uploaded-image"  height={100} width={100} onMouseEnter={(e) => e.target.play()}onMouseLeave={(e) => e.target.pause()}/>

              </div>
            ))}
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
  </div>
))}
             
            </Box>
          </Box>
          {displayMessage && <p className="message">{displayMessage}</p>}

        </Grid>
        
      </Grid>
    </Box>
  );
};

export default Dashboard;