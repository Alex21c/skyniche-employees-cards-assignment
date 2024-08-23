import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  monthlySalary: { type: Number, required: true },
  salaryCurrency: { type: String, maxlength: 1, required: true, default: "₹" },
  profileImage: { type: Map, of: String },
});

const EmployeeModel = mongoose.model("employees", employeeSchema);
export default EmployeeModel;
