import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto"
// import fs from "fs"
// import multer from "multer";

dotenv.config();

mongoose
  .connect(
    process.env.MONGOOSE_URL
  )
  .then(() => {
    console.log("Connected to MongoDb");
  });

const ProductSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  short_description: String,
  detail_description: String,
  category: String,
  brand: String,
  size: Number,
  image_url: Array,
  stock: Number,
  best_selling: Boolean,
});

const CartSchema = new mongoose.Schema({
  id: String,
  userID: String,
  title: String,
  price: Number,
  category: String,
  brand: String,
  size: Number,
  image_url: String,
  quantity: Number
});

const UserSchema = new mongoose.Schema({
  // user_id: String,
  full_name: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  name: String,
  phone_number: Number,
  address: String,
  city: String,
  state: String,
  zip_code: Number,
  Google_Login: Boolean,
  role: String,
  // username: String
  // cart: [CartSchema]
});

const OrderSchema = new mongoose.Schema({
  userDetails: [UserSchema],
  productDetails: [CartSchema],
  total_amount: Number,
  quantity: String,
  order_status: String,
  payment_status: String,
}, { timestamps: true });

const Product = mongoose.model("Products", ProductSchema, "Products");
const User = mongoose.model("Users", UserSchema, "Users");
const Cart = mongoose.model("Cart", CartSchema, "Cart");
const Order = mongoose.model("Orders", OrderSchema, "Orders");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Access-Control-Allow-Credentials"]
  })
);
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const upload = multer({ dest: 'uploads/' })

async function verifyToken(req, res, next) {
  const token = await req.cookies.token;
  // console.log("JWT Token: ", token)
  if (!token) {
    return res.status(401).json({ message: "Unautohorized Access and Token Not found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    // res.status(200).json({ message: 'User Authenticated', user_id: decoded._id, user_full_name: decoded.full_name })
  } catch (error) {
    // res.status(401).json({ message: 'Invalid or expired token' });
    console.log(error);
  }

  next();
}

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});

// Nodemailer

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "mitengala51@gmail.com",
    pass: process.env.APP_PASSWORD_GMAIL,
  },
});

//  Fetching All Products from Database

app.get("/api/all-products", async (req, res) => {
  try {
    const all_products = await Product.find({});
    // console.log(all_products);
    res.status(200).json({ all_products });
  } catch (err) {
    console.log(err);
  }
});

// Fetching Specific Product

app.get("/api/all-products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const Specific_product = await Product.find({ id: id });
    console.log(Specific_product);
    res.status(200).json({ Specific_product });
  } catch (err) {
    console.log(err);
  }
});

// Add to Cart

app.post("/api/add-to-cart", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const { id, title, price, brand, size, category, image_url } = req.body;
    // console.log(id, title, price, brand, size, category, image_url)
    // console.log("Add to cart: ", req?.user?._id)
    const product = await Cart.find({ id: id, userID: req?.user?._id })
    // console.log("Product found: ", product)

    if(product?.length > 0){
      await Cart.updateOne({ id: id }, { $set: { quantity: product?.[0]?.quantity + 1 } })
      return res.status(200).json({ message: "Added to cart" })
    }

    if(!req?.user?._id) return res.status(401).json({ message: "Not authorised" })

    await Cart.create({
      id,
      userID: req?.user?._id,
      title,
      price,
      brand,
      size,
      category,
      image_url,
      quantity: 1
    });
    res.status(200).json({ message: "Added to cart" });
  } catch (error) {
    console.log("Add to Cart Error: ", error);
  }
});

// All Add to Cart items

app.get("/api/cart-items", verifyToken, async (req, res) => {
  try {
    // console.log("User id: ", req.user._id)
    if(!req?.user?._id) return res.status(401).json({ message: "Not authorised" })
    const all_cart_items = await Cart.find({ userID: req?.user?._id });
    res.json({ message: "All carts products recieved", all_cart_items });
  } catch (error) {
    console.log(error);
  }
});

// Delete Cart Items

app.delete("/api/delete-cart-item/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    await Cart.deleteOne({ id });
    res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    console.log(error);
  }
});

