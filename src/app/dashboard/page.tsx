"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  IconButton,
  Avatar,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  AttachMoney as AttachMoneyIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import EventDetails from "../eventBooking/eventDetails";
import UploadDocument from "../eventBooking/uploadDocument";
import PreviewAndSubmit from "../eventBooking/previewSubmit";
import TicketDownload from "../eventBooking/TicketDownload";

// --- Data Types ---
interface BookingTrend {
  month: string;
  bookings: number;
}

interface TicketType {
  name: string;
  value: number;
}

interface RecentBooking {
  name: string;
  type: string;
  tickets: number;
  event: string;
}

interface UpcomingEvent {
  name: string;
  date: string;
  bookings: number;
}

interface DashboardData {
  totalBookings: number;
  individualBookings: number;
  organizationBookings: number;
  totalRevenue: number;
  recentBookings: RecentBooking[];
  upcomingEvents: UpcomingEvent[];
  bookingTrends: BookingTrend[];
}

// Dummy data for Ticket Type Breakdown (not fetched from API/localStorage in this version)
const ticketTypeData: TicketType[] = [
  { name: "Standard", value: 300 },
  { name: "VIP", value: 150 },
  { name: "Early Bird", value: 200 },
  { name: "Group", value: 100 },
];

// Colors for pie chart segments (a purple-centric palette)
const PIE_COLORS: string[] = ["#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

// Define a custom Material-UI theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#bb86fc", // purple-500
      dark: "#7c3aed", // purple-600
      light: "#a78bfa", // purple-400
    },
    secondary: {
      main: "#03dac6", // green-400
    },
    error: {
      main: "#f43f5e", // rose-500
    },
    warning: {
      main: "#f59e0b", // amber-500
    },
    background: {
      default: "#1f1a24", // gray-900
      paper: "#2a2430", // gray-800
    },
    text: {
      primary: "#ffffff", // gray-100
      secondary: "#b39ddb", // gray-400
      disabled: "#718096", // gray-500
    },
    divider: "#4a5568", // gray-700
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h3: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.75,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.875rem",
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          border: "1px solid #4a5568",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease-in-out",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transform: "translateY(-0.25rem)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom right, rgba(26, 32, 44, 0.1) 0%, transparent 100%)",
            pointerEvents: "none",
            borderRadius: "0.75rem",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          textTransform: "none",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
        sizeLarge: {
          height: "3rem",
          padding: "0.75rem 2rem",
          fontSize: "1rem",
        },
        containedPrimary: {
          backgroundColor: "#7c3aed",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#6d28d9",
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "1.5rem",
          paddingBottom: 0,
        },
        title: {
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#f7fafc",
          // Responsive font size for card headers
          "@media (max-width:600px)": {
            fontSize: "1rem", // Smaller on mobile
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "1.5rem",
          "&:last-child": {
            paddingBottom: "1.5rem",
          },
          // Responsive padding for card content
          "@media (max-width:600px)": {
            padding: "1rem", // Smaller on mobile
            "&:last-child": {
              paddingBottom: "1rem",
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#a78bfa",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        item: {
          "& .MuiCard-root": {
            transition: "all 0.2s ease-in-out",
            border: "1px solid transparent",
            "&:hover": {
              transform: "scale(1.01)",
              borderColor: "#7c3aed",
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2d3748",
          borderRadius: "8px",
          color: "#a0aec0",
        },
        arrow: {
          color: "#2d3748",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          "@media (max-width:600px)": {
            fontSize: "1.5rem", // Smaller h4 on mobile for summary cards
          },
        },
        body1: {
          "@media (max-width:600px)": {
            fontSize: "0.8rem", // Slightly smaller body1 on mobile
          },
        },
        body2: {
          "@media (max-width:600px)": {
            fontSize: "0.7rem", // Slightly smaller body2 on mobile
          },
        },
      },
    },
  },
});

