# 🎫 Event Booking System

A full-stack event booking platform developed using **Next.js**, **Nest.js**, and **MySQL**. The system allows users to register for events, upload documents, add member details, and download tickets with QR codes.

---

## 🚀 Tech Stack

- **Frontend**: Next.js, React.js, Material UI (MUI)
- **Backend**: Nest.js, TypeORM
- **Database**: MySQL (hosted on Railway)
- **Other Tools**: Axios, QR Code Generator, PDFKit

---

## 📦 Deployment

| Layer      | Platform  | URL                                     |
|------------|-----------|-----------------------------------------|
| Frontend   | Vercel    | https://event-booking-react.vercel.app/ |
| Backend    | Render    | https://your-backend.onrender.com       |
| Database   | Railway   | MySQL hosted on Railway                 |

> ✅ Make sure to update the `.env` files with your Railway DB credentials and Render backend URL in your frontend.

---

## 📌 Features

- 🎟️ Event booking form with dynamic fields
- 🧍 Individual or 🏢 Organization-based registration
- 📁 Conditional document uploads
- ➕ Inline Add/Edit/Delete multiple members
- 📍 Structured address selection (State, District, Pincode)
- 👀 Preview & Submit before final submission
- 🧾 Download ticket with QR code
- 📱 Fully responsive and modern design
- 🔐 Section-wise navigation with access control

---

## 🗂️ Project Structure

event-booking/ ├── frontend/ # Next.js frontend │ ├── components/ # Reusable components │ ├── pages/ # Routing pages │ └── styles/ # MUI & global styles │ └── backend/ # Nest.js backend ├── src/ │ ├── modules/ # Event, Member, Document │ ├── database/ # TypeORM config │ └── main.ts # Entry point

yaml
Copy
Edit

---

## ⚙️ Getting Started (Locally)

### Prerequisites

- Node.js (v18 or higher)
- MySQL or Railway DB access

---

### 1. Clone the Repository

```bash
git clone https://github.com/chandanlog/EventBooking-React.git
cd event-booking
2. Setup Frontend (Next.js)
bash
Copy
Edit
cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:3000

3. Setup Backend (Nest.js)
git clone https://github.com/chandanlog/EventBooking-API.git
Copy
Edit
cd backend
npm install
Create a .env file inside backend/:

env
Copy
Edit
PORT=5000
DB_HOST=your-db-host-from-railway
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=event_booking
Run backend:

bash
Copy
Edit
npm run start:dev
Backend runs on: http://localhost:5000

🌐 Environment Variables
Frontend .env.local
env
Copy
Edit
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
Backend .env
env
Copy
Edit
PORT=5000
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=username
DB_PASSWORD=password
DB_DATABASE=event_booking
🔌 API Endpoints

Method	Endpoint	Description
POST	/event	Submit event details
POST	/member	Add member details
POST	/document/upload	Upload ID proof/documents
GET	/preview/:userId	Get preview before submission
GET	/ticket/:userId	Download ticket with QR code

🧠 Future Enhancements
Admin panel for managing events & users

Email/SMS notification system

Payment gateway integration

Auto-generated event certificates

Multilingual support
