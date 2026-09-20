# Divya Collection - E-Commerce Website

A modern, full-stack e-commerce platform specializing in handbags and ladies' footwear. Built with React, Node.js, Express, and MongoDB.

## � Live Demo

🔗 **Live URL**: [Divya Collection](https://divya-collection-e-commerce-website-silk.vercel.app/)

## 📸 Screenshots

### Homepage
![Homepage](https://github.com/mitengala51/Divya-Collection-E-Commerce-Website/blob/main/frontend/public/Website%20Screenshots/homepage.jpeg)

### Product Search
![Product Search](https://github.com/mitengala51/Divya-Collection-E-Commerce-Website/blob/main/frontend/public/Website%20Screenshots/product%20search.jpeg)

### Product Details
![Product Details](https://github.com/mitengala51/Divya-Collection-E-Commerce-Website/blob/main/frontend/public/Website%20Screenshots/product%20detail.jpeg)

### About Us
![About Us](https://github.com/mitengala51/Divya-Collection-E-Commerce-Website/blob/main/frontend/public/Website%20Screenshots/about%20us.jpeg)

### Contact Us
![Contact Us](https://github.com/mitengala51/Divya-Collection-E-Commerce-Website/blob/main/frontend/public/Website%20Screenshots/contact%20us.jpeg)

### Shopping Cart
![Shopping Cart](https://github.com/mitengala51/Divya-Collection-E-Commerce-Website/blob/main/frontend/public/Website%20Screenshots/shopping%20cart.jpeg)


## �🌟 Features

- **User Authentication**: Secure login/signup with JWT tokens and Google OAuth
- **Product Catalog**: Browse handbags and ladies' footwear with detailed descriptions
- **Product Search**: Search products by title with real-time results
- **Shopping Cart**: Add, remove, and manage cart items
- **Payment Integration**: Secure payments via Razorpay
- **AI Chatbot**: Interactive customer support powered by Google Gemini AI
- **Responsive Design**: Mobile-first design using Material-UI
- **Image Gallery**: Product image galleries and carousels
- **Profile Management**: User profile completion and management

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library for consistent UI
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Chatbotify** - AI chatbot integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Razorpay** - Payment gateway integration
- **Google Generative AI** - AI chatbot functionality

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
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the Development Servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm start
   # or for development with auto-reload:
   npx nodemon index.js
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
divya-collection-ecommerce/
├── backend/
│   ├── index.js              # Main server file
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
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Cart/         # Shopping cart components
│   │   │   ├── Category/     # Category display
│   │   │   ├── Common/       # Shared components
│   │   │   ├── Layout/       # Layout components
│   │   │   ├── Page-Specific/# Page-specific components
│   │   │   └── Products/     # Product-related components
│   │   ├── Pages/            # Page components
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # App entry point
│   │   └── App.css           # Global styles
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # Project documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/sign-up` - User registration
- `POST /api/login` - User login
- `POST /api/google-login` - Google OAuth login
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

Made with ❤️ for fashion enthusiasts# E-Commerce
