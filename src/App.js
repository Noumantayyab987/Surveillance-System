import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import { useEffect, useState } from "react";

import Topbar from "./pages/global/Topbar";
import Dashboard from "./pages/dashboard";
import UploadVideo from "./pages/addVideo";
import AddCamera from "./pages/addCamera";
import Registration from "./pages/registration";
import VideoHistory from "./pages/videoHistory";

const App = () => {
  const [theme, colorMode] = useMode();
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    // Retrieve the access token from cookies
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split("=");
      if (parts[0] === "access_token") {
        setAccessToken(parts[1]);
        break;
      }
    }
  }, []);

  // Function to check if the user has access token
  const isAuthenticated = () => {
    return !!accessToken;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" />
              ) : (
                <Registration />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? (
                <>
                  <Topbar />
                  <MyProSidebarProvider>
                    <Dashboard />
                  </MyProSidebarProvider>
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/upload-video"
            element={
              isAuthenticated() ? (
                <>
                  <Topbar />
                  <MyProSidebarProvider>
                    <UploadVideo />
                  </MyProSidebarProvider>
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/add-live-cameras"
            element={
              isAuthenticated() ? (
                <>
                  <Topbar />
                  <MyProSidebarProvider>
                    <AddCamera />
                  </MyProSidebarProvider>
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/video-history"
            element={
              isAuthenticated() ? (
                <>
                  <Topbar />
                  <MyProSidebarProvider>
                    <VideoHistory />
                  </MyProSidebarProvider>
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
