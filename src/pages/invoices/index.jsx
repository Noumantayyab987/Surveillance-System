import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
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
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [accuracyLevel, setAccuracyLevel] = useState("low");

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setUploadedVideo(file);
  };

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
            Download Log File
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
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6" color="textPrimary" gutterBottom>
          User Information
        </Typography>
        <Typography variant="body1" color="textSecondary">
          ID: [User ID]
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Name: [User   Name]
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Email: [User Email]
        </Typography>
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
