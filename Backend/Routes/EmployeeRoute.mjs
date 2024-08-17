import e from "express";
import passport from "../Passport/passport-config.mjs";
import EmployeeController from "../Controllers/EmployeeController.mjs";
import multerUploadMiddleware from "../Multer/multer-config.mjs";
import CustomError from "../Utils/CustomError.mjs";
import "dotenv/config";
const EmployeeRoute = e.Router();
EmployeeRoute.post(
  "/register-new-employee",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    multerUploadMiddleware(req, res, (err) => {
      if (err) {
        next(
          new CustomError(
            400,
            err.message,
            " max. allowed fileSize: " +
              process.env.MAX_ALLOWED_FILE_UPLOAD_SIZE +
              "KB"
          )
        );
      } else {
        next();
      }
    });
  },
  EmployeeController.registerNewEmployee
);
EmployeeRoute.get(
  "/get-employee-by-id",
  passport.authenticate("jwt", { session: false }),
  EmployeeController.getEmployeeById
);
EmployeeRoute.get(
  "/get-all-the-employees",
  passport.authenticate("jwt", { session: false }),
  EmployeeController.getAllTheEmployees
);
EmployeeRoute.get(
  "/get-employees-based-on-custom-filters",
  passport.authenticate("jwt", { session: false }),
  EmployeeController.getEmployeesBasedOnCustomFilters
);
EmployeeRoute.delete(
  "/delete-employee",
  passport.authenticate("jwt", { session: false }),
  EmployeeController.deleteEmployee
);
EmployeeRoute.patch(
  "/update-employee-details",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    multerUploadMiddleware(req, res, (err) => {
      if (err) {
        next(
          new CustomError(
            400,
            err.message +
              " max. allowed fileSize: " +
              process.env.MAX_ALLOWED_FILE_UPLOAD_SIZE_IN_KB +
              "KB"
          )
        );
      } else {
        next();
      }
    });
  },
  EmployeeController.updateEmployeeDetails
);
export default EmployeeRoute;
