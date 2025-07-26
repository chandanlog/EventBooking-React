// "use client";
// import React, { useEffect, useState } from "react";
// import QRCode from "qrcode";
// import jsPDF from "jspdf";
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Divider,
//   useMediaQuery,
//   useTheme,
//   colors,
// } from "@mui/material";

// interface Member {
//   name: string;
//   email: string;
//   mobile: string;
//   gender?: string;
//   dob?: string;
//   idType?: string;
//   idNumber?: string;
//   userType?: string;
// }

// interface EventData {
//   eventId: number;
//   organizationName: string,
//   eventName: string;
//   eventDate: string;
//   time: string;
//   eventLoaction: string;
//   ticketNo: string;
//   members: Member[];
//   message: string;
// }

// const TicketDownload: React.FC = () => {
//   const [eventList, setEventList] = useState<EventData[]>([]);
//   const [qrCodeMap, setQrCodeMap] = useState<Record<number, string>>({});
//   const [backendMessage, setBackendMessage] = useState<string | null>(null);
//   const API_URL = process.env.NEXT_PUBLIC_API_URL;
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

//   useEffect(() => {
//     const fetchEventData = async () => {
//       if (!email) return;

//       try {
//         const response = await fetch(`${API_URL}/event/getTicket`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userEmail: email }),
//         });

//         const rawData = await response.json();
//         const grouped: Record<number, EventData> = {};

//         rawData.forEach((item: any) => {
//           const ticketKey = item.ticketNo;
//           if (!grouped[ticketKey]) {
//             grouped[ticketKey] = {
//               eventId: item.eventId || "0",
//               organizationName: item.organizationName,
//               eventName: item.eventName,
//               eventDate: item.eventDate,
//               time: item.time || "18:00",
//               eventLoaction: item.eventLoaction || "Main Venue",
//               ticketNo: item.ticketNo,
//               members: [],
//               message: item.message,
//             };
//           }

//           grouped[ticketKey].members.push({
//             name: item.name,
//             email: item.userEmail,
//             mobile: item.mobile,
//             gender: item.gender,
//             dob: item.dob,
//             idType: item.idType,
//             idNumber: item.idNumber,
//             userType: item.userType,
//           });
//         });

//         setEventList(Object.values(grouped));

//         const qrMap: Record<number, string> = {};
//         for (const event of Object.values(grouped)) {
//           const qrString = `
// 🎫 EventHub Ticket Booked
// ========================
// Ticket No   : ${event.ticketNo}
// Event       : ${event.eventName}
// Date        : ${event.eventDate}
// Location    : ${event.eventLoaction}
// ${event.members[0]?.userType === "individual" ? "👤 Individual" : "🏢 Organization : "} ${event.members[0]?.userType === "organization" ? `${event.organizationName}` : ""}
// Seats Booked: ${event.members.length}

// 👥 Members List:
// ${event.members.map((m, i) =>
// `------------------------
// #${i + 1}
// Name       : ${m.name}
// Gender     : ${m.gender || ""}
// DOB        : ${m.dob || ""}
// ID Type    : ${(m.idType || "").toUpperCase()}
// ID No.     : ${m.idNumber || ""}
// Mobile     : ${m.mobile}`
// ).join("\n")}

// ========================
// ✅ Thank you for booking!
// `;
//           const qrKey = `${event.eventId}-${event.ticketNo}`;
//           qrMap[qrKey] = await QRCode.toDataURL(qrString);
//         }
//         setQrCodeMap(qrMap);
//       } catch (error) {
//         console.error("Error fetching event data:", error);
//       }
//     };

//     fetchEventData();
//   }, [API_URL, email]);

//   const generatePDF = async (event: EventData) => {
//     const doc = new jsPDF("p", "pt", "a4");
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 40;

//     doc.setFillColor(105, 61, 144);
//     doc.rect(0, 0, pageWidth, 150, "F");

