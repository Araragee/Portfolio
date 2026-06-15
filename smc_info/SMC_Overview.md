# Sernan's Music Clinic (SMC) - System Overview

## Main Use
Sernan's Music Clinic (SMC) is a premium, modern web application engineered to modernize the operations of music schools. It acts as a comprehensive digital conservatory that manages class scheduling, student enrollments, teacher assignments, and the purchasing of lessons. The system offers dedicated, role-based dashboards for Administrators, Teachers, and Students, streamlining communication and management into one cohesive platform.

## Key Strengths & Features

### 📅 Intelligent Session & Scheduling Engine
* **Negotiation Workflow**: A collaborative scheduling system where students and teachers can propose, counter-propose, and approve lesson times.
* **Mediation Gate**: Automatically caps counter-proposals at 3 iterations, handing off deadlocked sessions to administrators for resolution.
* **Operating Hours Enforcement**: Automatically restricts session bookings to fall strictly within designated working hours for non-admin users.
* **Interactive Drag-and-Drop Calendar**: Provides administrators with an intuitive interface to easily toggle between week, month, and day views and reschedule classes via drag-and-drop.
* **Self-Cancellation**: Participants are empowered to manage their own schedules by allowing self-cancellation up to 24 hours before a session starts.

### 🔒 Advanced Privacy & Security Hardening
* **HMAC-Signed Uploads**: Protects sensitive uploads like homework and lesson proofs via securely signed URLs that automatically expire after 1 hour, preventing unauthorized access.
* **HttpOnly Authentication**: Protects user sessions from XSS attacks by storing JWT refresh tokens securely inside HttpOnly cookies rather than local JavaScript storage.
* **Strict API Validation**: All backend endpoints enforce rigid character length limits, range constraints, and password strength requirements to prevent injection and payload bloat.
* **First-Login Password Gate**: Enforces an immediate password change redirect for newly seeded or administrative-created accounts upon their first login.

### 🛍️ Integrated Shop & Enrollment Tracking
* **Package Purchasing**: Students can easily browse and buy lesson packages or enroll in specific courses.
* **Atomic Balance Operations**: Employs database-level atomic increment and decrement operations to prevent race conditions during concurrent bookings or inventory deductions.
* **Smart Inventory Management**: Tracks stock levels for shop items (like books and instruments) and proactively triggers automated low-stock warnings for administrators.

### 🖼️ Automatic Upload Optimization
* **WebP Normalization**: Intercepts uploaded images, automatically strips sensitive EXIF metadata, and converts them to the highly optimized WebP format.
* **Auto-Downscaling**: Automatically resizes high-resolution images to a maximum edge size of 2000px, significantly saving bandwidth and storage costs.

### 💻 Modern & Scalable Technical Stack
* **Backend**: Powered by FastAPI (Python), SQLAlchemy ORM, and PostgreSQL for robust, asynchronous API performance.
* **Frontend**: Built with Vue 3 (Composition API), TypeScript, Pinia (State Management), and Tailwind CSS for a highly reactive, type-safe, and visually stunning user interface.
* **Infrastructure**: Fully containerized with Docker and Docker Compose for seamless development and production deployments.
