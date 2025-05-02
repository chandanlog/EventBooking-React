"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Box, Drawer, List,
  ListItem, ListItemIcon, ListItemButton, CssBaseline, Divider, useMediaQuery,
  useTheme, Tooltip, SwipeableDrawer
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LogoutIcon from "@mui/icons-material/Logout";
import ApproveTicket from './approveTicket'
import AddEvent from "./addEvent";
const drawerWidth = 220;

const menuItems = [
  { text: "Approve Ticket", icon: <HowToRegIcon /> },
  { text: "Add Event", icon: <EventAvailableIcon /> },
];

export default function EventDashboard() {
  const [selectedTab, setSelectedTab] = useState("Approve Ticket");
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    setEmail(storedEmail || "User");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/admin");
  };

  const drawerContent = (
    <List>
      {menuItems.map(({ text, icon }) => (
        <Tooltip key={text} title={!hovered && !isMobile ? text : ""} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedTab === text}
              onClick={() => setSelectedTab(text)}
              sx={{
                justifyContent: hovered || isMobile ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: hovered || isMobile ? 2 : "auto",
                  justifyContent: "center",
                  color: "#3b0083",
                }}
              >
                {icon}
              </ListItemIcon>
              {(hovered || isMobile) && (
                <Typography fontSize={14} color="#3b0083">
                  {text}
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      ))}

      <Divider sx={{ my: 1 }} />

      <Tooltip title={!hovered && !isMobile ? "Logout" : ""} placement="right">
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              justifyContent: hovered || isMobile ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: hovered || isMobile ? 2 : "auto",
                justifyContent: "center",
                color: "red",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {(hovered || isMobile) && (
              <Typography fontSize={14} color="red">
                Logout
              </Typography>
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    </List>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "Approve Ticket":
        return(
          <ApproveTicket />
        )
      case "Add Event":
        return (
          <AddEvent />
        )
      default:
        return <Typography>No content found.</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "#3b0083",
          height: 56,
          [theme.breakpoints.up("sm")]: { height: 64 },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "inherit !important" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem", py: "12px" }}
          >
            EventHub
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffffff",
                padding: "4px 10px",
                borderRadius: "20px",
                gap: 1,
              }}
            >
              <Avatar sx={{ width: 28, height: 28, bgcolor: "#3b0083", fontSize: 13 }}>
                {email?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#3b0083",
                  fontSize: "0.8rem",
                  maxWidth: 100,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          sx={{
            width: hovered ? drawerWidth : 64,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: hovered ? drawerWidth : 64,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              boxShadow: 2,
              bgcolor: "#fff",
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <SwipeableDrawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
        >
          <Box sx={{ width: drawerWidth }} role="presentation">
            <Toolbar />
            {drawerContent}
          </Box>
        </SwipeableDrawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: isMobile ? 7 : 8,
          p: isMobile ? 1.5 : 3,
          bgcolor: "#f4f4f9",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1000, minHeight: "80vh" }}>
          {renderContent()}
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "#3b0083",
          color: "white",
          py: 2,
          mt: "auto",
          textAlign: "center",
          fontSize: "0.875rem",
        }}
      >
        <Typography>© 2025 EventHub. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}
