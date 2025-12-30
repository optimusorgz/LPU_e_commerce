# Campus Second-Hand Marketplace - Frontend

Next.js 16 frontend with Tailwind CSS and Shadcn UI.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Update the values:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Your Razorpay key

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  /(auth)          # Authentication pages
    /login
    /register
  /(user)          # User-protected pages
    /dashboard
    /post          # Create product
    /my-products
    /wishlist
    /orders
    /profile
  /(admin)         # Admin-only pages
    /admin
      /users
      /products
      /orders
      /reports
  /products        # Public product pages
    /[id]
/components
  /ui              # Shadcn UI components
  /ProductCard.tsx
  /ProductForm.tsx
  /... (other custom components)
/lib
  /api.ts          # Axios instance
  /types.ts        # TypeScript types
  /utils.ts        # Utility functions
```

## Features

- 🔐 University email-only registration
- 🛍️ Product listing with advanced filters
- 💳 Razorpay payment integration
- 📦 Order tracking
- ⭐ Wishlist
- 👨‍💼 Admin dashboard
- 🎨 Modern UI with Shadcn + Tailwind

## Next Steps

### Pages to Implement

1. **Authentication** (`/app/(auth)`)
   - Login page
   - Register page

2. **Products** (`/app/products`)
   - Product feed with filters
   - Product details page

3. **User Dashboard** (`/app/(user)`)
   - Dashboard overview
   - Post product form
   - My products management
   - Wishlist
   - Orders history
   - Profile management

4. **Admin Panel** (`/app/(admin)`)
   - Admin dashboard with stats
   - User management
   - Product moderation
   - Order management
   - Reports handling

### Custom Components to Build

- `ProductCard` - Display product in grid
- `ProductForm` - Multi-image upload + form
- `ProductGallery` - Image carousel
- `OrderCard` - Order status display
- `PaymentButton` - Razorpay checkout trigger

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Technologies

- **Next.js 16** - App Router
- **Tailwind CSS 4** - Styling
- **Shadcn UI** - Component library
- **Axios** - API calls
- **Razorpay** - Payment integration
- **React Hook Form** - Form handling
- **Zod** - Validation
