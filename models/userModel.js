const fs = require("fs/promises");
const path = require("path");
const usersPath = path.join(__dirname, "../data/users.json");

//load users from json file
async function loadUsers ()
{
const readUsers = await fs.readFile(usersPath, "utf-8");
return JSON.parse(readUsers);
}

//save users
async function saveUsers (users)
{
    const json = JSON.stringify(users, null, 2);
await     fs.writeFile (usersPath, json);
}

module.exports = {
    loadUsers,
    saveUsers
};