//     doc.setTextColor("white");
//     doc.setFontSize(14);
//     doc.text(`Ticket No: ${event.ticketNo}`, margin, 40);
//     const qrKeys = `${event.eventId}-${event.ticketNo}`;
//     const qrImage = qrCodeMap[qrKeys];
//     if (qrImage) {
//       doc.addImage(qrImage, "PNG", pageWidth - 160, 30, 100, 100);
//     }

//     doc.setFontSize(18);
//     doc.text(event.eventName, margin, 90);
//     doc.setFontSize(12);
//     doc.text(`Date: ${event.eventDate}`, margin, 110);
//     doc.text(`Time: ${event.time}`, margin, 125);
//     doc.text(`Location: ${event.eventLoaction}`, margin, 140);

//     let yOffset = 180;

//     event.members.forEach((member, index) => {
//       if (yOffset + 160 > doc.internal.pageSize.getHeight()) {
//         doc.addPage();
//         yOffset = margin;
//       }

//       doc.setFillColor(237, 231, 246);
//       doc.roundedRect(margin, yOffset, pageWidth - 2 * margin, 140, 10, 10, "F");

//       doc.setDrawColor(123, 31, 162);
//       doc.setLineWidth(1);
//       doc.roundedRect(margin, yOffset, pageWidth - 2 * margin, 140, 10, 10);

//       doc.setTextColor(51, 0, 102);
//       doc.setFontSize(11);

//       const rowSpacing = 22;
//       let lineY = yOffset + 25;

//       const rowData = [
//         `Name: ${member.name}`,
//         `Email: ${member.email}`,
//         `Mobile: ${member.mobile}`,
//         `Gender: ${member.gender || ""}`,
//         `DOB: ${member.dob || ""}`,
//         `ID Type: ${member.idType || ""}`,
//         `ID Number: ${member.idNumber || ""}`,
//         `User Type: ${member.userType || ""}`,
//       ];

//       for (let i = 0; i < 4; i++) {
//         const leftText = rowData[i * 2] || "";
//         const rightText = rowData[i * 2 + 1] || "";
//         doc.text(leftText, margin + 15, lineY);
//         doc.text(rightText, pageWidth / 2 + 5, lineY);
//         lineY += rowSpacing;
//       }

//       yOffset += 160;
//     });

//     doc.save(`${event.ticketNo || "EventTicket"}.pdf`);
//   };

//   const calculateAge = (dob?: string): string => {
//     if (!dob) return "N/A";
//     const [year, month, day] = dob.split("-").map(Number);
//     const birthDate = new Date(year, month - 1, day); // Month is 0-indexed
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return `${age} yrs`;
//   };  
  
//   return (
//     <Box sx={{ background: "", minHeight: "100vh", py: 4, px: 2 }}>
//      {eventList.length === 0 && (
//       <Box
//         sx={{
//           maxWidth: 600,
//           margin: "auto",
//           p: 4,
//           mt: 10,
//           textAlign: "center",
//           border: "1px dashed #ff9800",
//           borderRadius: 3,
//           backgroundColor: "#fff8e1",
//         }}
//       >
//         <Typography variant="h6" color="#e65100" gutterBottom>
//           ⏳ Booking Under Review
//         </Typography>
//         <Typography variant="body1" color="#e65100">
//           No Booked any events.
//         </Typography>
//       </Box>
//       )} 
//       <Grid container spacing={4} justifyContent="center">
//   {eventList.map((event) => (
//     <Grid item xs={12} md={10} key={`${event.ticketNo}_${event.eventId}`}>
//       <Box
//         sx={{
//           borderRadius: "20px",
//           background: "linear-gradient(135deg, #2a2430 0%, #2a2430 100%)",
//           boxShadow: 6,
//           border: "1px solid white",
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           overflow: "hidden",
//           position: "relative",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             right: "-30px",
//             bottom: 0,
//             width: "60px",
//             background: "linear-gradient(135deg, #ff4081, #f50057)",
//             clipPath: "polygon(100% 0%, 0% 0%, 100% 100%, 0% 100%)",
//           }}
//         />

