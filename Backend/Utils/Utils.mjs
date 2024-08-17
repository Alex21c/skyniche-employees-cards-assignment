import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import 'dotenv/config';

export default class Utils{
  constructor(){

  }

  static async generatePasswordHash(plainText){
    try {
      const saltRounds = 10;
      return await bcrypt.hash(plainText, saltRounds);
      
    } catch (error) {
      throw error;
    }
  }

  static async isPasswordValid(plainTextPassword="", userPwdHashFromDB="123"){
    try {
     return await bcrypt.compare(plainTextPassword, userPwdHashFromDB);
    } catch (error) {
      return false;
    }
  }
  static generateJwtToken(userDoc){
    try {
      return "Bearer " + jwt.sign({
        _id: userDoc._id,
        firstName: userDoc.firstName
      }, process.env.JWT_PRIVATE_KEY, {expiresIn: process.env.USER_SESSION_EXPIRES_AFTER} )
    } catch (error) {
      throw error;
    }
  }

}