// Update Quantity
app.post("/api/quantity", verifyToken, async (req,res) => {
  try {
    const { product_quantity, product_id } = req.body;
    if(!product_quantity && !product_id) return res.status(404).json({ message: "Quantity or Product ID is missing" })
      // console.log(product_quantity)
    await Cart.updateOne({ userID: req?.user?._id, id: product_id }, { $set: { quantity: product_quantity } })
    // console.log("Update Quantity: ", update)
    res.status(200).json({ message: "Quantity Updated" })
  } catch (error) {
    console.log("Error: ", error)
  }
});

// Razorpay API EndPoints

app.post("/create-order", async (req, res) => {
  console.log(req.body.amount);
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      // reciept: "receipt_" + Math.random().toString(36).substring(7),
      // payment_capture: 1,
    };

    const orders = await razorpay.orders.create(options);
    res.status(200).json({ orders });
  } catch (err) {
    console.log("RazorPay order error: ", err)
    res.status(500).json({ error: err.message });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ error: "Something Went Wrong in the payement" });
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Paymenet Verification Error: ", err)
  }
});

// Login & SignUp Endpoints

//Login Endpoint

app.post("/api/login", async (req, res) => {
  try {
    const { email, Inputpassword } = req.body;
    console.log(email, Inputpassword);
    const user = await User.findOne({ email: email, Google_Login: false });
    console.log(user);
    console.log(user.length);

    if (user.length == 0) {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
    }

    const HashedPassword = user?.password;
    const password = await bcrypt.compare(Inputpassword, HashedPassword);

    console.log(user._id);

    if (password) {
      const token = jwt.sign(
        { _id: user._id, full_name: user.full_name, role: user.role },
        JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
      sameSite: "None",
      partitioned: true
      });
      res.status(200).json({ message: "Login Successfull" });
    } else if (!password) {
      res.status(400).json({ message: "Password didn't match" });
    }
  } catch (error) {
    // res.stajson({ error });
    console.log(error)
  }
});

//Sign Up Endpoint

app.post("/api/sign-up", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const HashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: HashedPassword, Google_Login: false });

    res.status(200).json({ message: "Account create successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});

// Complete Profile endpoints

app.post("/api/complete-profile", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      address_1,
      address_2,
      city,
      state,
      zip_code,
      email,
    } = req.body;
    console.log(
      first_name,
      last_name,
      phone_number,
      address_1,
      address_2,
      city,
      state,
      zip_code,
      email
    );
    await User.findOneAndUpdate(
      { email },
      {
        first_name,
        last_name,
        phone_number,
        address_1,
        address_2,
        city,
        state,
        zip_code,
      }
    );
    res.status(200).json({ message: "Profile Completed" });
  } catch (error) {
    console.log(error);
  }
});

// Google Auth

app.post("/api/google-login", async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name, email);
    const user = await User.findOne({
      full_name: name,
      email,
      Google_Login: true,
    });
    if (!user) {
      res.status(404).json({ message: "Sign Up with Google Account" });
    }
    const token = jwt.sign(
      { _id: user._id, full_name: user.full_name },
      JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
      sameSite: "None",
      partitioned: true
    });
    res.status(200).json({ message: "Login Successfull" });
  } catch (error) {
    console.log("Google Login Error: ", error)
  }

});

app.post("/api/google-signup", async (req, res) => {
  const { name, email } = req.body;
  console.log(name, email);
  await User.create({ full_name: name, email, Google_Login: true });
  res.status(200).json({ message: "Google Account Signed In" });
});

// Logout
app.post("/api/Logout", verifyToken, (req, res) => {
  // console.log(req.user)
  res.clearCookie("token", {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
      sameSite: "None",
      partitioned: true
    });
  res.status(200).json({ message: "User Logged Out Successfully" });
});

