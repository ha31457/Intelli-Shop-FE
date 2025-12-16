# Intelli-Shop Frontend

Intelli-Shop is a modern, full-featured e-commerce platform frontend built with Next.js. It provides a dual-interface system for both customers and shop owners, offering a comprehensive suite of tools for a seamless shopping and management experience.

## ✨ Features

The application is split into two primary user roles, each with its own dedicated portal and functionalities.

### 🧑‍💼 For Shop Owners

-   **Authentication**: Secure signup and login for shop owners.
-   **Shop Registration**: A guided process to register a new shop after signing up.
-   **Dashboard**: An at-a-glance overview of key shop statistics, including total products and orders.
-   **Product Management (CRUD)**:
    -   Add new products with details like name, price, stock, and description.
    -   View a list of all shop products with search functionality.
    -   Edit existing product details.
    -   Delete products from the shop.
-   **Order Management**: View all incoming customer orders, inspect order details, and update order statuses (e.g., Placed, Completed, Cancelled).
-   **Shop Profile**: Update shop information, including name, address, description, and media like logos and banners.
-   **Notifications**: Receive real-time notifications for new orders and low-stock alerts through a notification drawer.

### 🛍️ For Customers

-   **Authentication**: Secure signup and login for customers.
-   **Shop & Product Discovery**:
    -   Browse a directory of all available shops.
    -   View detailed shop pages with their product listings.
    -   Search for specific shops and products.
-   **Shopping Cart**:
    -   Add products to the cart.
    -   View and manage items in the cart (update quantity, remove items).
    -   See a real-time order summary.
-   **Checkout Process**: A streamlined process to place an order, select a delivery mode, and choose a payment method.
-   **Order Tracking**: View a history of all past and active orders with their current status.
-   **Profile Management**: Update personal details such as name, phone number, and address.

## 🚀 Technology Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,typescript,tailwindcss" />
  </a>
</p>

-   **Framework**: [Next.js](https://nextjs.org/) 15 (App Router & Turbopack)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom premium theme.
-   **UI Components**: Built with [shadcn/ui](https://ui.shadcn.com/), leveraging Radix UI primitives.
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth page transitions and UI animations.
-   **Notifications**: [Sonner](https://sonner.emilpriv.dev/) for elegant and non-intrusive toast notifications.
-   **Authentication**: Role-based access control implemented via a custom `ProtectedRoute` component, managing access for "CUSTOMER" and "OWNER" roles.

## 📋 Prerequisites

-   Node.js (v20.x or later)
-   npm, yarn, pnpm, or bun
-   A running instance of the corresponding [Intelli-Shop Backend](https://github.com/ha31457/Intelli-Shop-BE) service, which this frontend connects to (typically at `http://localhost:8080`).

## ⚙️ Getting Started

Follow these steps to get the development environment running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/ha31457/Intelli-Shop-FE.git
cd Intelli-Shop-FE
```

### 2. Install Dependencies

Install the required packages using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

The application uses an API route for its contact form, which requires SMTP credentials. Create a `.env.local` file in the root of the project and add your credentials.

```env
# .env.local

# For Nodemailer (Contact Us form)
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-app-password
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

The repository uses the Next.js App Router, with a clear separation of concerns based on user roles.

```plaintext
ha31457-intelli-shop-fe/
├── app/
│   ├── customer/       # Routes and UI for the Customer role
│   ├── owner/          # Routes and UI for the Shop Owner role
│   ├── apife/          # Frontend-handled API routes (e.g., contact form)
│   ├── (public)/       # Public pages like landing, login, signup
│   └── layout.tsx      # Root layout with shared UI (footer)
├── components/
│   ├── ui/             # Reusable UI components from shadcn/ui
│   ├── ProtectedRoute.tsx # Component for role-based access control
│   └── NotificationDrawer.tsx # UI for owner notifications
├── lib/                # Utility functions
└── tailwind.config.js  # Tailwind CSS theme and configuration
