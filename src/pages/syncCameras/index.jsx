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
import InputLabel from '@mui/material/InputLabel';


const SyncCamerasPage = () => {
  // State variables
  const [networkOptions, setNetworkOptions] = useState([
    {
      network_ip: "192.168.100.1",
      network_username: "admin",
      network_password: "admin",
    },
    {
      network_ip: "192.168.200.1",
      network_username: "admin",
      network_password: "admin",
    },
  ]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [cameras, setCameras] = useState(() => {
    return [
      { camera_id: "Camera 1", network_ip: "192.168.100.1" },
      { camera_id: "Camera 2", network_ip: "192.168.100.1" },
    ];
  });
  
  
  const [targetImage, setTargetImage] = useState(null);
  const [displayMessage, setDisplayMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const [newNetwork, setNewNetwork] = useState({
    network_ip: "",
    network_username: "",
    network_password: "",
  });

  // Add network option
  const handleAddNetwork = () => {
    setOpenDialog(true);
  };

  // Save new network details
  // Save new network details
const handleSaveNetwork = async () => {
    try {
      const response = await fetch(
        "http://34.170.11.146/sync-camera-network/add-Network",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNetwork),
        }
      );
      if (response.status === 422) {
        setErrorMessage("Network is not online. Please check the network and try again.");
      } else {
        const data = await response.json();
        // Handle success response
        setOpenDialog(false);
        setNewNetwork({
          network_ip: "",
          network_username: "",
          network_password: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Delete network option
  const handleDeleteNetwork = async (networkIp) => {
    try {
      const response = await fetch(
        `http://34.170.11.146/sync-camera-network/delete-network?network_ip=${networkIp}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      const data = await response.json();
      // Handle success or error response
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch cameras for selected network
  // Fetch cameras for selected network
  const fetchCameras = async () => {
    try {
      let data = [];
      if (selectedNetwork) {
        const response = await fetch(
          `http://34.170.11.146/sync-camera-network/list-camera?network_ip=${selectedNetwork}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${getCookie("access_token")}`,
            },
          }
        );
        const responseData = await response.json();
        if (Array.isArray(responseData)) {
          data = responseData;
        }
      }
      setCameras(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Call fetchCameras whenever selectedNetwork changes
  useEffect(() => {
    fetchCameras();
  }, [selectedNetwork]);  // Handle target image upload
  const handleTargetImageUpload = (event) => {
    const file = event.target.files[0];
    setTargetImage(file);
  };

  // Submit form for syncing cameras
  const handleSubmit = async () => {
    try {
      // Perform necessary validations
      if (!selectedNetwork || !targetImage) {
        setErrorMessage("Please select a network and upload a target image.");
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("network_ip", selectedNetwork);
      formData.append("target_image", targetImage);

      const response = await fetch(
        `http://34.170.11.146/sync-camera-network/upload-target-image?network_ip=${selectedNetwork}`,
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
      setDisplayMessage(
        `Syncing cameras in progress. Please wait... Queue Number: ${data.queue_number}, Email: ${data.email}`
      );

      // Handle success or error response
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
            Start Re-Identify
          </Button>
        </Box>
      </Box>

      {/* GRID */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* First Box: Add Network Option */}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
          >
            <Box flexGrow={1} onClick={handleAddNetwork} style={{ cursor: "pointer" }}>
              <StatBox
                title="Add Network"
                subtitle="Add a network option"
                icon={
                  <VideoLibraryOutlinedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </Box>
        </Grid>

        {/*Second Box: List of Networks*/}
<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
  <Box width="100%" backgroundColor={colors.primary[400]} display="flex">
    <Box flexGrow={1}>
      <Typography variant="h6">List of Networks</Typography>
      {/* Display list of networks */}
      <Select
        value={selectedNetwork}
        onChange={(e) => setSelectedNetwork(e.target.value)}
      >
        {networkOptions.map((network) => (
          <MenuItem key={network.network_ip} value={network.network_ip}>
            {network.network_ip}
          </MenuItem>
        ))}
      </Select>
    </Box>
    {selectedNetwork && (
      <Button
        variant="contained"
        color="error"
        onClick={() => handleDeleteNetwork(selectedNetwork)}
      >
        Delete Network
      </Button>
    )}
  </Box>
</Grid>


        {/* Third Box: List of Cameras */}
   

<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
  <Box width="100%" backgroundColor={colors.primary[400]} display="flex">
    <Box flexGrow={1}>
      <InputLabel id="cameras-select-label">List of Cameras</InputLabel> {/* Add InputLabel */}
      {/* Display list of cameras */}
      <Select
        displayEmpty
        value=""
        disabled
        labelId="cameras-select-label"
      >
        <MenuItem value="" disabled>
          Select a camera
        </MenuItem>
        {cameras.map((camera) => (
          <MenuItem key={camera.camera_id} value={camera.camera_id}>
            {camera.camera_id}
          </MenuItem>
        ))}
      </Select>
    </Box>
  </Box>
</Grid>




        {/* Fourth Box: Upload Target Image */}
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
      {errorMessage && <p>{errorMessage}</p>}

      {/* Submit button */}
      <Button onClick={handleSubmit}>Sync Cameras</Button>

      {/* Dialog for adding network */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <Typography variant="h6">Add Network</Typography>
          <TextField
            label="Network IP"
            value={newNetwork.network_ip}
            onChange={(e) =>
              setNewNetwork({ ...newNetwork, network_ip: e.target.value })
            }
          />
          <TextField
            label="Network Username"
            value={newNetwork.network_username}
            onChange={(e) =>
              setNewNetwork({ ...newNetwork, network_username: e.target.value })
            }
          />
          <TextField
            label="Network Password"
            value={newNetwork.network_password}
            onChange={(e) =>
              setNewNetwork({ ...newNetwork, network_password: e.target.value })
            }
          />
          <Button onClick={handleSaveNetwork}>Save</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SyncCamerasPage;
