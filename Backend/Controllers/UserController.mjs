import UserModel from "../Models/UserModel.mjs";
import CustomError from "../Utils/CustomError.mjs";
import validator from "validator";
import Utils from "../Utils/Utils.mjs";
import "dotenv/config";

const registerNewUser = async (req, res, next) => {
  try {
    // Input Validations
    /// is it valid email?
    if (!validator.isEmail(req.body.email)) {
      return next(new CustomError(400, "invalid email !"));
    }
    /// is it valid 10 digits mobile number?
    if (
      !validator.isMobilePhone(req.body.mobile) ||
      req.body.mobile.length < 10
    ) {
      return next(new CustomError(400, "invalid mobile number !"));
    }

    // DB Validations
    /// Does email already exist?
    if (await UserModel.findOne({ email: req.body.email })) {
      return next(new CustomError(400, "email already exist!"));
    }
    /// Does mobile already exist?
    if (await UserModel.findOne({ mobile: req.body.mobile })) {
      return next(new CustomError(400, "mobile already exist!"));
    }
    /// Does username already exist?
    if (await UserModel.findOne({ username: req.body.username })) {
      return next(new CustomError(400, "username already exist!"));
    }

    // Encrypt the password
    req.body.password = await Utils.generatePasswordHash(req.body.password);

    // Creating new user
    const userDoc = new UserModel(req.body);

    // // Save the doc
    userDoc.save();

    // Generate JWT Token
    const Authorization = Utils.generateJwtToken(userDoc);

    // Return success message with JWT Token
    return res.status(201).json({
      success: true,
      Authorization,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError(500, error.message));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { usernameOrEmailOrMobile, password } = req.body;
    if (!usernameOrEmailOrMobile || !password) {
      return next(new CustomError(400, "Credentials missing !"));
    }

    // first detect type of id
    let typeOfID = "username";
    if (validator.isEmail(usernameOrEmailOrMobile)) {
      typeOfID = "email";
    } else if (validator.isMobilePhone(usernameOrEmailOrMobile)) {
      typeOfID = "mobile";
    }

    // find the document
    const userDoc = await UserModel.findOne({
      [typeOfID]: usernameOrEmailOrMobile,
    });
    if (!userDoc) {
      return next(new CustomError(400, "No such User exist !"));
    }

    // verify the password
    if (!(await Utils.isPasswordValid(password, userDoc.password))) {
      return next(new CustomError(400, "Invalid Credentials !"));
    }
    // generate JWT
    const Authorization = Utils.generateJwtToken(userDoc);

    // response
    res.json({ success: true, Authorization });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
const handshakeHello = async (req, res) => {
  res.json({
    success: true,
    message: "hi there!",
  });
};

const UserController = { registerNewUser, loginUser, handshakeHello };
export default UserController;