//         {event.message ? (
//           <Box
//             sx={{
//               maxWidth: 500,
//               margin: "auto",
//               p: 4,
//               mt: 5,
//               mb: 5,
//               textAlign: "center",
//               border: "1px dashed #ff9800",
//               borderRadius: 3,
//               backgroundColor: "#fff8e1",
//               width: "100%",
//             }}
//           >
//             <Typography variant="h6" color="#e65100" gutterBottom>
//               ⏳ Booking Under Review
//             </Typography>
//             <Typography variant="body1" color="#e65100">
//               {event.message}
//             </Typography>
//           </Box>
//         ) : (
//           <>
//            <Box sx={{ flex: 3, p: 4 }}>
//   <Typography variant="h5" fontWeight={700} color="primary.main">
//     {event.eventName}
//   </Typography>
//   <Typography variant="body1" mt={1}>
//     📅 {event.eventDate} | 🕒 {event.time}
//   </Typography>
//   <Typography variant="body1">📍 {event.eventLoaction} | {event.members[0]?.userType === "individual" ? "👤 Individual" : "🏢 Organization : "} {event.members[0]?.userType === "organization" ? `${event.organizationName}` : ""}</Typography>
//   <Typography variant="body2" mt={1}>
//   🎟 Ticket No: {event.ticketNo}
//   </Typography>
//   <Divider sx={{ my: 2 }} />
//   <Typography fontWeight={600} mb={1} color="primary.main">
//     Members:
//   </Typography>
  
//   <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
//     <table style={{ width: "100%", borderCollapse: "collapse" }}>
//       <thead>
//         <tr style={{ backgroundColor: "#1a1a1a" }}>
//           <th style={{ padding: "5px", textAlign: "left", color:"#bb86fc", fontWeight: "100" }}>Name</th>
//           <th style={{ padding: "5px", textAlign: "left", color:"#bb86fc", fontWeight: "100" }}>Gender</th>
//           <th style={{ padding: "5px", textAlign: "left", color:"#bb86fc", fontWeight: "100" }}>Age</th>
//           <th style={{ padding: "5px", textAlign: "left", color:"#bb86fc", fontWeight: "100" }}>Id Type</th>
//           <th style={{ padding: "5px", textAlign: "left", color:"#bb86fc", fontWeight: "100" }}>Id No</th>
//         </tr>
//       </thead>
//       <tbody>
//         {event.members.map((member, index) => (
//           <tr
//             key={member.idNumber}
//             style={{
//               backgroundColor: index % 2 === 0 ? "#bb86fc" : "#bb86fc",
//             }}
//           >
//             <td style={{ padding: "5px" }}>{member.name}</td>
//             <td style={{ padding: "5px" }}>{member.gender}</td>
//             <td style={{ padding: "5px" }}>{calculateAge(member.dob)}</td>
//             <td style={{ padding: "5px" }}>{member.idType}</td>
//             <td style={{ padding: "5px" }}>{member.idNumber}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </Box>
// </Box>

//             <Box
//               sx={{
//                 flex: 1,
//                 p: 2,
//                 backgroundColor: "primary.main",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {qrCodeMap[`${event.eventId}-${event.ticketNo}`] && (
//                 <img
//                   src={qrCodeMap[`${event.eventId}-${event.ticketNo}`]}
//                   alt="QR Code"
//                   style={{
//                     width: isMobile ? 100 : 140,
//                     height: isMobile ? 100 : 140,
//                     background: "white",
//                     padding: 8,
//                     borderRadius: 10,
//                   }}
//                 />
//               )}
//             </Box>
//           </>
//         )}
//       </Box>