// --- DashboardContent Component ---
const DashboardContent: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // IMPORTANT: Replace with your actual API endpoint.
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    const loadDashboardData = async () => {
      let totalBookings = 0;
      let individualBookings = 0;
      let organizationBookings = 0;
      let totalRevenue = 0;
      let recentBookingsList: RecentBooking[] = [];
      const upcomingEventsMap = new Map<string, UpcomingEvent>();
      const monthlyBookingsAggregation: { [key: string]: number } = {};
      const currentDate = new Date();

      try {
        const apiResponse = await fetch(`${API_URL}/event/getTicket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: userEmail }),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(
            `API error! status: ${apiResponse.status}, message: ${errorText}`
          );
        }

        const apiResult = await apiResponse.json();

        const apiBookingsData = Array.isArray(apiResult)
          ? apiResult.filter(
              (item) =>
                item &&
                item.userType &&
                item.eventName &&
                item.numSeats !== undefined
            )
          : [];

        apiBookingsData.forEach((booking: any) => {
          const numSeats = booking.numSeats || 0;
          totalBookings += numSeats;

          if (booking.userType === "individual") {
            individualBookings += numSeats;
          } else if (booking.userType === "organization") {
            organizationBookings += numSeats;
          }

          recentBookingsList.push({
            name: booking.name || "N/A",
            type: booking.userType,
            tickets: numSeats,
            event: booking.eventName,
          });

          const bookingDate = new Date(booking.createdAt);
          if (!isNaN(bookingDate.getTime())) {
            const monthYear = bookingDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            monthlyBookingsAggregation[monthYear] =
              (monthlyBookingsAggregation[monthYear] || 0) + numSeats;
          }
        });
      } catch (apiError: any) {
        console.error("Failed to fetch booking data from API:", apiError);
        setError(
          `Failed to load booking data: ${apiError.message || "Unknown error"}. Please check the API URL and network.`
        );
      }

      const dynamicBookingTrends: BookingTrend[] = Object.keys(
        monthlyBookingsAggregation
      )
        .map((month) => ({
          month: month,
          bookings: monthlyBookingsAggregation[month],
        }))
        .sort(
          (a, b) =>
            new Date(a.month + " 1").getTime() -
            new Date(b.month + " 1").getTime()
        );

      try {
        const eventsDataString = localStorage.getItem("events");
        let allLocalStorageEvents: any[] = [];

        if (eventsDataString) {
          try {
            allLocalStorageEvents = JSON.parse(eventsDataString);
            allLocalStorageEvents = allLocalStorageEvents.filter(
              (item) =>
                item &&
                (typeof item.eventid === "number" ||
                  typeof item.id === "number")
            );
          } catch (parseError) {
            console.error(
              "Failed to parse events from localStorage:",
              parseError
            );
            setError((prev) =>
              prev
                ? prev +
                  " Also, failed to parse saved events data from localStorage."
                : "Failed to parse saved events data from localStorage. Data might be corrupted."
            );
            allLocalStorageEvents = [];
          }
        }

        allLocalStorageEvents.forEach((event: any) => {
          const eventDateStr = event.date || event.eventDate;
          if (!eventDateStr) {
            console.warn("Event in localStorage missing a date field:", event);
            return;
          }

          const eventDate = new Date(eventDateStr);

          if (eventDate > currentDate) {
            const eventName = event.title || event.eventName || "Unknown Event";
            if (!upcomingEventsMap.has(eventName)) {
              upcomingEventsMap.set(eventName, {
                name: eventName,
                date: new Date(eventDateStr).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                bookings: 0,
              });
            }
          }
        });
      } catch (localStorageError: any) {
        console.error(
          "Failed to load upcoming events from localStorage:",
          localStorageError
        );
        setError((prev) =>
          prev
            ? prev + " Also, failed to load upcoming events from localStorage."
            : `Failed to load upcoming events: ${localStorageError.message || "Unknown error"}. Please check localStorage data.`
        );
      }

      setData({
        totalBookings,
        individualBookings,
        organizationBookings,
        totalRevenue,
        recentBookings: recentBookingsList.sort(
          (a, b) => new Date(b.event).getTime() - new Date(a.event).getTime()
        ),
        upcomingEvents: Array.from(upcomingEventsMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        bookingTrends: dynamicBookingTrends,
      });
    };

    loadDashboardData();
  }, []);

  const theme = useTheme(); // Get the theme to use breakpoints
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check for small screens

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          color: "error.main",
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Error Loading Dashboard
        </Typography>
        <Typography variant="body1" textAlign="center">
          {error}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Please ensure the API is running and accessible, and localStorage data
          is valid JSON.
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={60} sx={{ color: "primary.light" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "text.primary",
        p: { xs: 2, sm: 3, lg: 5 }, // Adjusted padding for smaller screens
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Summary Cards Section: Displays key booking metrics */}
      <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
        {[
          {
            label: "Total Bookings",
            value: data.totalBookings,
            icon: <EventIcon sx={{ color: "primary.light" }} />,
            bgColor: "rgba(67, 20, 169, 0.5)",
            borderColor: "#6d28d9",
          },
          {
            label: "Individual Bookings",
            value: data.individualBookings,
            icon: <PersonIcon sx={{ color: "secondary.main" }} />,
            bgColor: "rgba(5, 150, 105, 0.5)",
            borderColor: "#065f46",
          },
          {
            label: "Organization Bookings",
            value: data.organizationBookings,
            icon: <GroupIcon sx={{ color: "primary.light" }} />,
            bgColor: "rgba(67, 20, 169, 0.5)",
            borderColor: "#6d28d9",
          },
          {
            label: "Total Revenue",
            value: `₹${data.totalRevenue.toLocaleString()}`,
            icon: <AttachMoneyIcon sx={{ color: "warning.main" }} />,
            bgColor: "rgba(180, 83, 9, 0.5)",
            borderColor: "#c2410c",
          },
        ].map((card, idx) => (
          <Grid item xs={12} sm={6} lg={3} key={idx}>
            <Card
              sx={{
                bgcolor: card.bgColor,
                borderColor: card.borderColor,
                "&:hover": { transform: "translateY(-0.25rem)" },
                p: isSmallScreen ? 1 : 0, // Add padding to card itself on small screens
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 }, // Reduced gap on small screens
                  p: { xs: 1.5, sm: 3 }, // Adjusted padding for card content
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    p: { xs: 1, sm: 1.5 }, // Reduced padding for icon circle on small screens
                    borderRadius: "50%",
                    bgcolor: card.bgColor,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: "text.primary", fontSize: { xs: '1.5rem', sm: '1.875rem' } }}> {/* Responsive font size */}
                    {card.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: { xs: '0.8rem', sm: '0.875rem' } }} // Responsive font size
                  >
                    {card.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Upcoming Events Section: Visual data representation */}
      <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
        {/* Booking Trends Chart (Line Chart from Recharts) */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              height: { xs: 250, sm: 320 }, // Adjusted height for mobile
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 }, // Adjusted padding
              bgcolor: "background.paper",
            }}
          >
            <CardHeader title="Booking Trends" sx={{ p: 0, mb: { xs: 1, sm: 2 } }} /> {/* Adjusted margin bottom */}
            <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.bookingTrends}
                  margin={{ top: 5, right: isSmallScreen ? 10 : 30, left: isSmallScreen ? 0 : 20, bottom: 5 }} // Adjusted margins for mobile
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkTheme.palette.divider}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={darkTheme.palette.text.secondary}
                    tick={{ fontSize: isSmallScreen ? 10 : 12 }} // Smaller ticks on mobile
                  />
                  <YAxis
                    stroke={darkTheme.palette.text.secondary}
                    tick={{ fontSize: isSmallScreen ? 10 : 12 }} // Smaller ticks on mobile
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkTheme.palette.background.paper,
                      border: "none",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: darkTheme.palette.text.secondary }}
                    itemStyle={{ color: darkTheme.palette.text.secondary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke={darkTheme.palette.primary.light}
                    strokeWidth={2}
                    dot={{
                      stroke: darkTheme.palette.primary.light,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Ticket Type Breakdown Chart (Pie Chart from Recharts) */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              height: { xs: 250, sm: 320 }, // Adjusted height for mobile
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 }, // Adjusted padding
              bgcolor: "background.paper",
            }}
          >
            <CardHeader title="Ticket Type Breakdown" sx={{ p: 0, mb: { xs: 1, sm: 2 } }} /> {/* Adjusted margin bottom */}
            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isSmallScreen ? 40 : 60} // Smaller radius on mobile
                    outerRadius={isSmallScreen ? 60 : 80} // Smaller radius on mobile
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkTheme.palette.background.paper,
                      border: "none",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: darkTheme.palette.text.secondary }}
                    itemStyle={{ color: darkTheme.palette.text.secondary }}
                  />
                  <Legend
                    layout={isSmallScreen ? "horizontal" : "vertical"} // Horizontal legend on small screens
                    align={isSmallScreen ? "center" : "right"} // Center legend on small screens
                    verticalAlign={isSmallScreen ? "bottom" : "middle"} // Bottom legend on small screens
                    wrapperStyle={{
                      right: isSmallScreen ? 'auto' : -20, // Adjusted position for mobile
                      bottom: isSmallScreen ? 0 : 'auto',
                      top: isSmallScreen ? 'auto' : '50%',
                      transform: isSmallScreen ? 'none' : 'translateY(-50%)',
                      color: darkTheme.palette.text.secondary,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Events & Recent Bookings List Section */}
      <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
        {/* Upcoming Events Card: List of future events, now each as a separate card */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              height: "auto",
              minHeight: { xs: 250, sm: 300 }, // Adjusted minHeight
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 }, // Adjusted padding
            }}
          >
            <CardHeader title="Upcoming Events" sx={{ p: 0, mb: { xs: 1, sm: 2 } }} />
            <CardContent
              sx={{
                p: 0,
                flexGrow: 1,
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": {
                  background: "#374151",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#4b5563",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": { background: "#6b7280" },
              }}
            >
              <Grid container spacing={isSmallScreen ? 1 : 2}> {/* Smaller spacing for cards on mobile */}
                {data.upcomingEvents.map((event, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Card
                      sx={{
                        "&:hover": { borderColor: "primary.dark" },
                        bgcolor: "#2d374800",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: { xs: 1.5, sm: 2 }, // Adjusted padding
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "semibold",
                              color: "text.primary",
                              fontSize: { xs: '0.85rem', sm: '0.875rem' }, // Responsive font size
                            }}
                          >
                            {event.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", fontSize: { xs: '0.75rem', sm: '0.75rem' } }} // Responsive font size
                          >
                            {event.date}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            sx={{ color: "#15f9c5", fontSize: { xs: '0.75rem', sm: '0.75rem' } }} // Responsive font size
                          >
                            Avaliable
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings List - ENHANCED DESIGN: Each booking is now a separate card */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              height: "auto",
              minHeight: { xs: 250, sm: 300 }, // Adjusted minHeight
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 }, // Adjusted padding
            }}
          >
            <CardHeader title="Recent Bookings" sx={{ p: 0, mb: { xs: 1, sm: 2 } }} />
            <CardContent
              sx={{
                p: 0,
                flexGrow: 1,
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": {
                  background: "#374151",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#4b5563",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": { background: "#6b7280" },
              }}
            >
              <Grid container spacing={isSmallScreen ? 1 : 2}> {/* Smaller spacing for cards on mobile */}
                {data.recentBookings.map((booking, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Card
                      sx={{
                        "&:hover": { borderColor: "primary.dark" },
                        bgcolor: "#2d374800",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: { xs: 1.5, sm: 2 }, // Adjusted padding
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "medium",
                                color: "text.primary",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                fontSize: { xs: '0.85rem', sm: '0.875rem' }, // Responsive font size
                              }}
                            >
                              {booking.name} -{" "}
                              <Typography
                                component="span"
                                sx={{
                                  color: "primary.light",
                                  fontWeight: "medium",
                                  fontSize: { xs: '0.85rem', sm: '0.875rem' }, // Responsive font size
                                }}
                              >
                                {booking.tickets} tickets
                              </Typography>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                fontSize: { xs: '0.75rem', sm: '0.75rem' }, // Responsive font size
                              }}
                            >
                              {booking.event} (
                              <Typography
                                component="span"
                                sx={{ fontWeight: "medium" }}
                              >
                                {booking.type}
                              </Typography>
                              )
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// --- Main App Component (handles tabs) ---
const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Dashboard");
  const [eventSubmitted, setEventSubmitted] = useState<boolean>(false);
  const [documentUploaded, setDocumentUploaded] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile drawer
  const router = { push: (path: string) => (window.location.href = path) };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Event Details", icon: <DescriptionIcon /> },
    { text: "Upload Document", icon: <CloudUploadIcon /> },
    { text: "Review & Submit", icon: <CheckCircleIcon /> },
    { text: "View Booking", icon: <ReceiptIcon /> },
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || "User");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Dashboard":
        return <DashboardContent />;
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
              setSelectedTab("Review & Submit");
            }}
          />
        );
      case "Review & Submit":
        return (
          <PreviewAndSubmit
            onUreviewSubmit={() => {
              setSelectedTab("View Booking");
            }}
          />
        );
      case "View Booking":
        return <TicketDownload />;
      default:
        return <Typography>No content found.</Typography>;
    }
  };

  const toggleMobileDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setMobileOpen(open);
    };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        bgcolor: darkTheme.palette.background.paper,
        height: "100%",
      }}
      role="presentation"
      onClick={toggleMobileDrawer(false)}
      onKeyDown={toggleMobileDrawer(false)}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ color: darkTheme.palette.primary.main, flexGrow: 1 }}
        >
          Menu
        </Typography>
        <IconButton
          onClick={toggleMobileDrawer(false)}
          sx={{ color: darkTheme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider sx={{ bgcolor: darkTheme.palette.divider }} />
      <List>
        {menuItems.map(({ text, icon }) => {
          // Re-added isDisabled logic
const isDisabled =
  (!eventSubmitted &&
    text !== "Event Details" &&
    text !== "Dashboard" &&
    text !== "View Booking") || // Step 1: Before submission, only Event Details, Dashboard, and View Booking are enabled
  (eventSubmitted &&
    !documentUploaded &&
    text === "Review & Submit") || // Step 2: After event submitted, disable Review until document is uploaded
  (eventSubmitted &&
    !documentUploaded &&
    text !== "Event Details" &&
    text !== "Dashboard" &&
    text !== "Upload Document" &&
    text !== "View Booking"); // Step 3: Block all tabs except Event Details, Dashboard, Upload Doc, and View Booking

          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={selectedTab === text}
                onClick={() => !isDisabled && setSelectedTab(text)}
                disabled={isDisabled}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(187, 134, 252, 0.16)",
                    "&:hover": {
                      backgroundColor: "rgba(187, 134, 252, 0.24)",
                    },
                  },
                  "&.Mui-disabled": {
                    // Style for disabled items
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      selectedTab === text
                        ? darkTheme.palette.primary.main
                        : darkTheme.palette.text.secondary,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    color:
                      selectedTab === text
                        ? darkTheme.palette.primary.light
                        : darkTheme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ bgcolor: darkTheme.palette.divider }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: darkTheme.palette.error.main }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ color: darkTheme.palette.error.main }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        {/* Top Bar: Branding, Navigation, and User Information */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: darkTheme.palette.background.paper,
            borderBottom: "1px solid",
            borderColor: darkTheme.palette.divider,
            height: { xs: 56, sm: 64 },
            justifyContent: "center",
          }}
        >
          <Toolbar
            sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}
          >
            {/* Logo/Brand */}
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                color: darkTheme.palette.text.primary,
                mr: 2,
              }}
            >
              <Box
                component="span"
                sx={{ color: darkTheme.palette.primary.main }}
              >
                Event
              </Box>
              Hub
            </Typography>
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {menuItems.map((item) => {
                  const isDisabled =
  (!eventSubmitted &&
    item.text !== "Event Details" &&
     item.text !== "Dashboard" &&
     item.text !== "View Booking") || // Step 1: Before submission, only Event Details, Dashboard, and View Booking are enabled
  (eventSubmitted &&
    !documentUploaded &&
     item.text === "Review & Submit") || // Step 2: After event submitted, disable Review until document is uploaded
  (eventSubmitted &&
    !documentUploaded &&
      item.text !== "Event Details" &&
     item.text !== "Dashboard" &&
     item.text !== "Upload Document" &&
     item.text !== "View Booking"); // Step 3: Block all tabs except Event Details, Dashboard, Upload Doc, and View Booking
                  return (
                    <Button
                      key={item.text}
                      variant={selectedTab === item.text ? "contained" : "text"}
                      color="primary"
                      onClick={() => setSelectedTab(item.text)}
                      disabled={isDisabled} // Apply the disabled prop
                      sx={{
                        borderRadius: "9999px",
                        textTransform: "none",
                        minWidth: "auto",
                        px: { xs: 1.5, sm: 2 }, // Responsive padding
                        py: { xs: 0.5, sm: 1 }, // Responsive padding
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                        "&.MuiButton-contained": {
                          backgroundColor: darkTheme.palette.primary.main,
                          color: darkTheme.palette.text.primary,
                        },
                        "&.MuiButton-text": {
                          color: darkTheme.palette.text.secondary,
                          border: "1px solid currentColor",
                          "&:hover": {
                            color: darkTheme.palette.primary.light,
                            backgroundColor: "rgba(187, 134, 252, 0.08)",
                          },
                        },
                        "&.Mui-disabled": {
                          // Style for disabled items
                          opacity: 0.5,
                          cursor: "not-allowed",
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* User Info & Notifications (Desktop) / Hamburger Menu (Mobile) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <IconButton
                sx={{
                  color: darkTheme.palette.text.secondary,
                  "&:hover": { color: darkTheme.palette.primary.light },
                  p: { xs: 0.5, sm: 1 }, // Adjusted padding for icon button
                }}
              >
                <NotificationsIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> {/* Responsive icon size */}
              </IconButton>
              {!isMobile ? (
                <>
                  <Avatar
                    sx={{
                      bgcolor: darkTheme.palette.primary.main,
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      fontSize: { xs: "0.9rem", sm: "1.125rem" },
                      fontWeight: "semibold",
                    }}
                  >
                    {email?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleLogout}
                    sx={{
                      borderRadius: "9999px",
                      textTransform: "none",
                      borderColor: darkTheme.palette.divider,
                      color: darkTheme.palette.text.secondary,
                      "&:hover": {
                        borderColor: darkTheme.palette.error.main,
                        color: darkTheme.palette.error.main,
                        backgroundColor: "rgba(244, 63, 94, 0.1)",
                      },
                      px: { xs: 1.5, sm: 2 }, // Responsive padding
                      py: { xs: 0.5, sm: 1 }, // Responsive padding
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <IconButton
                  color="inherit"
                  onClick={toggleMobileDrawer(true)}
                  sx={{ color: darkTheme.palette.text.primary, p: { xs: 0.5, sm: 1 } }} // Adjusted padding for icon button
                >
                  <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} /> {/* Responsive icon size */}
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <SwipeableDrawer
          anchor="left"
          open={mobileOpen}
          onClose={toggleMobileDrawer(false)}
          onOpen={toggleMobileDrawer(true)}
        >
          {drawerContent}
        </SwipeableDrawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: { xs: "56px", sm: "64px" }, // Adjusted mt for AppBar height
            p: { xs: 1.5, sm: 3 }, // Adjusted padding for main content area
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1200, minHeight: "80vh" }}>
            {renderContent()}
          </Box>
        </Box>

        {/* Floating New Booking Button */}
        {selectedTab === "Dashboard" && (
          <Box sx={{ position: "fixed", bottom: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 }, zIndex: 50 }}> {/* Adjusted position for mobile */}
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"} // Smaller button on mobile
              onClick={() => setSelectedTab("Event Details")}
              sx={{
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  transform: "translateY(-0.25rem)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font size
                px: { xs: 1.5, sm: 2 }, // Adjusted padding for button
                py: { xs: 0.75, sm: 1 }, // Adjusted padding for button
              }}
            >
              <AddIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: '1rem', sm: '1.25rem' } }} /> {/* Responsive icon size */}
              New Booking
            </Button>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            bgcolor: darkTheme.palette.background.paper,
            color: darkTheme.palette.text.primary,
            py: { xs: 1.5, sm: 2 }, // Adjusted padding
            mt: "auto",
            textAlign: "center",
            fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
            borderTop: "1px solid",
            borderColor: darkTheme.palette.divider,
          }}
        >
          <Typography>© 2025 EventHub. All rights reserved.</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default App;