// Order
app.post("/api/order", verifyToken, async (req, res) => {
  try {
    const { quantity, total_amount } = req.body;
    console.log(req.user);
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return console.log("User not found");
    const cartProduct = await Cart.find({ userID: req.user._id });
    if (!cartProduct) return console.log("Product Details not found");

    await Order.create({
      userDetails: user,
      productDetails: cartProduct,
      total_amount,
      // quantity,
    });

    // const order = await Order.find({ "userDetails._id": req.user._id })
    const order = await Order.find({
      "userDetails._id": new mongoose.Types.ObjectId(req.user._id),
    });
    console.log(order);
    console.log(order.length - 1);
    console.log(order[order.length - 1]);

    const mailForOwner = {
      from: "mitengala51@gmail.com",
      to: order[order.length - 1]?.userDetails?.[0]?.email,
      subject: `New Order Received – Divya Collection`,
      html: `Hi Divya Collection,

<h2 style="color: #333333; text-align: center;">New Order Alert</h2>

<p style="font-size: 16px; color: #555555; line-height: 1.6; text-align: center;">
  Great news! A new order has just been placed on your store.
</p>

<div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
  <p style="margin: 8px 0; font-size: 15px; color: #333333;">
    <strong>Order Details:</strong>
  </p>
  <p style="margin: 8px 0; font-size: 14px; color: #555555;">
    Customer Name: ${order[order.length - 1].userDetails[0].full_name}
  </p>
  <p style="margin: 8px 0; font-size: 14px; color: #555555;">
    Total Amount: ${order[order.length - 1].total_amount}
  </p>
</div>

<p style="font-size: 15px; color: #555555; line-height: 1.6; text-align: center;">
  Please review the order details and begin processing it at your earliest convenience.
</p>

<p style="font-size: 15px; color: #555555; line-height: 1.6; text-align: center;">
  Let us know if you need any assistance.
</p>`,
    };

    const mailForCustomer = {
      from: "mitengala51@gmail.com",
      to: user.email,
      subject: `Thank You for Your Order – Divya Collection`,
      html: `Hi ${order[order.length - 1].userDetails[0].full_name},

<h2 style="color: #333333; text-align: center;">Thank you for your order!</h2>

<p style="font-size: 16px; color: #555555; line-height: 1.6; text-align: center;">
  We’ve received it and our team is now processing it.
</p>

<hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;">

<p style="font-size: 15px; color: #555555; line-height: 1.6; text-align: center;">
  You’ll get another update as soon as your order ships. If you have any questions in the meantime, feel free to use Contact Page in the website
</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="#" style="background-color: #000000; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 14px;">
    Contact Us
  </a>
</div>

<p style="font-size: 15px; color: #333333; text-align: center;">
  Thanks again for choosing <strong>Divya Collection</strong>
</p>`,
    };

    transporter.sendMail(mailForOwner, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    transporter.sendMail(mailForCustomer, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    res.status(200).json({ message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
  }
});

// Contact Endpoint
app.post("/api/contact-us", (req, res) => {
  const { name, email, phone_number, subject, message } = req.body;

  if (!phone_number) {
    const mailForOwner = {
      from: "mitengala51@gmail.com",
      to: "mitengala51@gmail.com",
      subject: `✉️ New Message from Your Website – ${subject}`,
      text: `Hello,
  You've received a new message from the contact form on your website. Here are the details:
  🧑 Name: ${name}
  📧 Email: ${email}
  📌 Subject: ${subject}
  💬 Message: ${message}
  
  Please follow up with the sender as soon as possible.`,
    };

    transporter.sendMail(mailForOwner, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    return res.status(200).json({ message: "Your Form has been submited" });
  }
  const mailForOwner = {
    from: "mitengala51@gmail.com",
    to: "mitengala51@gmail.com",
    subject: `✉️ New Message from Your Website – ${subject}`,
    text: `Hello,
You've received a new message from the contact form on your website. Here are the details:
🧑 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone_number}
📌 Subject: ${subject}
💬 Message: ${message}

Please follow up with the sender as soon as possible.`,
  };

  transporter.sendMail(mailForOwner, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });

  res.status(200).json({ message: "Your Form has been submitted" });
});

// Search Endpoing
app.get("/api/search", async (req, res) => {
  try {
    const product = req.query.product;
    const product_found = await Product.find({
      title: { $regex: product, $options: "i" },
    });
    res.status(200).json(product_found);
  } catch (error) {
    console.log(error);
  }
});

// Gemini API
app.post("/api/chatbot", async (req, res) => {
  try {
    const chatMessage = req.body.UserMessage
    console.log("ChatMessage: ", chatMessage);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatMessage,
      config: {
        systemInstruction: `
      
      Act like the best virtual assistant for the e-commerce website Divya Collection, which is an offline retail shop and has a website that sells online. It is not like other e-commerce websites, which sell A to Z products; we are only selling handbags, purses, bags, ladies' footwear, men's footwear, men's wallets, men's socks, and travel bags, but for now, on the online shopping website, we have only listed ladies' footwear and handbags. There are many brands available: Michael Kors, Gucci, Tory Burch, Chanel bags, and Coach. 

🛍️ Product List for Website
1. Prada Nylon Backpack: Rs 1999
2. Chanel Classic Flap Bag: Rs 5399
3. Michael Kors Selma Satchel: Rs 3499
4. Tory Burch Miller Sandals: Rs 1799
5. Black Strapped Flat Chappal: Rs 1799
6. Cream Strap Flat Chappal: Rs 1499
7. Red Flat Chappal: Rs 1119
8. Green Low Heel Chappal: Rs 2499
9. Gucci GG Marmont Mini Bag: Rs 1249

this are the prodcuts available at e-commerce online store. Give answers in short. Don't start with welcome message. You have to help customers to find the right product according to their requirments.
make sure the customer should find the product he/she is looking for. We follow the policy of customer is king. Give him/her like a king or queen treatment in the chat
      `,
      },
    });

    console.log("Gemini API: ", response?.text)
    res.status(200).json({ AiMessage: response?.text })
  } catch (error) {
    console.log("Error: ", error)
  }
})

// Gemini Text to image and Image to Image Generation API
// app.post("/api/chatbot/image-generation", upload.single('file'), async (req, res)=>{
//   try {
//     console.log(req.file)

//     if(!req.file) res.status(404).json({ message: "Image not uploaded" })

//     const imagePath = req?.file?.path;
//     const imageData = fs.readFileSync(imagePath);
//     const base64Image = imageData.toString("base64");

//     const prompt = [
//     { text: "Create a picture of my cat eating a nano-banana in a" +
//             "fancy restaurant under the Gemini constellation" },
//     {
//       inlineData: {
//         mimeType: "image/png",
//         data: base64Image,
//       },
//     },
//   ];

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash-image",
//     contents: prompt,
//   });

//   for (const part of response.candidates[0].content.parts) {
//     if (part.text) {
//       console.log(part.text);
//     } else if (part.inlineData) {
//       const imageData = part.inlineData.data;
//       const buffer = Buffer.from(imageData, "base64");
//       fs.writeFileSync("gemini-native-image.png", buffer);
//       console.log("Image saved as gemini-native-image.png");
//     }
//   }

//   } catch (error) {
//     console.log("Image Generation: ", error);
//   }
// })

// Admin Authorization Middleware
// The role is always re-read from the database so a tampered token can not grant admin.

async function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access and Token Not found" });
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decoded;
    req.admin = user;
    next();
  } catch (error) {
    console.log("Admin Verification Error: ", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Orders created before the admin dashboard existed have no timestamps,
// so the creation date is taken from the ObjectId in that case.

function orderDate(order) {
  return order.createdAt || order._id.getTimestamp();
}

const ORDER_STATUS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// Admin Endpoints

// Logged in admin details

app.get("/api/admin/me", verifyAdmin, async (req, res) => {
  try {
    res.status(200).json({
      admin: {
        _id: req.admin._id,
        full_name: req.admin.full_name,
        first_name: req.admin.first_name,
        last_name: req.admin.last_name,
        email: req.admin.email,
        phone_number: req.admin.phone_number,
        city: req.admin.city,
        state: req.admin.state,
        role: req.admin.role,
      },
    });
  } catch (error) {
    console.log("Admin Me Error: ", error);
    res.status(500).json({ message: "Could not load admin details" });
  }
});

// Dashboard statistics

app.get("/api/admin/stats", verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find({});
    const orders = await Order.find({});
    const total_customers = await User.countDocuments({ role: { $ne: "admin" } });

    const revenue = orders.reduce(
      (accumulator, item) => accumulator + (item?.total_amount || 0),
      0
    );

    const status_distribution = ORDER_STATUS.map((status) => {
      return {
        status,
        count: orders.filter((item) => (item?.order_status || "Pending") === status)
          .length,
      };
    });

    // Sales for the last 6 months, oldest first
    const sales_overview = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthOrders = orders.filter((item) => {
        const date = orderDate(item);
        return (
          date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()
        );
      });

      sales_overview.push({
        label: month.toLocaleString("en-IN", { month: "short" }),
        orders: monthOrders.length,
        revenue: monthOrders.reduce(
          (accumulator, item) => accumulator + (item?.total_amount || 0),
          0
        ),
      });
    }

    const sortedOrders = [...orders].sort((a, b) => orderDate(b) - orderDate(a));

    const recent_orders = sortedOrders.slice(0, 5).map((item) => {
      return {
        _id: item._id,
        customer_name: item?.userDetails?.[0]?.full_name || "Guest",
        total_amount: item?.total_amount,
        order_status: item?.order_status || "Pending",
        created_at: orderDate(item),
      };
    });

    const recent_products = [...products]
      .sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp())
      .slice(0, 5)
      .map((item) => {
        return {
          _id: item._id,
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
          image_url: item.image_url,
        };
      });

    // Only products where stock has actually been set are reported as low
    const low_stock_products = products
      .filter((item) => typeof item.stock === "number" && item.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .map((item) => {
        return {
          _id: item._id,
          id: item.id,
          title: item.title,
          stock: item.stock,
          image_url: item.image_url,
        };
      });

    res.status(200).json({
      stats: {
        total_products: products.length,
        total_orders: orders.length,
        pending_orders: orders.filter(
          (item) => (item?.order_status || "Pending") === "Pending"
        ).length,
        completed_orders: orders.filter((item) => item?.order_status === "Delivered")
          .length,
        total_customers,
        revenue,
        untracked_stock: products.filter((item) => typeof item.stock !== "number")
          .length,
      },
      sales_overview,
      status_distribution,
      recent_orders,
      recent_products,
      low_stock_products,
    });
  } catch (error) {
    console.log("Admin Stats Error: ", error);
    res.status(500).json({ message: "Could not load dashboard statistics" });
  }
});

