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
  const [qrCodeMap, setQrCodeMap] = useState<Record<number, string>>({});
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    const fetchEventData = async () => {
      if (!email) return;

      try {
        const response = await fetch(`${API_URL}/event/getTicket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: email }),
        });

        const rawData = await response.json();
        const grouped: Record<number, EventData> = {};

        rawData.forEach((item: any) => {
          const ticketKey = item.ticketNo;
          if (!grouped[ticketKey]) {
            grouped[ticketKey] = {
              eventId: item.eventId || "0",
              eventName: item.eventName,
              eventDate: item.eventDate,
              time: item.time || "18:00",
              eventLoaction: item.eventLoaction || "Main Venue",
              ticketNo: item.ticketNo,
              members: [],
              message: item.message,
            };
          }

          grouped[ticketKey].members.push({
            name: item.name,
            email: item.userEmail,
            mobile: item.mobile,
            gender: item.gender,
            dob: item.dob,
            idType: item.idType,
            idNumber: item.idNumber,
            userType: item.userType,
          });
        });

        setEventList(Object.values(grouped));

        const qrMap: Record<number, string> = {};
        for (const event of Object.values(grouped)) {
          const qrString = `
🎫 EventHub Ticket Booked
========================
Ticket No   : ${event.ticketNo}
Event       : ${event.eventName}
Date        : ${event.eventDate}
Location    : ${event.eventLoaction}
User Type   : ${event.members[0]?.userType || "N/A"}
Seats Booked: ${event.members.length}

👥 Members List:
${event.members.map((m, i) =>
`------------------------
#${i + 1}
Name       : ${m.name}
Gender     : ${m.gender || ""}
DOB        : ${m.dob || ""}
ID Type    : ${(m.idType || "").toUpperCase()}
ID No.     : ${m.idNumber || ""}
Mobile     : ${m.mobile}`
).join("\n")}

========================
✅ Thank you for booking!
`;
          const qrKey = `${event.eventId}-${event.ticketNo}`;
          qrMap[qrKey] = await QRCode.toDataURL(qrString);
        }
        setQrCodeMap(qrMap);
      } catch (error) {
        console.error("Error fetching event data:", error);
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
      if (yOffset + 160 > doc.internal.pageSize.getHeight()) {
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
        `Name: ${member.name}`,
        `Email: ${member.email}`,
        `Mobile: ${member.mobile}`,
        `Gender: ${member.gender || ""}`,
        `DOB: ${member.dob || ""}`,
        `ID Type: ${member.idType || ""}`,
        `ID Number: ${member.idNumber || ""}`,
        `User Type: ${member.userType || ""}`,
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
    const birthDate = new Date(year, month - 1, day); // Month is 0-indexed
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} yrs`;
  };  
  
  return (
    <Box sx={{ background: "#f4f4f4", minHeight: "100vh", py: 4, px: 2 }}>
     {eventList.length === 0 && (
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
          ⏳ Booking Under Review
        </Typography>
        <Typography variant="body1" color="#e65100">
          No Booked any events.
        </Typography>
      </Box>
      )} 
      <Grid container spacing={4} justifyContent="center">
  {eventList.map((event) => (
    <Grid item xs={12} md={10} key={`${event.ticketNo}_${event.eventId}`}>
      <Box
        sx={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, #ede7f6 0%, #fff 100%)",
          boxShadow: 6,
          border: "2px dashed #7b1fa2",
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
              <Typography variant="h5" fontWeight={700} color="#4a148c">
                {event.eventName}
              </Typography>
              <Typography variant="body1" mt={1}>
                📅 {event.eventDate} | 🕒 {event.time}
              </Typography>
              <Typography variant="body1">📍 {event.eventLoaction}</Typography>
              <Typography variant="body2" mt={1}>
                🎟 Ticket No: {event.ticketNo} | {event.members[0]?.userType === "individual" ? "👤 Booking Type : Individual" : "🏢 Booking Type : Organization"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={600} mb={1} color="#4a148c">
                Members:
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#ce93d8", color: "white" }}>
                      <th style={{ padding: "5px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "5px", textAlign: "left" }}>Gender</th>
                      <th style={{ padding: "5px", textAlign: "left" }}>Age</th>
                      <th style={{ padding: "5px", textAlign: "left" }}>Id Type</th>
                      <th style={{ padding: "5px", textAlign: "left" }}>Id No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.members.map((member, index) => (
                      <tr
                        key={member.idNumber}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#f3e5f5" : "#ffffff",
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
                backgroundColor: "#4a148c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {qrCodeMap[`${event.eventId}-${event.ticketNo}`] && (
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
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Always show this button outside the condition */}
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#6a1b9a", px: 4, py: 1, borderRadius: 3 }}
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
