import passport from "./Passport/passport-config.mjs";
import e from "express";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";
import UserRoute from "./Routes/UserRoute.mjs";
import EmployeeRoute from "./Routes/EmployeeRoute.mjs";
import cors from "cors";
const PORT = process.env.PORT || 4000;
const app = e();
// Req logging
app.use(morgan("dev"));
// Making connection with DB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connection Established with Database!");
  })
  .catch((err) => {
    console.log("Unable to connect to DB!");
    console.log("Exiting...");
    process.exit(1);
  });

// cors
const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.includes("localhost:3000") ||
      origin.includes("https://skyniche-employees-cards-assignment.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// allow me to export json from body
app.use(e.json());

// linking passport
app.use(passport.initialize());

// Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/employee", EmployeeRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error!",
  });
});

app.listen(PORT, () => {
  console.log(`SERVER is up and running at port ${PORT}`);
});
