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
import LandingPage from "./pages/landingPage"

import Home from "./pages/landingPage/Home";
// import About from "./pages/landingPage/About";
// import Contact from "./pages/landingPage/Contact";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer/Footer";


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
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
        
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <Registration />
            }
          />
          
          {/* <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} /> */}
          
        </Routes>
        {isAuthenticated() && (
          <MyProSidebarProvider>
            <div style={{ height: "100%", width: "100%" }}>
              <main>
                {/* Topbar */}
                <Topbar />

                {/* Routes */}
                <Routes>
                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      isAuthenticated() ? (
                        <Dashboard />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
                  <Route
                    path="/upload-video"
                    element={
                      isAuthenticated() ? (
                        <UploadVideo />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
                  <Route
                    path="/add-live-cameras"
                    element={
                      isAuthenticated() ? (
                        <AddCamera />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />

                  <Route
                    path="/video-history"
                    element={
                      isAuthenticated() ? (
                        <VideoHistory />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />

                  <Route
                    path="/landing"
                    element={
                      isAuthenticated() ? (
                        <LandingPage />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
                </Routes>
              </main>
            </div>
          </MyProSidebarProvider>
        )}
      </ThemeProvider>
      
    </ColorModeContext.Provider>
    
  );
  
};

export default App;
