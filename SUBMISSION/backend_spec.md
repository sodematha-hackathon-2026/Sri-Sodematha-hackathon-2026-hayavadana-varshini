# Backend Technical Specification - Team Hayavadana

## 1. System Architecture
The Seva Platform backend is built using **Java 17** with **Spring Boot 3.2**. It follows a strictly decoupled RESTful architecture, ensuring that core business logic is abstracted from the data layer.

## 2. Database Schema
We use **MySQL 8.x** (with H2 fallback for demo portability). The schema is designed for GDPR compliance and auditability.

### Entity Relationship Diagram (Summary)
- **User**: (id, name, mobileNumber, email, role, rashi, nakshatra, gotra, deviceToken, volunteerStatus)
- **Seva**: (id, name, description, price, type [POOJA, ALANKARA, etc.], activeStatus)
- **SevaBooking**: (id, userId, sevaId, bookingDate, status [PENDING, CONFIRMED, REJECTED], referenceNumber, sankalpaDetails)
- **RoomRequest**: (id, userId, checkInDate, checkOutDate, numberOfPeople, status)
- **News/FlashUpdate**: (id, title, content, imageUrl, flashStatus, publishedAt)
- **Notification**: (id, userMobile, title, message, timestamp, isRead)

## 3. API Documentation
All endpoints are prefixed with `/api`. Common headers: `Content-Type: application/json`.

### 3.1 Authentication
- `POST /users`: Register a new devotee.
- `GET /users/mobile/{mobile}`: Fetch user profile by mobile (Real-time sync with Firebase).
- `PUT /users/{id}`: Update profile (includes device token registration for Push).

### 3.2 Seva Management
- `GET /sevas`: Fetch list of all active sevas categorized by type.
- `POST /seva-bookings`: Create a new booking. Generates unique reference ID.
- `GET /seva-bookings/user/{mobile}`: Fetch booking history for a specific devotee.

### 3.3 Accommodation (Room Booking)
- `POST /room-requests`: Submit a room availability request.
- `GET /room-requests/user/{mobile}`: Track status of room requests.

### 3.4 Content & Notifications
- `GET /news`: Fetch latest matha updates and flash news.
- `GET /notifications/user/{mobile}`: In-app notification history.

## 4. Third-Party Integrations
- **Firebase Admin SDK**: For real-time push notification delivery.
- **Firebase Auth**: Server-side verification of mobile number identity.
- **Google Maps API**: Geographic resolution for Branch Dictionary.

## 5. Security Measures
- **Role-Based Access Control (RBAC)**: Distinguishes between Devotees and Administrative Staff.
- **Consent Flags**: `consentDataStorage` and `consentCommunications` are strictly tracked in the user model to meet legal privacy requirements.
