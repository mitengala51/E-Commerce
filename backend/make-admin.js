// One time helper to give an existing account admin access.
// Usage:  node make-admin.js owner@example.com

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const UserSchema = new mongoose.Schema({
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
});

const User = mongoose.model("Users", UserSchema, "Users");

async function makeAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log("Please pass an email, for example: node make-admin.js you@mail.com");
      return;
    }

    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("Connected to MongoDb");

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { role: "admin" } },
      { new: true }
    );

    if (!user) {
      console.log(`No account found for ${email}. Sign up on the website first.`);
      return;
    }

    console.log(`${email} is now an admin.`);
  } catch (error) {
    console.log("Make Admin Error: ", error);
  } finally {
    await mongoose.connection.close();
  }
}

makeAdmin();