// Add Product

app.post("/api/admin/product", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      price,
      short_description,
      detail_description,
      category,
      brand,
      size,
      image_url,
      stock,
      best_selling,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: "Please enter a valid price" });
    }

    // The website identifies products by the custom "id" field, so a new one is generated here
    const all_products = await Product.find({});
    const highest = all_products.reduce((accumulator, item) => {
      const current = Number(item.id);
      return Number.isNaN(current) ? accumulator : Math.max(accumulator, current);
    }, 0);

    const product = await Product.create({
      id: String(highest + 1),
      title,
      price: Number(price),
      short_description,
      detail_description,
      category,
      brand,
      size: size === "" || size === undefined ? undefined : Number(size),
      image_url: Array.isArray(image_url) ? image_url : [],
      stock: stock === "" || stock === undefined ? undefined : Number(stock),
      best_selling: Boolean(best_selling),
    });

    res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    console.log("Add Product Error: ", error);
    res.status(500).json({ message: "Could not add the product" });
  }
});

// Update Product

app.put("/api/admin/product/:id", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      price,
      short_description,
      detail_description,
      category,
      brand,
      size,
      image_url,
      stock,
      best_selling,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: "Please enter a valid price" });
    }

    const product = await Product.findOneAndUpdate(
      { id: id },
      {
        title,
        price: Number(price),
        short_description,
        detail_description,
        category,
        brand,
        size: size === "" || size === undefined ? undefined : Number(size),
        image_url: Array.isArray(image_url) ? image_url : [],
        stock: stock === "" || stock === undefined ? undefined : Number(stock),
        best_selling: Boolean(best_selling),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log("Update Product Error: ", error);
    res.status(500).json({ message: "Could not update the product" });
  }
});

