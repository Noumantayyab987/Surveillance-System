import React from "react";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import { useTheme, Box, IconButton, useMediaQuery } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useProSidebar } from "react-pro-sidebar";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggleSidebar } = useProSidebar();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        {isMobileScreen && (
          <IconButton onClick={() => toggleSidebar()}>
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
