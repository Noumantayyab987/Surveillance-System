import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  DialogContent,
  useTheme,
  Dialog,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import InputLabel from "@mui/material/InputLabel";

// Camera Stream component
const CameraStream = ({ selectedCameraIp }) => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/live-camera-reid/stream_camera/${selectedCameraIp}`
    );
    socket.binaryType = "arraybuffer";

    socket.onmessage = function (event) {
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

    socket.onclose = function () {
      console.error(socket);
      alert("Camera stream connection closed");
    };
  }, [selectedCameraIp]);

  return <canvas ref={canvasRef} width="640" height="480" />;
};

const PersonReidentificationPage = () => {
  // State variables
  const [cameraOptions, setCameraOptions] = useState([
    { ip: "Camera 1" },
    { ip: "Camera 2" },
  ]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [targetImage, setTargetImage] = useState(null);
  const [displayMessage, setDisplayMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newCamera, setNewCamera] = useState({
    ip: "",
    username: "",
    password: "",
  });
  const [showCameraStream, setShowCameraStream] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));

  // Add camera option
  const handleAddCamera = () => {
    setOpenDialog(true);
  };

  // Save new camera details
  const handleSaveCamera = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/live-camera-reid/add_camera",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCamera),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        // Handle success response
        setOpenDialog(false);
        setNewCamera({
          ip: "",
          username: "",
          password: "",
        });
        console.log("Camera added successfully!");
      } else {
        setErrorMessage("Camera is not online. Please try again later.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch camera list
  const fetchCameraList = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/live-camera-reid/list_cameras",
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        // Handle success response
        setCameraOptions(data.cameras);
        console.log("Camera list is working fine!");
      } else {
        setErrorMessage("Error fetching camera list. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call fetchCameraList on component mount
  useEffect(() => {
    fetchCameraList();
  }, []);

  // Handle target image upload
  const handleTargetImageUpload = (event) => {
    const file = event.target.files[0];
    setTargetImage(file);
  };

  // Submit form for person re-identification
  const handleSubmit = async () => {
    try {
      // Perform necessary validations
      if (!selectedCamera || !targetImage) {
        setErrorMessage("Please select a camera and upload a target image.");
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("target_image", targetImage);

      const response = await fetch(
        `http://127.0.0.1:8000/live-camera-reid/upload-target-image?camera_ip=${selectedCamera}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();

      // Show the camera stream
      setShowCameraStream(true);

      setDisplayMessage(`Person re-identification in progress.`);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get cookie value
  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
  }

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
        <Header
          title="PERSON RE-IDENTIFICATION"
          subtitle="Re-identify a person via live cameras"
        />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleSubmit}
          >
            Start Re-Identify
          </Button>
        </Box>
      </Box>

      {/* GRID */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* First Box: Add Live Cameras */}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
          >
            <Box
              flexGrow={1}
              onClick={handleAddCamera}
              style={{ cursor: "pointer" }}
            >
              <StatBox
                title="Add Live Cameras"
                subtitle="Add a live camera option"
                icon={
                  <VideoLibraryOutlinedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </Box>
        </Grid>

        {/* Second Box: Cameras List */}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
          >
            <Box flexGrow={1}>
              <Typography variant="h6">Cameras List</Typography>
              {/* Display list of cameras */}
              {cameraOptions.length > 0 ? (
                <Select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                >
                  {cameraOptions.map((camera) => (
                    <MenuItem key={camera.ip} value={camera.ip}>
                      {camera.ip}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography variant="body2">No cameras available</Typography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Third Box: Upload Target Image */}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            style={{ cursor: "pointer" }}
            onClick={() => {
              document.getElementById("target-image-upload").click();
            }}
          >
            <input
              type="file"
              id="target-image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleTargetImageUpload}
            />
            <Typography variant="h6">Upload Target Image</Typography>
            {targetImage && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(targetImage)}
                  alt="Target"
                  style={{ maxWidth: "100%", maxHeight: "150px" }}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Display messages or errors */}
      {displayMessage && <p>{displayMessage}</p>}
      {errorMessage && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}

      {/* Dialog for adding camera */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <Typography variant="h6">Add Live Camera</Typography>
          <TextField
            label="IP Address"
            value={newCamera.ip}
            onChange={(e) =>
              setNewCamera({ ...newCamera, ip: e.target.value })
            }
          />
          <TextField
            label="Username"
            value={newCamera.username}
            onChange={(e) =>
              setNewCamera({ ...newCamera, username: e.target.value })
            }
          />
          <TextField
            label="Password"
            value={newCamera.password}
            onChange={(e) =>
              setNewCamera({ ...newCamera, password: e.target.value })
            }
          />

          <Button onClick={handleSaveCamera}>Save</Button>
          {/* Display messages or errors */}
          {displayMessage && <p>{displayMessage}</p>}
          {errorMessage && (
            <p style={{ color: "red" }}>{errorMessage}</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Camera Stream */}
      {showCameraStream && (
        <Box
          width="100%"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
          p={2}
        >
          <CameraStream selectedCameraIp={selectedCamera} />
        </Box>
      )}
    </Box>
  );
};

export default PersonReidentificationPage;
