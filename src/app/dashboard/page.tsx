// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   Container,
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
// } from "@mui/material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import EventDetails from "../eventBooking/eventDetails";

// export default function DashboardPage() {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const router = useRouter();

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     sessionStorage.removeItem("token");
//     router.push("/");
//   };

//   return (
//     <Box sx={{ bgcolor: "#f4f4f9", minHeight: "100vh" }}>
//       <AppBar position="static" sx={{ bgcolor: "#3b0083", boxShadow: 5 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
//             Event Dashboard
//           </Typography>
//           <IconButton onClick={handleMenuOpen} color="inherit">
//             <Avatar sx={{ bgcolor: "#fff" }}>
//               <AccountCircleIcon color="primary" />
//             </Avatar>
//           </IconButton>
//           <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//             <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//             <MenuItem onClick={handleLogout}>Logout</MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>

//       <Container sx={{ textAlign: "center", mt: 4, maxWidth: "800px" }}>
//         <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#3b0083" }}>
//           Event Booking Form
//         </Typography>

//         {/* ✅ Stepper with Custom Color */}
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {["Event Details", "Upload Image", "Review & Submit"].map((label, index) => (
//             <Step key={label}>
//               <StepLabel
//                 sx={{
//                   "& .MuiStepLabel-label": {
//                     color: "#9e9e9e", // default color
//                     mb:2,
//                   },
//                   "& .MuiStepLabel-label.Mui-active": {
//                     color: "#3b0083",
//                     fontWeight: "bold",
//                     mb:2,
//                   },
//                   "& .MuiStepLabel-label.Mui-completed": {
//                     color: "#3b0083",
//                     mb:2,
//                   },
//                 }}
//               >
//                 {label}
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         <EventDetails />
//       </Container>
//     </Box>
//   );
// }
"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem,
  Avatar, Box, Drawer, List, ListItem, ListItemIcon, Tooltip,
  CssBaseline, useTheme, ListItemButton, Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import UploadIcon from "@mui/icons-material/People";
import MessageIcon from "@mui/icons-material/Message";
import LinkIcon from "@mui/icons-material/Link";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import EventDetails from "../eventBooking/eventDetails";
import UploadDocument from "../eventBooking/uploadDocument";

const drawerWidth = 220;

const menuItems = [
  { text: "Event Details", icon: <EventIcon /> },
  { text: "Upload Document", icon: <UploadIcon /> },
  { text: "Messages", icon: <MessageIcon /> },
  { text: "RSVP Link", icon: <LinkIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
];

export default function EventDashboard() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Event Details");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [eventSubmitted, setEventSubmitted] = useState(false);

  useEffect(() => {
    // Only runs on client
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || "");
  }, []);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/");
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Event Details":
        return (
          <EventDetails
            onSubmitSuccess={() => {
              setEventSubmitted(true);
              setSelectedTab("Upload Document");
            }}
          />
        );
      case "Upload Document":
        return <UploadDocument />;
      case "Messages":
      case "RSVP Link":
      case "Settings":
        return <Typography>No access until submission</Typography>;
      default:
        return <Typography>No content found.</Typography>;
    }
  };
  

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "#3b0083",
          width: openSidebar ? `calc(100% - ${drawerWidth}px)` : "100%",
          ml: openSidebar ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit" onClick={toggleSidebar} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Event Booking - {selectedTab}
          </Typography>
           <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: "4px 12px",
        borderRadius: "20px",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
        gap: 1.2,
        ml: 2,
      }}
    >
      <Avatar
        sx={{
          width: 30,
          height: 30,
          bgcolor: "#3b0083",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        {email?.charAt(0)?.toUpperCase() || "U"}
      </Avatar>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: "#3b0083",
          fontSize: "0.85rem",
          maxWidth: 120,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {email || "User"}
      </Typography>
    </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: openSidebar ? drawerWidth : 64,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: openSidebar ? drawerWidth : 64,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxShadow: 2,
            bgcolor: "#fff",
            overflowX: "hidden",
          },
        }}
        open={openSidebar}
      >
        <Toolbar />
        {/* <List>
          {menuItems.map(({ text, icon }) => (
            <Tooltip title={openSidebar ? "" : text} placement="right" key={text}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedTab === text}
                  onClick={() => setSelectedTab(text)}
                  sx={{
                    justifyContent: openSidebar ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openSidebar ? 2 : "auto",
                      justifyContent: "center",
                      color: "#3b0083",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {openSidebar && (
                    <Typography fontSize={14} color="#3b0083">
                      {text}
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List> */}
        <List>
  {menuItems.map(({ text, icon }) => {
    const isDisabled =
      (!eventSubmitted && text !== "Event Details") || // Before submission: only Event Details enabled
      (eventSubmitted && text !== "Upload Document");  // After submission: only Upload Document enabled

    return (
      <Tooltip title={openSidebar ? "" : text} placement="right" key={text}>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedTab === text}
            onClick={() => !isDisabled && setSelectedTab(text)}
            disabled={isDisabled}
            sx={{
              justifyContent: openSidebar ? "initial" : "center",
              px: 2.5,
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: openSidebar ? 2 : "auto",
                justifyContent: "center",
                color: "#3b0083",
              }}
            >
              {icon}
            </ListItemIcon>
            {openSidebar && (
              <Typography fontSize={14} color="#3b0083">
                {text}
              </Typography>
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    );
  })}
</List>

        <Divider />
        <List>
          <Tooltip title={openSidebar ? "" : "Logout"} placement="right">
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  justifyContent: openSidebar ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openSidebar ? 2 : "auto",
                    justifyContent: "center",
                    color: "red",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {openSidebar && (
                  <Typography fontSize={14} color="red">
                    Logout
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          mt: 8,
          bgcolor: "#f4f4f9",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1000px",
            minHeight: "80vh",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}
