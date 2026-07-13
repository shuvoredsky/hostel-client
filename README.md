# 🏠 DhakaStay

**DhakaStay** is a full-stack rental management platform built to help students, working professionals, and families in Dhaka find verified rooms, seats, and flats (basha) — and to help property owners list, manage, and monetize their spaces with confidence.

The platform supports four distinct user roles (**Student**, **Tenant**, **Owner**, **Admin**), an end-to-end booking and payment pipeline (including split installment payments), a student verification system, and rich listing discovery features like amenities, gender/family preferences, and Google Maps integration.

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 Live Site (Frontend) | [https://hostel-client-theta.vercel.app/](https://hostel-client-theta.vercel.app/) |
| ⚙️ Live API (Backend) | [https://hostel-server-api.onrender.com](https://hostel-server-api.onrender.com) |
| 💻 Frontend Repository | [github.com/shuvoredsky/hostel-client](https://github.com/shuvoredsky/hostel-client) |
| 🖥️ Backend Repository | [github.com/shuvoredsky/hostel-server](https://github.com/shuvoredsky/hostel-server) |

> ⚠️ Note: The backend is hosted on Render's free tier, so the API may take 30–60 seconds to respond on the first request after a period of inactivity (cold start).

---

## 📌 Project Overview

DhakaStay connects two sides of the rental market in Dhaka:

- **Owners** list their rooms, seats, or full apartments (basha), complete with photos, amenities, pricing, and special offers.
- **Students, Tenants (non-students), and Families** browse verified listings, filter by what matters to them, and book directly through the platform — with secure payments and automatic commission handling.

An **Admin** oversees the entire platform: approving listings, verifying student identities, and monitoring platform-wide revenue.

---

## 👥 User Roles

### 🎓 Student
- Registers with gender info required upfront (used for gender-restricted listings)
- Can submit university ID card for **verification** (Pending → Verified/Rejected by Admin)
- Browses listings, books rooms, chats with owners, leaves reviews, and manages a wishlist
- Eligible for **student-exclusive discounts** and **half-monthly (installment) rent payments**

### 🏢 Tenant (Non-Student)
- A 4th role added for non-student renters — job holders, freelancers, interns, business people, and families
- Registers with Tenant Type (Job Holder / Freelancer / Intern / Business Person / Family / Others) and optional Profession
- Has full booking, payment, wishlist, review, and messaging parity with Students (via shared backend permission checks and a dedicated Tenant dashboard)
- Exclusively eligible to book listings marked **"Family"** preference (Students are blocked from these)

### 🏠 Owner
- Registers with a required WhatsApp/contact number for direct tenant contact
- Creates listings with images, pricing, amenities, gas type, nearby landmarks, and a Google Maps location link
- Sets **student-exclusive offers** per listing: discount %, advance payment requirement, gender/family preference, and half-monthly payment eligibility
- Manages incoming booking requests (accept/reject) and tracks revenue/commission on a dedicated dashboard

### 🛡️ Admin
- Approves or rejects new listings before they go live
- Reviews and approves/rejects student ID verification submissions
- Monitors platform-wide bookings, payments, users, and commission revenue

---

## ✨ Key Features

### 🔍 Listing Discovery
- Search and filter by area, city, price range, listing type (Room / Seat / Basha), and availability
- **Gender & Family filtering** — Boys Only / Girls Only / Family / Anyone
- Amenity badges: WiFi, Filtered Water, AC, Lift, 24/7 Security, CCTV, Parking
- Gas type indicator (Cylinder / Supply Line)
- Nearby landmark tagging (University / Metro Station / Bus Stop) with custom labels
- One-click **"View on Google Maps"** location link on listing detail pages

### ✅ Student Verification System
- Students upload their university ID card, university name, department, and session
- Admin reviews submissions with an image preview, and approves or rejects (with a reason)
- Status displayed to the student as Pending / Verified / Rejected, with resubmission support after rejection

### 💸 Student Exclusive Offers (Owner-Controlled, Per Listing)
- Configurable student discount: 0% / 5% / 10% / 15%
- Advance payment requirement: No Advance / 1 Month / 2 Months
- Gender/Family preference enforcement at booking time
- Optional **Half-Monthly Payment Plan** — splits rent into two installments (second due 15 days later)

### 📅 Booking & Payment Pipeline
- Booking requests with move-in date, optional message, and payment plan selection (Full / Half-Monthly)
- Gender/Family eligibility is validated both on the frontend and backend before a booking is accepted
- Secure payments via **SSLCommerz** payment gateway
- Automatic **discount breakdown** shown at payment time (original rent → discount → payable amount)
- Installment tracking for half-monthly plans, with per-installment status (Pending / Paid / Overdue)
- **10% platform commission** automatically calculated and credited to Admin per completed payment (including partial credit per installment for half-monthly plans), with the remainder credited to the Owner
- Booking auto-confirms once all required payments are completed

### 💬 Messaging & Reviews
- Direct owner–renter chat (real-time via Socket.io)
- Verified booking-based reviews (rating + comment), with edit/delete for the review author

### 🖼️ Dashboards
- Role-specific dashboards for Student, Tenant, Owner, and Admin — each with tailored navigation, stats, and management tools
- Shared, reusable components across Student/Tenant dashboards to avoid duplication (bookings, payments, chat)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** (utility-first styling, no external UI kit)
- **React Hook Form** + **Zod** for form state and validation
- **Axios** for API communication
- **Framer Motion** for animations
- **Socket.io Client** for real-time chat
- **Sonner** for toast notifications
- **Lucide React** for icons

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **Better-Auth** for authentication (JWT access/refresh tokens via cookies)
- **Multer** + **Cloudinary** for image uploads
- **SSLCommerz** for payment processing
- **Socket.io** for real-time messaging

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL (hosted)

---

## 📂 Project Structure (High-Level)

**Backend** (`hostel-server`)
```
src/app/module/
├── auth/            # Registration (Student/Tenant/Owner), login
├── verification/    # Student ID verification workflow
├── listing/         # Listing CRUD, amenities, offers, approval
├── booking/         # Booking requests, gender/family validation
├── payment/         # SSLCommerz integration, installments, commission
├── review/          # Booking-based reviews
├── wishlist/         # Save/unsave listings
├── chat/            # Real-time messaging
├── dashboard/       # Role-specific dashboard aggregation
├── user/            # User/profile management
└── settings/        # Platform settings
```

**Frontend** (`hostel-client`)
```
src/
├── app/
│   ├── (commonLayout)/(authRouteGroup)/   # Login, register, password flows
│   ├── (dashboardLayout)/
│   │   ├── (studentDashboardLayout)/student/
│   │   ├── (tenantDashboardLayout)/tenant/
│   │   ├── (ownerDashboardLayout)/owner/
│   │   └── (adminDashboardLayout)/admin/
│   └── listings/                         # Public listing browse & detail
├── components/modules/                   # Feature-organized components
├── services/                             # Axios API service layers
├── types/                                # Shared TypeScript types
└── zod/                                  # Form validation schemas
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account (image uploads)
- SSLCommerz sandbox credentials (payments)

### Backend Setup
```bash
git clone https://github.com/shuvoredsky/hostel-server.git
cd hostel-server
npm install
# create a .env file with DATABASE_URL, JWT secrets, Cloudinary keys, SSLCommerz keys, etc.
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
git clone https://github.com/shuvoredsky/hostel-client.git
cd hostel-client
npm install
# create a .env.local file with NEXT_PUBLIC_API_BASE_URL pointing to your backend
npm run dev
```

---

## 🧭 Roadmap / Possible Future Enhancements
- Advanced search ranking and recommendation
- Push notifications for booking/payment updates
- In-app document generation (rental agreements)
- Owner analytics and occupancy insights

---

## 📄 License

This project was developed as part of an academic assignment (Next Level Web Development). All rights reserved by the author unless otherwise noted.

---

## 🙋 Author

**Shuvo Redsky**
- GitHub: [@shuvoredsky](https://github.com/shuvoredsky)