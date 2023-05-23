import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import Topbar from "./pages/global/Topbar";

import Dashboard from "./pages/dashboard";
import Team from "./pages/addVideo";
import Invoices from "./pages/profile";
import Contacts from "./pages/addCamera";
import Registration from "./pages/registration";

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
        <Route
                  path="/"
                  element={<Registration />}
                />
        
        </Routes>
        <MyProSidebarProvider>
          <div style={{ height: "100%", width: "100%" }}>
            <main>
              {/* Topbar */}
              <Topbar />

              {/* Routes */}
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload-video" element={<Team />} />
                <Route path="/add-live-cameras" element={<Contacts />} />
                <Route path="/profile" element={<Invoices />} />

                {/* Registration route without the topbar, sidebar, and other components */}
                
              </Routes>
            </main>
          </div>
        </MyProSidebarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
