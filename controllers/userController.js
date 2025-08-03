const joi = require ("joi");
const bcrypt = require("bcrypt");

const {
    loadUsers,
    saveUsers
} = require ("../models/userModel");

//registeration function
async function reg (req, res)
{
const users= await loadUsers();

const userSchema = joi.object({
fName: joi.string().required(),
sName: joi.string().required(),
email: joi.string().email().required(),
password: joi.string().min(8).max(20).required()
});

const result = userSchema.validate(req.body);
if (result.error) 
  return res.status(400).send(result.error.details[0].message);

//Check if the email already exists
const emailExist = users.find (user => user.email === result.value.email);
if (emailExist)
    return res.status(409).send("This email is already registered");

//Hash the password
const hashedPassword = await bcrypt.hash(result.value.password, 10);

    const newUser = {
    ...result.value,
    password: hashedPassword,
        userID: Date.now(),
    createdDate: new Date().toISOString()
};

    users.push(newUser);

    saveUsers(users);
    return res.status(201).send("User created successfully");
}

//user login 
async function login (req, res)
{
const users= await loadUsers();
const {email, password} = req.body;
//email checking
const findUser= users.find(user=> user.email === email);
if (!findUser)
    return res.status(400).send("The email is not exist");

//password checking
const passMatch = await bcrypt.compare (password, findUser.password);
if (!passMatch)
    return res.status(400).send("The password is not exist");

return res.status(200).send("loggin successful");
}

//listing all users
async function getUsers(req, res)
{
    try {
    const getALLUsers= await loadUsers();
    const safeUsers = getALLUsers.map(({ password, ...rest }) => rest);
return res.json(safeUsers);
    } catch (err)
    {
        return res.status(500).send("Failed to load users");
    }
}

//updating a user
async function updateUser (req, res)
{
const users= await loadUsers();

//find the user by ID
const userID = Number(req.params.userID);
const findUser = users.find(user => user.userID === userID);
if (!findUser) return res.status(404).send("This user is not exist");

//extracting the new data
const {fName, sName, email, password} = req.body;
//Update the user’s data safely

if (fName) findUser.fName = fName;
if (sName) findUser.sName = sName;
if (email) findUser.email = email;
if (password) findUser.password = password; // later, you can hash this

await saveUsers(users);
return res.status(200).send("User updated successfully");
}

//deleting a user
async function deleteUser(req, res)
{
const users= await loadUsers();

//Find the user by his id
const userID= Number(req.params.userID);
const findUser = users.find (user => user.userID === userID);
if (!findUser) return res.status(404).send("The user is not exist");

//filtering the users
const updatedUsers = users.filter(user => user.userID != userID);
await saveUsers(updatedUsers);
  return res.status(200).send("User deleted successfully");
}

module.exports = {
reg,
login,
getUsers,
updateUser,
deleteUser
};