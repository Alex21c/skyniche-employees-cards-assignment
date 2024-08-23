import EmployeeModel from "../Models/EmployeeModel.mjs";
import CustomError from "../Utils/CustomError.mjs";
import CloudinaryHelper from "../Utils/CloudinaryHelper.mjs";
import validator from "validator";
import Utils from "../Utils/Utils.mjs";
import fs from "fs";
import "dotenv/config";
import mongoose from "mongoose";
const registerNewEmployee = async (req, res, next) => {
  try {
    console.log(req.body);

    const doc = new EmployeeModel(req.body);
    const profileImage = req?.file;
    if (profileImage) {
      try {
        const objCloudinary = new CloudinaryHelper();
        const response = await objCloudinary.uploadFile(
          profileImage,
          `${process.env.PRJ_NAME || "skyniche-employees-cards-assignment"}/${
            req.body.firstName
          }-${req.body.lastName}-profileImage/${doc._id}`
        );
        if (!response) {
          throw new Error("failed to upload file");
        }

        const imgData = {
          public_id: response.public_id,
          url: response.secure_url,
        };
        doc.profileImage = imgData;
      } catch (error) {
        return next(
          new CustomError(
            500,
            "Failed to upload image file to server ! " + error.message
          )
        );
      } finally {
        // delete file from uploads dir
        setTimeout(() => {
          fs.unlinkSync(req.file.path);
        }, 2000);
      }
    }
    doc.save();

    // Return success message with JWT Token
    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};
const getEmployeeById = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return next(new CustomError(400, "missing employeeId"));
    }
    // is it valid mongodb doc id?
    if (!mongoose.isValidObjectId(employeeId)) {
      return next(
        new CustomError(400, `provided employeeId:${employeeId} is invalid`)
      );
    }

    // find the employee
    const employee = await EmployeeModel.findById(employeeId);

    // Return success message with JWT Token
    return res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};
const deleteEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return next(new CustomError(400, "missing employeeId"));
    }
    // is it valid mongodb doc id?
    if (!mongoose.isValidObjectId(employeeId)) {
      return next(
        new CustomError(400, `provided employeeId:${employeeId} is invalid`)
      );
    }

    // find the employee
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return next(new CustomError(400, `Employee not found !`));
    }

    // if there is an cloudinary profile image then delete it
    try {
      const objCloudinary = new CloudinaryHelper();
      // delete existing profile image from cloudinary if it exist?
      if (employee?.profileImage) {
        // check if there is an body image then delete it from cloudinary
        const public_id = employee.profileImage.get("public_id");
        try {
          if (public_id) {
            await objCloudinary.deleteFile(public_id);
            // delete dir as well containing the image
            const parts = public_id.split("/");
            parts.pop();
            parts.pop();
            const folderID = parts.join("/");
            await objCloudinary.deleteFolder(folderID);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } catch (error) {
      return next(
        new CustomError(
          500,
          "Failed to upload image file to server ! " + error.message
        )
      );
    }

    try {
      await employee.deleteOne();
    } catch (error) {
      new CustomError(500, "Failed to delete Employee ! " + error.message);
    }

    // Return success message with JWT Token
    return res.json({
      success: true,
      data: "Employee record deleted !",
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};
const getAllTheEmployees = async (req, res, next) => {
  try {
    // find the employee
    const employees = await EmployeeModel.find();

    // Return success message with JWT Token
    return res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};
const getEmployeesBasedOnCustomFilters = async (req, res, next) => {
  try {
    const { firstName, lastName, department, designation } = req.query;

    if (!firstName && !lastName && !department && !designation) {
      return next(
        new CustomError(
          400,
          "Supplied filters are null, firstName, lastName, department, designation"
        )
      );
    }

    const filters = [];
    if (firstName) {
      filters.push({ firstName: { $regex: new RegExp(firstName, "i") } });
    }
    if (lastName) {
      filters.push({ lastName: { $regex: new RegExp(lastName, "i") } });
    }
    if (department) {
      filters.push({ department: { $regex: new RegExp(department, "i") } });
    }
    if (designation) {
      filters.push({ designation: { $regex: new RegExp(designation, "i") } });
    }
    console.log(filters);
    const employees = await EmployeeModel.find({ $or: filters });

    if (!employees.length) {
      return next(new CustomError(404, "No matching employees found"));
    }

    // Return success message with JWT Token
    return res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};
const updateEmployeeDetails = async (req, res, next) => {
  try {
    // is provided employeeId valid?
    const { employeeId } = req.body;
    if (!employeeId) {
      return next(new CustomError(400, "missing employeeId"));
    }
    // is it valid mongodb doc id?
    if (!mongoose.isValidObjectId(employeeId)) {
      return next(
        new CustomError(400, `provided employeeId:${employeeId} is invalid`)
      );
    }

    // find the employee
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return next(new CustomError(400, `Employee not found !`));
    }

    // first update the textual details
    const {
      firstName,
      lastName,
      email,
      department,
      designation,
      dateOfJoining,
      monthlySalary,
    } = req.body;
    if (firstName) {
      employee.firstName = firstName;
    }
    if (lastName) {
      employee.lastName = lastName;
    }
    if (email) {
      employee.email = email;
    }
    if (department) {
      employee.department = department;
    }
    if (designation) {
      employee.designation = designation;
    }
    if (dateOfJoining) {
      employee.dateOfJoining = dateOfJoining;
    }
    if (monthlySalary) {
      employee.monthlySalary = monthlySalary;
    }
    // and then update the image details
    // is there any profile Image provided in the req
    const profileImage = req?.file;
    if (profileImage) {
      try {
        const objCloudinary = new CloudinaryHelper();
        // delete existing profile image from cloudinary if it exist?
        if (employee?.profileImage) {
          // check if there is an body image then delete it from cloudinary
          const public_id = employee.profileImage.get("public_id");
          try {
            if (public_id) {
              await objCloudinary.deleteFile(public_id);
            }
          } catch (error) {
            console.log(error.message);
          }
        }

        // upload new profile image

        const response = await objCloudinary.uploadFile(
          profileImage,
          `${process.env.PRJ_NAME || "skyniche-employees-cards-assignment"}/${
            req.body.firstName || employee.firstName
          }-${req.body.lastName || employee.lastName}-profileImage/${
            employee._id
          }`
        );
        if (!response) {
          throw new Error("failed to upload file");
        }

        const imgData = {
          public_id: response.public_id,
          url: response.secure_url,
        };
        employee.profileImage = imgData;
      } catch (error) {
        return next(
          new CustomError(
            500,
            "Failed to upload image file to server ! " + error.message
          )
        );
      } finally {
        // delete file from uploads dir
        setTimeout(() => {
          fs.unlinkSync(req.file.path);
        }, 2000);
      }
    }

    employee.save();

    // Return success message with JWT Token
    return res.json({
      success: true,
      msg: "wait",
      data: employee,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};

const EmployeeController = {
  registerNewEmployee,
  getEmployeeById,
  getAllTheEmployees,
  getEmployeesBasedOnCustomFilters,
  updateEmployeeDetails,
  deleteEmployee,
};
export default EmployeeController;