// Delete Product

app.delete("/api/admin/product/:id", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOneAndDelete({ id: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // The product also has to leave every open cart, otherwise the cart page shows a dead item
    await Cart.deleteMany({ id: id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Delete Product Error: ", error);
    res.status(500).json({ message: "Could not delete the product" });
  }
});

// Categories
// There is no Category collection in this project, categories live on the product
// documents, so the list is derived from them.

app.get("/api/admin/categories", verifyAdmin, async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          product_count: { $sum: 1 },
          total_stock: { $sum: { $ifNull: ["$stock", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    console.log("Admin Categories Error: ", error);
    res.status(500).json({ message: "Could not load categories" });
  }
});

// Rename a category across every product that uses it

app.put("/api/admin/category", verifyAdmin, async (req, res) => {
  try {
    const { old_category, new_category } = req.body;

    if (!old_category || !new_category) {
      return res.status(400).json({ message: "Both category names are required" });
    }

    if (old_category === new_category) {
      return res.status(400).json({ message: "Please enter a different name" });
    }

    const result = await Product.updateMany(
      { category: old_category },
      { $set: { category: new_category } }
    );

    res.status(200).json({
      message: `Category renamed on ${result.modifiedCount} product(s)`,
    });
  } catch (error) {
    console.log("Rename Category Error: ", error);
    res.status(500).json({ message: "Could not rename the category" });
  }
});

// All Orders

app.get("/api/admin/orders", verifyAdmin, async (req, res) => {
  try {
    const all_orders = await Order.find({});

    const orders = all_orders
      .sort((a, b) => orderDate(b) - orderDate(a))
      .map((item) => {
        return {
          _id: item._id,
          customer_name: item?.userDetails?.[0]?.full_name || "Guest",
          customer_email: item?.userDetails?.[0]?.email || "",
          total_items: item?.productDetails?.length || 0,
          total_amount: item?.total_amount,
          order_status: item?.order_status || "Pending",
          payment_status: item?.payment_status || "Paid",
          created_at: orderDate(item),
        };
      });

    res.status(200).json({ orders });
  } catch (error) {
    console.log("Admin Orders Error: ", error);
    res.status(500).json({ message: "Could not load orders" });
  }
});

// Single Order

app.get("/api/admin/orders/:id", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findOne({ _id: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customer = order?.userDetails?.[0];

    res.status(200).json({
      order: {
        _id: order._id,
        customer: {
          full_name: customer?.full_name || "Guest",
          email: customer?.email || "",
          phone_number: customer?.phone_number,
          address: customer?.address,
          city: customer?.city,
          state: customer?.state,
          zip_code: customer?.zip_code,
        },
        productDetails: order.productDetails,
        total_amount: order.total_amount,
        order_status: order.order_status || "Pending",
        payment_status: order.payment_status || "Paid",
        created_at: orderDate(order),
      },
    });
  } catch (error) {
    console.log("Admin Order Detail Error: ", error);
    res.status(500).json({ message: "Could not load the order" });
  }
});

// Update Order Status

app.put("/api/admin/orders/:id/status", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { order_status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    if (!ORDER_STATUS.includes(order_status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { order_status } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    console.log("Update Order Status Error: ", error);
    res.status(500).json({ message: "Could not update the order status" });
  }
});

// Customers

app.get("/api/admin/customers", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }, { password: 0 });
    const all_orders = await Order.find({});

    const customers = users.map((user) => {
      const userOrders = all_orders.filter(
        (item) => item?.userDetails?.[0]?._id?.toString() === user._id.toString()
      );

      return {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        city: user.city,
        state: user.state,
        Google_Login: user.Google_Login,
        profile_completed: Boolean(user.first_name && user.phone_number),
        total_orders: userOrders.length,
        total_spent: userOrders.reduce(
          (accumulator, item) => accumulator + (item?.total_amount || 0),
          0
        ),
      };
    });

    res.status(200).json({ customers });
  } catch (error) {
    console.log("Admin Customers Error: ", error);
    res.status(500).json({ message: "Could not load customers" });
  }
});

app.listen(3000, () => {
  console.log("Server is Listinening to port 3000");
});
