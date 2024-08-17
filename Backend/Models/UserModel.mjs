import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  role: { type: String, required: true, default: "admin" },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
