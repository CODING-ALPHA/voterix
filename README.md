# Voterix - Advanced Voting Platform (Frontend)

Voterix is a high-performance, secure, and user-friendly voting platform designed to handle elections of any scale—from small associations to large institutional bodies. Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**, it provides a premium administrative experience and a seamless voting flow for students.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.17 or higher
- **Package Manager**: npm, yarn, or pnpm

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dolapo001/voterix-fronten.git
   cd voterix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-endpoint.com/api
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4 (using CSS variables and modern utility-first approach)
- **Icons**: Lucide React
- **State Management**: React Context API (`AuthContext`)
- **Typography**: Google Fonts (Poppins, Manrope, Lato, Bebas Neue, Mulish)
- **Animations**: CSS Transitions & Subtle Micro-interactions

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── (auth)/           # Authentication routes (Login, Signup)
│   ├── dashboard/        # Administrative dashboard for Election Organizers
│   ├── student/          # Student-facing voting and verification flow
│   ├── super-admin/      # Global system management (Associations, Billing)
│   └── layout.tsx        # Root layout with font and context providers
├── components/           # Reusable UI components
│   ├── Hero.tsx          # Landing page hero section
│   ├── Navbar.tsx        # Global navigation
│   └── ...               # Modals, CTAs, Pricing, etc.
├── context/              # State Management
│   └── AuthContext.tsx   # Global auth state, user data, and session persistence
├── lib/                  # Core Logic & API Client
│   ├── api.ts            # Base fetch wrapper with JWT handling & session refresh
│   ├── auth.api.ts       # Authentication endpoints (Login, OTP, Refresh)
│   ├── elections.api.ts  # Election CRUD operations
│   └── ...               # API modules for voters, billing, etc.
└── styles/               # Global styles and tailwind config
```

---

## 🔑 Architecture & Core Concepts

### 1. API Communication (`src/lib/api.ts`)
The project uses a custom fetch wrapper that handles:
- **Automatic JWT Injection**: Attaches Bearer tokens from cookies to every request.
- **Token Refresh**: Automatically attempts to refresh the access token if a 401 error occurs.
- **Voter Sessions**: Separate `voterFetch` for student voting flows using session-specific tokens.
- **Standardized Error Handling**: Centralized error parsing to provide user-friendly feedback.

### 2. Authentication Flow
- **Admin/Super Admin**: Standard Email/Password login. Uses JWT stored in HTTP-only-style cookies.
- **Student/Voter**: Email/Matric-based verification with OTP. Creates a temporary session token for the voting duration.

### 3. State Management
- **AuthContext**: Manages the `user` object and `accessToken`. It handles hydration from cookies on page load and provides `login/logout` methods to the entire app.

---

## 🏁 Key Features

### 🏢 Administrative Dashboard
- **Election Management**: Create, edit, and monitor elections in real-time.
- **Voter Management**: Upload and verify voter lists (CSV/JSON support).
- **Positioning**: Define positions (e.g., President, Secretary) and assign candidates.
- **Analytics**: High-level metrics on turnout, verification rates, and results.

### 🗳 Student Voting Flow
- **Verification**: OTP-based identity verification.
- **Ballot Interface**: Clean, accessible interface for selecting candidates.
- **Receipts**: Generation of voting receipts/confirmations.

### 👑 Super Admin (SaaS Level)
- **Association Management**: Manage different institutions/organizations using the platform.
- **Billing**: Track subscriptions and payment statuses for each association.

---

## 🤝 Onboarding for New Developers

### Code Conventions
- **Component Design**: Keep components small and focused. Use the `components/` directory for shared UI and local components for route-specific logic.
- **API Calls**: Never use raw `fetch`. Always use the modularized API functions in `src/lib/`.
- **TypeScript**: Strictly type your props and API responses. Interfaces are located within their respective `.api.ts` files.

### Styling with Tailwind 4
Tailwind 4 is configured via CSS. Custom brand colors and font families are mapped to CSS variables in `globals.css` and can be used as:
- `font-poppins`, `font-manrope`, etc.
- Standard Tailwind utilities for layout and spacing.

### Common Tasks
- **Adding a new API**: Create a new file in `src/lib/name.api.ts` and use `apiFetch`.
- **Protected Routes**: Wrap components or layouts with auth checks using the `useAuth` hook.

---

## 📜 License
This project is proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
