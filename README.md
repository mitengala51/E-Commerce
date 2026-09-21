# Divya Collection - E-Commerce Website

A modern, full-stack e-commerce platform specializing in handbags and ladies' footwear. Built with React, Node.js, Express, and MongoDB — now with an integrated Admin Dashboard.

## 🔗 Live Demo

🔗 **Live URL**: [Divya Collection](https://frontend-bice-five-94.vercel.app)

## 🌟 Features

- **User Authentication**: Secure login/signup with JWT tokens and Google OAuth
- **Product Catalog**: Browse handbags and ladies' footwear with detailed descriptions
- **Product Search**: Search products by title with real-time results
- **Shopping Cart**: Add, remove, and manage cart items
- **Payment Integration**: Secure payments via Razorpay
- **AI Chatbot**: Interactive customer support powered by Google Gemini AI
- **Responsive Design**: Mobile-first design using Material-UI
- **Image Gallery**: Product image galleries and carousels
- **Profile Management**: User profile completion and management
- **Admin Dashboard**: Role-protected admin panel for managing products, categories, orders and customers, with real sales/order analytics (see below)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library for consistent UI
- **Bootstrap 5** - Utility classes for layout (loaded via CDN)
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **React Chatbotify** - AI chatbot integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication and role-based admin authorization
- **bcrypt** - Password hashing
- **Razorpay** - Payment gateway integration
- **Google Generative AI (Gemini)** - AI chatbot functionality
- **Nodemailer** - Contact form email delivery

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/divya-collection-ecommerce.git
   cd divya-collection-ecommerce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGOOSE_URL=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   RAZOR_PAY_KEY_ID=your_razorpay_key_id
   RAZOR_PAY_KEY_SECRET=your_razorpay_key_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   APP_PASSWORD_GMAIL=your_gmail_app_password
   ```

   No additional environment variables are required for the Admin Dashboard — it reuses `MONGOOSE_URL` and `JWT_SECRET_KEY` above.

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   VITE_RAZOR_PAY_KEY_ID=your_razorpay_key_id
   VITE_REACT_APP_API_URL=http://localhost:3000
   ```

4. **Start the Development Servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   node index.js
   ```
   The backend listens on **port 3000**.

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛡️ Admin Dashboard Setup

The admin dashboard lives at `/admin` and is protected on both the frontend and the backend — the backend re-checks the logged-in user's role against the database on every admin request, rather than trusting anything sent from the browser.

1. **Sign up normally** on the website with the email you want to use as admin.
2. **Promote that account to admin** by running:
   ```bash
   cd backend
   node make-admin.js your-email@example.com
   ```
3. **Log out and log back in** with that account (the role is embedded in the JWT at login time, so a token issued before this step won't carry it).
4. Visit `http://localhost:5173/admin`. Logging in with an admin account from the normal login modal also redirects there automatically.


### Demo Admin Account
 
For reviewers who just want to log in without running `make-admin.js` themselves:
 
```
Email:    abc123@gmail.com
Password: Asdfghjkl123@
```

### What the dashboard includes
- **Dashboard Home**: total products, orders, pending/completed orders, total customers, revenue, a 6-month sales overview, order status breakdown, recent orders, recently added products, and low-stock products
- **Products**: search, category filter, add/edit/delete with the existing product schema (title, price, category, brand, size, images, stock)
- **Categories**: derived from existing product data (there's no separate category collection), with rename support
- **Orders**: list with search/status filter, order detail view, and order status updates
- **Customers**: list with order count and total spend per customer
- **Profile**: the signed-in admin's own account details

## 📁 Project Structure

```
divya-collection-ecommerce/
├── backend/
│   ├── index.js              # Main server file (storefront + admin API)
│   ├── make-admin.js         # One-time script to grant a user the admin role
│   ├── package.json          # Backend dependencies
│   └── uploads/              # File uploads directory
├── frontend/
│   ├── public/               # Static assets
│   │   ├── Carousel Images/
│   │   ├── Category Images/
│   │   ├── Logo Images/
│   │   ├── Products Images/
│   │   └── Social Media Icons/
│   ├── src/
│   │   ├── Components/       # Reusable components
│   │   │   ├── Admin/        # Admin layout, sidebar, header, route guard
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Cart/         # Shopping cart components
│   │   │   ├── Category/     # Category display
│   │   │   ├── Common/       # Shared components
│   │   │   ├── Layout/       # Layout components
│   │   │   ├── Page-Specific/# Page-specific components
│   │   │   └── Products/     # Product-related components
│   │   ├── Pages/            # Page components (including Admin*.jsx)
│   │   ├── App.jsx           # Main app component and routes
│   │   ├── main.jsx          # App entry point
│   │   └── App.css           # Global styles
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # Project documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/sign-up` - User registration
- `POST /api/login` - User login (response includes `role` for admin redirect)
- `POST /api/google-login` - Google OAuth login (response includes `role`)
- `POST /api/google-signup` - Google OAuth registration
- `POST /api/Logout` - User logout

### Profile
- `POST /api/complete-profile` - Complete user profile information

### Products
- `GET /api/all-products` - Get all products
- `GET /api/all-products/:id` - Get specific product by ID
- `GET /api/search?product=<query>` - Search products by title

### Cart
- `POST /api/add-to-cart` - Add item to cart (requires authentication)
- `GET /api/cart-items` - Get user's cart items (requires authentication)
- `POST /api/quantity` - Update item quantity in cart (requires authentication)
- `DELETE /api/delete-cart-item/:id` - Remove item from cart

### Orders
- `POST /api/order` - Create new order (requires authentication)

### Payment
- `POST /create-order` - Create Razorpay payment order
- `POST /verify-payment` - Verify Razorpay payment signature

### Contact
- `POST /api/contact-us` - Submit contact form

### AI Chatbot
- `POST /api/chatbot` - Send message to AI assistant

### Admin (requires an authenticated admin account)
- `GET /api/admin/me` - Logged-in admin's own details
- `GET /api/admin/stats` - Dashboard statistics, sales overview, order status distribution, recent activity, low stock
- `POST /api/admin/product` - Create a product
- `PUT /api/admin/product/:id` - Update a product
- `DELETE /api/admin/product/:id` - Delete a product (also removes it from any open carts)
- `GET /api/admin/categories` - Category list with product counts (aggregated from products)
- `PUT /api/admin/category` - Rename a category across all its products
- `GET /api/admin/orders` - All orders, newest first
- `GET /api/admin/orders/:id` - Single order with customer and line-item detail
- `PUT /api/admin/orders/:id/status` - Update an order's status
- `GET /api/admin/customers` - Customers with order count and total spend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Contact

For questions or support, please contact us at:
- Email: support@divyacollection.com
- Website: [Divya Collection](https://divyacollection.com)

---

Made with ❤️ for fashion enthusiasts
