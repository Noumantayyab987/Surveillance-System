import { useEffect, useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";

import { useSidebarContext } from "./sidebarContext";

import { Link } from 'react-router-dom';
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SwitchRightOutlinedIcon from "@mui/icons-material/SwitchRightOutlined";
import SwitchLeftOutlinedIcon from "@mui/icons-material/SwitchLeftOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = getCookieValue("access_token");
        if (accessToken) {
          const response = await fetch("https://34.30.143.245/user/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              accept: "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error("Failed to fetch user data:", response.status);
          }
        } else {
          console.error("Access token not found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setUserData]);

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

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      routerLink={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const MyProSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();

  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    // Clear cookies or perform any other logout logic
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to the login page or any other desired page
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = getCookieValue("access_token");
        if (accessToken) {
          const response = await fetch("https://34.30.143.245/user/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              accept: "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error("Failed to fetch user data:", response.status);
          }
        } else {
          console.error("Access token not found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setUserData]);

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



  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          // padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: `${colors.blueAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
      }}
    >
      <Sidebar
        breakPoint="md"
        rtl={sidebarRTL}
        backgroundColor={colors.primary[400]}
        image={sidebarImage}
      >
        <Menu iconshape="square">
          <MenuItem
            icon={
              collapsed ? (
                <MenuOutlinedIcon onClick={() => collapseSidebar()} />
              ) : sidebarRTL ? (
                <SwitchLeftOutlinedIcon
                  onClick={() => setSidebarRTL(!sidebarRTL)}
                />
              ) : (
                <SwitchRightOutlinedIcon
                  onClick={() => setSidebarRTL(!sidebarRTL)}
                />
              )
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton
                  onClick={
                    broken ? () => toggleSidebar() : () => collapseSidebar()
                  }
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {userData && (
  <Box mb="25px">
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        "& .avater-image": {
          backgroundColor: colors.primary[500],
        },
      }}
    >
      <img
        className="avater-image"
        alt="profile user"
        width="100px"
        height="100px"
        src={"../../assets/user.png"}
        style={{ cursor: "pointer", borderRadius: "50%" }}
      />
    </Box>
    <Box textAlign="center">
    <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userData.name}

                </Typography>
    </Box>
  </Box>
)}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 20px 5px 20px" }}
            >
              Pages
            </Typography> 
            <Item
              title="Upload Video Footage"
              to="/upload-video"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Video History"
              to="/video-history"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Add Live Cameras"
              to="/add-live-cameras"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              
            />
            
            <box>
              
              <Typography
              
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 20px 5px 20px" }}
                
              >
                
                Log Out
                <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* Add the logout button */}
              </Typography>
            </box>
            
            

            
          </Box>
          
        </Menu>
        
      </Sidebar>
    </Box>
  );
};

export default MyProSidebar;