//       {/* Always show this button outside the condition */}
//       <Box textAlign="center" mt={2}>
//         <Button
//           variant="contained"
//           sx={{ color:'white', px: 4, py: 1, borderRadius: 3 }}
//           onClick={() => generatePDF(event)}
//           disabled={Boolean(event.message)}
//         >
//           Download Ticket
//         </Button>
//       </Box>
//     </Grid>
//   ))}
// </Grid>

       
//     </Box>
//   );
// };

// export default TicketDownload;
"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  colors,
} from "@mui/material";

interface Member {
  name: string;
  email: string;
  mobile: string;
  gender?: string;
  dob?: string;
  idType?: string;
  idNumber?: string;
  userType?: string;
}

interface EventData {
  eventId: number;
  organizationName: string;
  eventName: string;
  eventDate: string;
  time: string;
  eventLoaction: string;
  ticketNo: string;
  members: Member[];
  message: string;
}

const TicketDownload: React.FC = () => {
  const [eventList, setEventList] = useState<EventData[]>([]);
  const [qrCodeMap, setQrCodeMap] = useState<Record<string, string>>({});
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    const fetchEventData = async () => {
      if (!email) {
        setBackendMessage("User email not found. Please log in.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/event/getTicket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        const grouped: Record<string, EventData> = {};

        rawData.forEach((item: any) => {
          const ticketNo = String(item.ticketNo);
          const eventId = String(item.eventId || '0');
          const uniqueGroupingKey = `${ticketNo}-${eventId}`;

          if (!grouped[uniqueGroupingKey]) {
            grouped[uniqueGroupingKey] = {
              eventId: Number(item.eventId) || 0,
              organizationName: item.organizationName || "N/A",
              eventName: item.eventName || "Unknown Event",
              eventDate: item.eventDate || "N/A",
              time: item.time || "18:00",
              eventLoaction: item.eventLoaction || "Main Venue",
              ticketNo: ticketNo,
              members: [],
              message: item.message || "",
            };
          }

          grouped[uniqueGroupingKey].members.push({
            name: item.name || "Guest",
            email: item.userEmail || "N/A",
            mobile: item.mobile || "N/A",
            gender: item.gender || "",
            dob: item.dob || "",
            idType: item.idType || "",
            idNumber: item.idNumber || "",
            userType: item.userType || "",
          });
        });

        const processedEvents = Object.values(grouped);
        setEventList(processedEvents);

        if (processedEvents.length === 0) {
            setBackendMessage("No events booked yet or no tickets available.");
        } else {
            setBackendMessage(null); // Clear any previous messages
        }

        const qrMap: Record<string, string> = {};
        for (const event of processedEvents) {
          const qrKey = `${event.eventId}-${event.ticketNo}`;
          const qrString = `
🎫 EventHub Ticket Booked
========================
Ticket No   : ${event.ticketNo}
Event       : ${event.eventName}
Date        : ${event.eventDate}
Location    : ${event.eventLoaction}
${event.members[0]?.userType === "individual" ? "👤 Individual" : "🏢 Organization : "} ${event.members[0]?.userType === "organization" ? `${event.organizationName}` : ""}
Seats Booked: ${event.members.length}

👥 Members List:
${event.members.map((m, i) =>
            `------------------------
#${i + 1}
Name        : ${m.name}
Gender      : ${m.gender || "N/A"}
DOB         : ${m.dob || "N/A"}
ID Type     : ${(m.idType || "N/A").toUpperCase()}
ID No.      : ${m.idNumber || "N/A"}
Mobile      : ${m.mobile || "N/A"}`
          ).join("\n")}

========================
✅ Thank you for booking!
`;
          try {
            qrMap[qrKey] = await QRCode.toDataURL(qrString);
          } catch (qrError) {
            console.error(`Error generating QR for ${qrKey}:`, qrError);
            qrMap[qrKey] = '';
          }
        }
        setQrCodeMap(qrMap);
      } catch (error: any) {
        console.error("Error fetching event data:", error);
        setBackendMessage(error.message || "Failed to load events. Please try again later.");
      }
    };

    fetchEventData();
  }, [API_URL, email]);

  const generatePDF = async (event: EventData) => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    doc.setFillColor(105, 61, 144);
    doc.rect(0, 0, pageWidth, 150, "F");

    doc.setTextColor("white");
    doc.setFontSize(14);
    doc.text(`Ticket No: ${event.ticketNo}`, margin, 40);
    const qrKeys = `${event.eventId}-${event.ticketNo}`;
    const qrImage = qrCodeMap[qrKeys];
    if (qrImage) {
      doc.addImage(qrImage, "PNG", pageWidth - 160, 30, 100, 100);
    }

    doc.setFontSize(18);
    doc.text(event.eventName, margin, 90);
    doc.setFontSize(12);
    doc.text(`Date: ${event.eventDate}`, margin, 110);
    doc.text(`Time: ${event.time}`, margin, 125);
    doc.text(`Location: ${event.eventLoaction}`, margin, 140);

    let yOffset = 180;

    event.members.forEach((member, index) => {
      if (yOffset + 160 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yOffset = margin;
      }

      doc.setFillColor(237, 231, 246);
      doc.roundedRect(margin, yOffset, pageWidth - 2 * margin, 140, 10, 10, "F");

      doc.setDrawColor(123, 31, 162);
      doc.setLineWidth(1);
      doc.roundedRect(margin, yOffset, pageWidth - 2 * margin, 140, 10, 10);

      doc.setTextColor(51, 0, 102);
      doc.setFontSize(11);

      const rowSpacing = 22;
      let lineY = yOffset + 25;

      const rowData = [
        `Name: ${member.name || "N/A"}`,
        `Email: ${member.email || "N/A"}`,
        `Mobile: ${member.mobile || "N/A"}`,
        `Gender: ${member.gender || "N/A"}`,
        `DOB: ${member.dob || "N/A"}`,
        `ID Type: ${member.idType || "N/A"}`,
        `ID Number: ${member.idNumber || "N/A"}`,
        `User Type: ${member.userType || "N/A"}`,
      ];

      for (let i = 0; i < 4; i++) {
        const leftText = rowData[i * 2] || "";
        const rightText = rowData[i * 2 + 1] || "";
        doc.text(leftText, margin + 15, lineY);
        doc.text(rightText, pageWidth / 2 + 5, lineY);
        lineY += rowSpacing;
      }

      yOffset += 160;
    });

    doc.save(`${event.ticketNo || "EventTicket"}.pdf`);
  };

  const calculateAge = (dob?: string): string => {
    if (!dob) return "N/A";
    const [year, month, day] = dob.split("-").map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        return "Invalid DOB";
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
        return "Invalid DOB";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} yrs`;
  };

  return (
    <Box sx={{ background: "", minHeight: "100vh", py: 4, px: 2 }}>
      {(eventList.length === 0 && backendMessage) && ( // Show message box if no events AND a backend message is set
        <Box
          sx={{
            maxWidth: 600,
            margin: "auto",
            p: 4,
            mt: 10,
            textAlign: "center",
            border: "1px dashed #e57373",
            borderRadius: 3,
            backgroundColor: "#ffebee",
          }}
        >
          <Typography variant="h6" color="#c62828" gutterBottom>
            ⚠️ Info
          </Typography>
          <Typography variant="body1" color="#c62828">
            {backendMessage}
          </Typography>
        </Box>
      )}
      {eventList.length === 0 && !backendMessage && ( // Only show "no events" if list is empty and no backend message
         <Box
          sx={{
            maxWidth: 600,
            margin: "auto",
            p: 4,
            mt: 10,
            textAlign: "center",
            border: "1px dashed #ff9800",
            borderRadius: 3,
            backgroundColor: "#fff8e1",
          }}
        >
          <Typography variant="h6" color="#e65100" gutterBottom>
            ⏳ No Bookings Yet
          </Typography>
          <Typography variant="body1" color="#e65100">
            It looks like you haven't booked any events yet.
          </Typography>
        </Box>
      )}


      <Grid container spacing={4} justifyContent="center">
        {eventList.map((event) => (
          <Grid item xs={12} md={10} key={`${event.ticketNo}_${event.eventId}`}>
            <Box
              sx={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, #2a2430 0%, #2a2430 100%)",
                boxShadow: 6,
                border: "1px solid white",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: "-30px",
                  bottom: 0,
                  width: "60px",
                  background: "linear-gradient(135deg, #ff4081, #f50057)",
                  clipPath: "polygon(100% 0%, 0% 0%, 100% 100%, 0% 100%)",
                }}
              />

              {event.message ? (
                <Box
                  sx={{
                    maxWidth: 500,
                    margin: "auto",
                    p: 4,
                    mt: 5,
                    mb: 5,
                    textAlign: "center",
                    border: "1px dashed #ff9800",
                    borderRadius: 3,
                    backgroundColor: "#fff8e1",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" color="#e65100" gutterBottom>
                    ⏳ Booking Under Review
                  </Typography>
                  <Typography variant="body1" color="#e65100">
                    {event.message}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ flex: 3, p: 4 }}>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {event.eventName}
                    </Typography>
                    <Typography variant="body1" mt={1}>
                      📅 {event.eventDate} | 🕒 {event.time}
                    </Typography>
                    <Typography variant="body1">
                      📍 {event.eventLoaction} |{" "}
                      {event.members[0]?.userType === "individual"
                        ? "👤 Individual"
                        : "🏢 Organization : "}{" "}
                      {event.members[0]?.userType === "organization"
                        ? `${event.organizationName}`
                        : ""}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      🎟 Ticket No: {event.ticketNo}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight={600} mb={1} color="primary.main">
                      Members:
                    </Typography>

                    <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#1a1a1a" }}>
                            <th
                              style={{ padding: "5px", textAlign: "left", color: "#bb86fc", fontWeight: "100" }}
                            >
                              Name
                            </th>
                            <th
                              style={{ padding: "5px", textAlign: "left", color: "#bb86fc", fontWeight: "100" }}
                            >
                              Gender
                            </th>
                            <th
                              style={{ padding: "5px", textAlign: "left", color: "#bb86fc", fontWeight: "100" }}
                            >
                              Age
                            </th>
                            <th
                              style={{ padding: "5px", textAlign: "left", color: "#bb86fc", fontWeight: "100" }}
                            >
                              Id Type
                            </th>
                            <th
                              style={{ padding: "5px", textAlign: "left", color: "#bb86fc", fontWeight: "100" }}
                            >
                              Id No
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {event.members.map((member, index) => (
                            <tr
                              // **THE FINAL FIX FOR KEY HERE**
                              // Guaranteeing uniqueness by using event-specific details + member's array index
                              key={`${event.ticketNo}-${event.eventId}-${index}`}
                              style={{
                                backgroundColor: index % 2 === 0 ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
                                color: "white"
                              }}
                            >
                              <td style={{ padding: "5px" }}>{member.name}</td>
                              <td style={{ padding: "5px" }}>{member.gender}</td>
                              <td style={{ padding: "5px" }}>{calculateAge(member.dob)}</td>
                              <td style={{ padding: "5px" }}>{member.idType}</td>
                              <td style={{ padding: "5px" }}>{member.idNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {qrCodeMap[`${event.eventId}-${event.ticketNo}`] ? (
                      <img
                        src={qrCodeMap[`${event.eventId}-${event.ticketNo}`]}
                        alt="QR Code"
                        style={{
                          width: isMobile ? 100 : 140,
                          height: isMobile ? 100 : 140,
                          background: "white",
                          padding: 8,
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <Typography variant="caption" color="white" textAlign="center">
                        QR Code not available
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>

            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                sx={{ color: "white", px: 4, py: 1, borderRadius: 3 }}
                onClick={() => generatePDF(event)}
                disabled={Boolean(event.message)}
              >
                Download Ticket
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TicketDownload;