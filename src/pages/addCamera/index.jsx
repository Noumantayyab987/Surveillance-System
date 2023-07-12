// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
//   Typography,
//   useTheme,
//   useMediaQuery,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2";
// import { tokens } from "../../theme";
// import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
// import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import Header from "../../components/Header";
// import StatBox from "../../components/StatBox";
// import axios from 'axios';

// function getBearerTokenFromCookies() {
//   const cookies = document.cookie.split(";");

//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();

//     if (cookie.startsWith("access_token=")) {
//       const token = cookie.substring("access_token=".length);
//       return token;
//     }
//   }

//   return null; // Return null if the token is not found in cookies
// }

// const Dashboard = () => {
//   const theme = useTheme();
//   const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
//   const colors = tokens(theme.palette.mode);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [openCameraDialog, setOpenCameraDialog] = useState(false);
//   const [cameras, setCameras] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [bearerToken, setBearerToken] = useState(null);
//   const [selectedCamera, setSelectedCamera] = useState(""); // Add the selectedCamera state

//   useEffect(() => {
//     fetchCameraList();
//   }, []);

//   const fetchCameraList = () => {
//     const apiUrl = "http://34.170.11.146/live-camera-reid/list_cameras";
//     const authToken = getBearerTokenFromCookies();
//     console.log("Bearer: " + authToken);
//     axios.get(apiUrl, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//     })
//       .then((response) => {
//         console.log(response.data);
//         setCameras(response.data.cameras);
//       })
//       .catch((error) => {
//         console.error("Error fetching camera list:", error);
//         setErrorMessage("Failed to fetch camera list");
//       });
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     setUploadedImage(file);
//   };

//   const handleStartReidentify = () => {
//     // Add your logic for starting the re-identification process
//   };

//   const handleAddCamera = () => {
//     setOpenCameraDialog(true);
//   };

//   const handleCloseCameraDialog = () => {
//     setOpenCameraDialog(false);
//   };

//   const handleSaveCamera = () => {
//     const ip = document.getElementById("ip-address").value;
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     const apiUrl = "http://127.0.0.1:8000/live-camera-reid/add_camera";
//     const requestBody = JSON.stringify({ ip, username, password });

//     axios.post(apiUrl, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     })
//       .then((response) => {
//         const newCamera = { ip, username, password };
//         setCameras((prevCameras) => [...prevCameras, newCamera]);
//         setOpenCameraDialog(false);
//       })
//       .catch((error) => {
//         console.error("Error adding camera:", error);
//         setErrorMessage("The camera is not online");
//       });
//   };

//   const handleDeleteCamera = (index) => {
//     setCameras((prevCameras) => prevCameras.filter((_, i) => i !== index));
//   };

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Box
//         display={smScreen ? "flex" : "block"}
//         flexDirection={smScreen ? "row" : "column"}
//         justifyContent={smScreen ? "space-between" : "start"}
//         alignItems={smScreen ? "center" : "start"}
//         m="10px 0"
//       >
//         <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
//         <Box>
//           <Button
//             sx={{
//               backgroundColor: colors.blueAccent[600],
//               color: colors.grey[100],
//               fontSize: "14px",
//               fontWeight: "bold",
//               padding: "10px 20px",
//             }}
//             onClick={handleStartReidentify}
//           >
//             Start Re-Identify
//           </Button>
//         </Box>
//       </Box>

//       {/* GRID & CHARTS */}
//       <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//         {cameras.map((camera, index) => (
//           <Grid key={index} item xs={12} sm={12} md={6} lg={4} xl={4}>
//             <Box
//               width="100%"
//               backgroundColor={colors.primary[400]}
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//             >
//               {/* Updated Box */}
//               <Box
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//                 justifyContent="center"
//                 p={2}
//               >
//                 <Typography variant="h6" sx={{ color: colors.grey[100] }}>
//                   Camera {index + 1}
//                 </Typography>
//                 <IconButton
//                   sx={{
//                     backgroundColor: colors.blueAccent[600],
//                     color: colors.grey[100],
//                     fontSize: "26px",
//                   }}
//                   onClick={() => handleDeleteCamera(index)}
//                 >
//                   <VideoLibraryOutlinedIcon />
//                 </IconButton>
//                 <IconButton
//                   sx={{
//                     backgroundColor: colors.red[700],
//                     color: colors.grey[100],
//                     fontSize: "26px",
//                   }}
//                   onClick={() => handleDeleteCamera(index)}
//                 >
//                   <DeleteOutlinedIcon />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))}

//         <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
//           <Box
//             width="100%"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             {/* Add Camera Box */}
//             <Box
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//               justifyContent="center"
//               p={2}
//             >
//               <IconButton
//                 sx={{
//                   backgroundColor: colors.blueAccent[600],
//                   color: colors.grey[100],
//                   fontSize: "26px",
//                 }}
//                 onClick={handleAddCamera}
//               >
//                 <VideoLibraryOutlinedIcon />
//               </IconButton>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ color: colors.grey[100], mt: 1 }}
//               >
//                 Add Camera
//               </Typography>
//             </Box>
//           </Box>
//         </Grid>

//         {/* Camera Dropdown */}
//         <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
//           <Box
//             width="100%"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <Box
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//               justifyContent="center"
//               p={2}
//             >
//               <Typography variant="h6" sx={{ color: colors.grey[100] }}>
//                 Camera List
//               </Typography>
//               <Select
//                 value={selectedCamera} // Bind the selected camera state here
//                 onChange={(event) => setSelectedCamera(event.target.value)} // Add the camera selection handler here
//                 style={{ color: colors.grey[100], mt: 1 }}
//               >
//                 {cameras.map((camera, index) => (
//                   <MenuItem key={index} value={camera.ip}>
//                     {`Camera ${index + 1}`}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Camera Dialog */}
//       <Dialog
//         open={openCameraDialog}
//         onClose={handleCloseCameraDialog}
//         aria-labelledby="camera-dialog-title"
//       >
//         <DialogTitle id="camera-dialog-title">Add Camera</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please enter the IP address, username, and password for the camera.
//           </DialogContentText>
//           <Box display="flex" flexDirection="column">
//             <TextField
//               id="ip-address"
//               label="IP Address"
//               variant="outlined"
//               margin="dense"
//             />
//             <TextField
//               id="username"
//               label="Username"
//               variant="outlined"
//               margin="dense"
//             />
//             <TextField
//               id="password"
//               label="Password"
//               variant="outlined"
//               margin="dense"
//               type="password"
//             />
//           </Box>
//           {errorMessage && (
//             <Typography variant="body1" sx={{ color: "red" }}>
//               {errorMessage}
//             </Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseCameraDialog}>Cancel</Button>
//           <Button onClick={handleSaveCamera}>Save</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Dashboard;
