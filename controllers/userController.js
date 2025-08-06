const joi = require ("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_key;
const user = require ("../models/userModel");

//registeration function
async function reg (req, res, next)
{
//validate input
const userSchema = joi.object({
fName: joi.string().required(),
sName: joi.string().required(),
email: joi.string().email().required(),
password: joi.string().min(8).max(20).required()
});

const result = userSchema.validate(req.body);
if (result.error) 
  return res.status(400).send(result.error.details[0].message);

  const { fName, sName, email, password } = result.value;

  try{
//Check if the email already exists
const existingUser = await user.findOne ({email});
if (existingUser)
    return res.status(409).send("This email is already registered");

//Hash the password
const hashedPassword = await bcrypt.hash(password, 10);

//create and save the user
    const newUser = new user ({
          fName,
      sName,
      email,
    password: hashedPassword,
            });

    await newUser.save();
    return res.status(201).send("User created successfully");
        }catch (err) {
            next(err);
        }
}

//user   login
async function login (req, res, next)
{
const {email, password} = req.body;

try {
//find user by email
const findUser= await user.findOne({email});

if (!findUser)
    return res.status(400).send("The email is not exist");
if (findUser.lockedUntil && findUser.lockedUntil > Date.now()) {
  return res.status(403).send("Account temporarily locked due to multiple failed login attempts. Try again later.");
}

//password checking
const passMatch = await bcrypt.compare (password, findUser.password);
if (!passMatch) {
  findUser.loginAttempts += 1;

  if (findUser.loginAttempts >= 5) {
    findUser.lockedUntil = Date.now() + 15 * 60 * 1000; // lock for 15 minutes
    await findUser.save();
    return res.status(403).send("Too many failed attempts. Account locked for 15 minutes.");
  }

  await findUser.save();
  return res.status(400).send("Incorrect password");
}

findUser.loginAttempts = 0;
findUser.lockedUntil = null;
await findUser.save();


const accessToken = jwt.sign(
{ id: findUser._id},
secretKey,
{expiresIn: "15m"}
);

const refreshToken = jwt.sign (
    {id: findUser._id},
    secretKey,
    {expiresIn: "30d"}
);

return res.status(200)
.cookie ("refreshToken", refreshToken,
    {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
.json ({
message: "Login successful",
accessToken,
});
} catch (err) {
    next(err);
}
}

//user logout
async function logout(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  }).send("Logged out successfully");
}


//user profile
async function userProfile (req, res, next)
{
try {
    const findUser = await user.findById(req.user.id).select("-password");
if (!findUser)
    return res.status(404).send("User not found");

res.json(findUser);
} catch (err) {
    next(err);
}
}

//listing all users
async function getUsers(req, res, next){
    try {
        const users = await user.find({}, "-password");
        return res.json(users);
    } catch (err) {
        next(err);
    }
}

//updating a user
async function updateUser (req, res, next)
{
const userID = req.user.id;
const {fName, sName, email, password} = req.body;

try {
    const users = await user.findById (userID);
if (!users) return res.status(404).send("User not found");

//Update the provided fields
if (fName) users.fName = fName;
    if (sName) users.sName = sName;
    if (email) users.email = email;
    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      users.password = hashedPass;
    }

    //Save changes
    await users.save();
    return res.status(200).send("User updated successfully");
} catch (err) {
    next(err);
}
}

//deleting a user
async function deleteUser(req, res, next)
{
const userID = req.user.id;

try {
    const deletedUser = await user.findByIdAndDelete(userID);
        if (!deletedUser)
      return res.status(404).send("User not found");

    return res.status(200).send("User deleted successfully");
  } catch (err) {
    next(err);
}
}

async function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(401).send("Refresh token not found");

  try {
    const decoded = jwt.verify(token, secretKey);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      secretKey,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
}

module.exports = {
reg,
login,
logout,
userProfile,
getUsers,
updateUser,
deleteUser,
refreshToken
};