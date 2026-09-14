# Product Requirements Document (PRD)
## Fragrance E-Commerce Store — Backend

**Version:** 1.0
**Stack:** Node.js + Express + MongoDB (Mongoose)
**Market:** Pakistan (PKR pricing, local payment methods)

---

## 1. Overview

Backend system for a fragrance/perfume e-commerce store selling categories such as
Perfumes, Perfume Wax, Sample Sets, Body Mist, and Air Care products. The backend
will power a storefront (frontend built separately via Antigravity) and must support
product browsing, cart, checkout, order management, and admin control.

---

## 2. Core Modules

### 2.1 Authentication & Users
- User registration/login (email + password, hashed with bcrypt)
- JWT-based auth (access token + refresh token)
- Roles: `customer`, `admin`
- Password reset via email OTP
- Guest checkout allowed (no forced signup)

### 2.2 Product Management
- CRUD for products (admin only)
- Fields: name, slug, description, category, subcategory, brand, images[],
  price, discountPrice, stock quantity, SKU, size/volume variants (e.g. 30ml/50ml/100ml),
  scent notes (top/middle/base), rating, reviewCount, isFeatured, isActive
- Categories: Perfumes, Perfume Wax, Sample Set, Body Mist, Air Care (expandable)
- Support for product variants (size → different price/stock per variant)
- Image upload (Cloudinary or local storage with multer)

### 2.3 Category Management
- CRUD for categories (admin only)
- Each category: name, slug, image, description, parent (for subcategories)

### 2.4 Cart
- Add/update/remove item
- Persist cart per user (logged in) or session/localStorage sync (guest)
- Auto-calculate subtotal, discount, total

### 2.5 Orders & Checkout
- Create order from cart
- Order fields: user, items[], shippingAddress, paymentMethod, paymentStatus,
  orderStatus (pending/confirmed/shipped/delivered/cancelled/returned), totalAmount
- Stock deduction on order confirmation
- Order history for users
- Admin: update order status, view all orders

### 2.6 Payments
- **COD (Cash on Delivery)** — default, no gateway needed
- **JazzCash** — integration via JazzCash API (mobile account/card)
- **Easypaisa** — integration via Easypaisa API
- **Card payments** — via PayFast or Stripe (if international cards needed)
- Payment status webhook handling
- Store transaction ID + payment status per order

### 2.7 Reviews & Ratings
- Users can review products they've purchased (verified purchase check)
- Fields: rating (1–5), comment, user, product, createdAt
- Auto-update product's average rating + review count

### 2.8 Coupons & Discounts
- Admin creates coupon codes (percentage or fixed amount)
- Expiry date, usage limit, minimum order value
- Apply at checkout

### 2.9 Wishlist
- Add/remove product to wishlist per user

### 2.10 Search & Filters
- Search by product name/description
- Filter by category, price range, rating, in-stock
- Sort by price, newest, popularity

### 2.11 Admin Dashboard APIs
- Sales summary (total orders, revenue, top products)
- Inventory management (low stock alerts)
- Customer list

---

## 3. Database Schema (MongoDB Collections)

- **Users**: name, email, password, phone, addresses[], role, createdAt
- **Products**: name, slug, category (ref), variants[], images[], price,
  discountPrice, stock, rating, reviewCount, isActive
- **Categories**: name, slug, image, parent
- **Orders**: user (ref), items[], shippingAddress, paymentMethod,
  paymentStatus, orderStatus, totalAmount, createdAt
- **Reviews**: user (ref), product (ref), rating, comment, createdAt
- **Coupons**: code, discountType, discountValue, expiryDate, usageLimit
- **Cart**: user (ref) or sessionId, items[]

---

## 4. API Endpoints (Sample Structure)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/forgot-password

GET    /api/products
GET    /api/products/:slug
POST   /api/products              (admin)
PUT    /api/products/:id          (admin)
DELETE /api/products/:id          (admin)

GET    /api/categories
POST   /api/categories            (admin)

GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove/:itemId

POST   /api/orders
GET    /api/orders/my-orders
GET    /api/orders/:id
PUT    /api/orders/:id/status     (admin)

POST   /api/payments/jazzcash/initiate
POST   /api/payments/easypaisa/initiate
POST   /api/payments/webhook

POST   /api/reviews
GET    /api/reviews/:productId

POST   /api/coupons/apply
POST   /api/coupons                (admin)

GET    /api/wishlist
POST   /api/wishlist/add
DELETE /api/wishlist/remove/:productId
```

---

## 5. Non-Functional Requirements

- Input validation (Joi or express-validator)
- Centralized error handling middleware
- Rate limiting on auth routes (prevent brute force)
- Environment variables via `.env` (dotenv) — never hardcode secrets
- CORS configured for frontend domain
- Logging (morgan for dev, winston for production)
- API response format standardized: `{ success, message, data }`

---

## 6. Tech Stack Summary

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Upload | Multer + Cloudinary |
| Validation | express-validator / Joi |
| Payments | JazzCash, Easypaisa, PayFast APIs |

---

## 7. Project Folder Structure

```
/config
  - db.js              (MongoDB connection)
  - cloudinary.js
/models
  - User.js
  - Product.js
  - Category.js
  - Order.js
  - Review.js
  - Coupon.js
  - Cart.js
/controllers
  - authController.js
  - productController.js
  - categoryController.js
  - cartController.js
  - orderController.js
  - reviewController.js
  - couponController.js
  - wishlistController.js
/routes
  - authRoutes.js
  - productRoutes.js
  - categoryRoutes.js
  - cartRoutes.js
  - orderRoutes.js
  - reviewRoutes.js
  - couponRoutes.js
  - wishlistRoutes.js
/middleware
  - authMiddleware.js   (JWT verification)
  - adminMiddleware.js
  - errorMiddleware.js
  - rateLimiter.js
/utils
  - generateToken.js
  - asyncHandler.js
.env.example
server.js
seed.js
```

---

## 8. Setup & Dependencies

**Initialize project:**
```
npm init -y
```

**Dependencies:**
```
npm install express mongoose dotenv cors bcryptjs jsonwebtoken express-validator multer cloudinary multer-storage-cloudinary morgan express-rate-limit
```

**Dev dependencies:**
```
npm install --save-dev nodemon
```

**package.json scripts:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**.env.example:**
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Prerequisites (set up before running):**
1. MongoDB Atlas free-tier cluster (mongodb.com/cloud/atlas) → get `MONGODB_URI`
2. Cloudinary free account (cloudinary.com) → get API keys for image upload

---

## 9. Recommended Build Order

1. Project init + folder structure + server.js + DB connection + health check route
2. Auth module (User model, register/login, JWT middleware)
3. Product + Category modules (CRUD, seed script with sample data)
4. Cart module
5. Orders module
6. Payments (COD first, then JazzCash/Easypaisa/PayFast)
7. Reviews, Coupons, Wishlist
8. Search/Filters + Admin dashboard APIs

Test each module (via Postman/health checks) before moving to the next 
rather than building everything at once.
