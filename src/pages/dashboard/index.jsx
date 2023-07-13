import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);

  const [videoCount, setVideoCount] = useState(0);
  const [cameraCount, setCameraCount] = useState(0);
  const [totalReidCount, setTotalReidCount] = useState(0);

  const getCookieValue = (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchVideoCount = async () => {
      try {
        const accessToken = getCookieValue("access_token");
        if (accessToken) {
          const response = await fetch(
            "http://34.170.11.146/video-reid/get-total-reid-videos",
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setVideoCount(data.total_videos);
          } else {
            console.error("Failed to fetch video count:", response.status);
          }
        } else {
          console.error("Access token not found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching video count:", error);
      }
    };
    
    const fetchCameraCount = async () => {
      try {
        const accessToken = getCookieValue("access_token");
        if (accessToken) {
          const response = await fetch(
            "http://34.170.11.146/live-camera-reid/get-total-cameras",
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setCameraCount(data.total_cameras);
          } else {
            console.error("Failed to fetch camera count:", response.status);
          }
        } else {
          console.error("Access token not found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching camera count:", error);
      }
    };
    

    fetchVideoCount();
    fetchCameraCount();
  }, []);

  useEffect(() => {
    setTotalReidCount(videoCount + cameraCount);
  }, [videoCount, cameraCount]);

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
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={videoCount}
              subtitle="Re-Identify with Video Footage"
              icon={
                <VideoLibraryIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={cameraCount}
              subtitle="Re-Identify with Live-Cameras"
              icon={
                <CameraAltIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={totalReidCount}
              subtitle="How Many Times You Re-identify persons"
              icon={
                <ScheduleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
        
      </Grid>
    </Box>
  );
};

export default Dashboard;
