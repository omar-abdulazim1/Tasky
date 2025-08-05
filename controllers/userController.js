const joi = require ("joi");
const bcrypt = require("bcrypt");
const user = require ("../models/userModel");

//registeration function
async function reg (req, res)
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
            return res.status(500).send("Something went wrong.");
        }
}

//user login 
async function login (req, res)
{
const {email, password} = req.body;

try {
//find user by email
const findUser= await user.findOne({email});
if (!findUser)
    return res.status(400).send("The email is not exist");

//password checking
const passMatch = await bcrypt.compare (password, findUser.password);
if (!passMatch)
    return res.status(400).send("Incorrect password");

return res.status(200).send("loggin successful");
} catch (err) {
    return res.status(500).send("Something went wrong during login");
}
}

//listing all users
async function getUsers(req, res){
    try {
        const users = await user.find({}, "-password");
        return res.json(users);
    } catch (err) {
        return res.status(500).send("Failed to load users");
    }
}

//updating a user
async function updateUser (req, res)
{
const userID = req.params.id;
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
    return res.status(500).send("Failed to update user");
}
}

//deleting a user
async function deleteUser(req, res)
{
const userID = req.params.id;

try {
    const deletedUser = await user.findByIdAndDelete(userID);
        if (!deletedUser)
      return res.status(404).send("User not found");

    return res.status(200).send("User deleted successfully");
  } catch (err) {
    return res.status(500).send("Failed to delete user");
}
}

module.exports = {
reg,
login,
getUsers,
updateUser,
deleteUser
};