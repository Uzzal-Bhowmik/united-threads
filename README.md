# United Threads

## Overview  
**United Threads** is a full-stack **e-commerce platform** specializing in **custom apparel design**. Built using **Next.js, Express, and MongoDB**, it features a **Fabric.js-powered Custom Apparel Designer**, allowing users to personalize T-shirts, jackets, and more with **logos, text, images, and industry-standard Pantone colors**.

## Key Features 
- **Custom Apparel Designer**
  - Built using **Fabric.js** with customization for apparels with custom Logo, Text, Color etc.  
  - Users can upload **logos, text, images, and select Pantone colors**.  
  - Live preview of the designed apparel.  

- **Pantone Color Picker**  
  - Enables businesses to select **industry-standard Pantone colors** for accuracy in apparel design.  

- **E-commerce Functionality**  
  - Product browsing, cart management, checkout, and payment integration.  
  - Secure **user authentication & role-based access control**.  

- **Admin & CSR Dashboards**
  - **Admin Panel** for order management, user control, and analytics.  
  - **CSR (Customer Support Representative) Dashboard** for handling customer inquiries.  

## Tech Stack 
- **Frontend:** Next.js, React, Redux Toolkit, Framer Motion, GSAP  
- **Backend:** Express.js, Node.js, MongoDB, Mongoose  
- **Other:** RTK Query (for caching & API state), Fabric.js (for custom design tools)  

## Getting Started

### Prerequisites  
Make sure you have the following installed:  
- **Node.js**
- **MongoDB**
- **Pnpm** (recommended)

### Installation  

#### 1. Clone the Repository  
```bash
git clone https://github.com/Uzzal-Bhowmik/united-threads.git
cd united-threads
```

#### 2. Frontend Setup
```bash
cd united-threads-client
pnpm install
pnpm dev
```

#### 2. Backend Setup
```bash
cd ..
cd united-threads-server
pnpm install
pnpm start:dev
```

