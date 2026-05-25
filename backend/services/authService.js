import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserTypeModel } from '../models/UserModel.js';

//register function
export const register = async (userObj) => {
// normalize and whitelist allowed fields to avoid strict schema throw
const normalizedUser = {
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    email: userObj.email,
    password: userObj.password,
    role: userObj.role,
};

// Only add profileImage if it's a valid string (not empty object from file input)
const profileImg = userObj.profileImage ?? userObj.profileImageUrl;
if (profileImg && typeof profileImg === 'string' && profileImg.trim()) {
    normalizedUser.profileImage = profileImg;
}

//create document
const userDoc = new UserTypeModel(normalizedUser);

//validate for empty passwords
await userDoc.validate();
//hash and replace plain password
userDoc.password = await bcrypt.hash(userDoc.password, 10);
//save to database
const created = await userDoc.save();
//convert to object and remove password before returning
const newUserObj = created.toObject();
delete newUserObj.password; //remove password field for security reasons
return newUserObj; //return user data without password

};



//AUTHENTICATE FUNCTION
export const authenticate = async (email, password, selectedRole) => {
    console.log('Attempting to authenticate:', { email, hasPassword: !!password });
    
    //check user with email and role
    const user = await UserTypeModel.findOne({ email});

    console.log('User found:', user ? `Yes (${user.email}, role: ${user.role})` : 'No');

    if (!user) {
        const err = new Error("wrong credentials");
        err.status = 401;
        throw err;
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
        const err = new Error("wrong credentials");
        err.status = 401;
        throw err;
    }

    // Enforce role selected in login form.
    if (selectedRole && user.role !== selectedRole) {
        const err = new Error("unauthorized login");
        err.status = 401;
        throw err;
    }

    //check isActive status
    if(user.isActive==false)
        {
        const err= new Error("your account is blocked, please contact admin");
        err.status=403;
        throw err
    }

    //generate JWT token
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: '1h' }
    );

    const userObj = user.toObject();
    delete userObj.password; //remove password field for security reasons
    return { user: userObj, token };
};

export const verifyToken = (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const rawCookie = req.headers.cookie || "";
        const cookieToken = rawCookie
            .split(";")
            .map((part) => part.trim())
            .find((part) => part.startsWith("token="))
            ?.split("=")[1];

        const headerToken = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();
        const token = req.cookies?.token || cookieToken || headerToken;

        if (!token || token === "undefined" || token === "null") {
            return res.status(401).json({ message: "Token required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
