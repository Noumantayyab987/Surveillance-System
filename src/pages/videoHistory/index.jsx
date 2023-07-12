import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);

  const [videoHistory, setVideoHistory] = useState(null);

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
    const fetchVideoHistory = async () => {
      try {
        const accessToken = getCookieValue("access_token");
        if (accessToken) {
          const response = await fetch(
            "http://34.170.11.146/video-reid/history",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setVideoHistory(data.History);
          } else {
            console.error("Failed to fetch video history:", response.status);
          }
        } else {
          console.error("Access token not found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching video history:", error);
      }
    };

    fetchVideoHistory();
  }, []);

  const handleVideoDownload = (videoToken) => {
    window.open(
      `http://34.170.11.146/video-reid/download_video/${videoToken}`
    );
  };

  const handleImageDownload = (imageToken) => {
    window.open(`http://34.170.11.146/video-reid/target-image/${imageToken}`);
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
            // onClick={handleStartReidentify}
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
            flexDirection="column"
            p={2}
          >
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Video History
            </Typography>
            {videoHistory ? (
              videoHistory.map((video, index) => { // Use the index to generate the video ID
                const videoId = `Video ${index + 1}`; // Generate video ID
                const videoData = video[Object.keys(video)[0]];

                return (
                  <Box key={videoId} mt={2}>
                    <Typography variant="body2" color="textPrimary" gutterBottom>
                      {videoId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Accuracy: {videoData.accuracy}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Created Date: {videoData["created date"]}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Created Time: {videoData["created time"]}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleVideoDownload(videoData.video)}
                    >
                      Download Video
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleImageDownload(videoData.image)}
                    >
                      Download Image
                    </Button>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body1" color="textSecondary">
                Loading video history...
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
