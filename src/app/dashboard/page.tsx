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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PreviewIcon from "@mui/icons-material/Preview";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import LogoutIcon from "@mui/icons-material/Logout";
import EventDetails from "../eventBooking/eventDetails";
import UploadDocument from "../eventBooking/uploadDocument";
import PreviewAndSubmit from "../eventBooking/previewSubmit";
import TicketDownload from "../eventBooking/TicketDownload";

const drawerWidth = 220;

const menuItems = [
  { text: "Event Details", icon: <EventIcon /> },
  { text: "Upload Document", icon: <UploadFileIcon /> },
  { text: "Preview & Submit", icon: <PreviewIcon /> },
  { text: "Get Ticket", icon: <BookOnlineIcon /> },
];

export default function EventDashboard() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Event Details");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [eventSubmitted, setEventSubmitted] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);

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
          return (
            <UploadDocument
              onUploadSuccess={() => {
                setDocumentUploaded(true);
                setSelectedTab("Preview & Submit");
              }}
            />
          );
      case "Preview & Submit":
        return (
          <PreviewAndSubmit
            onUreviewSubmit={() => {
              setDocumentUploaded(true);
              setSelectedTab("Get Ticket");
            }}
          />
        );
      case "Get Ticket":
        return (
          <TicketDownload />
        );
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
        <List>
  {menuItems.map(({ text, icon }) => {
    const isDisabled =
    (!eventSubmitted && text !== "Event Details" && !eventSubmitted && text !== "Get Ticket") || // Step 1: Before submission, only Event Details is enabled
    (eventSubmitted && !documentUploaded && text === "Review & Submit") || // Step 2: After event submitted, disable Review until document is uploaded
    (eventSubmitted && !documentUploaded && text !== "Event Details" && text !== "Upload Document"); // Step 3: Block all tabs except Event Details and Upload Doc
  
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
              background:"primary"
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
