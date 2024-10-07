const { User } = require('./schema');

function datenow () {
const today = new Date();
const date = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
return `${day}/${month}/${year}, ${timeNow}`;
}

async function createUser(username, password) {
let obj = {
username,
password,
access: true,
number: []
}
try {
const users = await User.find({});
if (users && users.some(item => item.username === username)) return {
status: 400,
creator: 'SuryaDev',
message: 'This username already in database'
}
await User.create(obj);
return {
status: 200,
creator: 'SuryaDev',
message: 'User created successfully.'
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error creating user: ' + String(error)
}
}
}
module.exports.createUser = createUser;

async function deleteUser(username) {
try {
const user = await User.deleteOne({
username: username
});
if (user.deletedCount === 1) {
return {
status: 200,
creator: 'SuryaDev',
message: 'User removed successfully'
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error removing user: ' + String(error)
}
}
}
module.exports.deleteUser = deleteUser;

async function checkUser(username) {
let users = await User.findOne({
username: username
});
if (users) {
let result = {
id: users._id,
username: users.username,
password: users.password,
access: users.access,
number: users.number
}
return {
status: 200,
creator: 'SuryaDev',
data: result
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
}
module.exports.checkUser = checkUser;

async function changeAccessUser(username, statuses) {
try {
let user = await User.findOne({
username: username
});
if (user) {
if (typeof statuses !== 'boolean') return {
status: 400,
creator: 'SuryaDev',
message: 'Access must be a boolean true or false'
};
if (user.access === statuses) return {
status: 400,
creator: 'SuryaDev',
message: 'Access already this.'
};
user.access = statuses;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully changed access on username ${username} to ${statuses}`
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
}
}
}
module.exports.changeAccessUser = changeAccessUser;

async function getUsername(number) {
let username = '';
try {
const userData = await User.find({});
if (userData.length > 0) {
userData.forEach(user => {
user.number.forEach(item => {
if (item.number === number) {
username = user.username;
}
});
});
}
return username;
} catch (e) {
console.log(e);
return username;
}
}
module.exports.getUsername = getUsername;

async function getPassword(username) {
try {
let user = await User.findOne({
username: username
});
if (!user) return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
return {
status: 200,
creator: 'SuryaDev',
data: user.password
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
}
}
}
module.exports.getPassword = getPassword;

async function changePassword(username, password) {
try {
let user = await User.findOne({
username: username
});
if (user) {
if (user.password === password) return {
status: 400,
creator: 'SuryaDev',
message: 'Password already this.'
}
user.password = password;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully changed password on username ${username}`
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
}
}
}
module.exports.changePassword = changePassword;

async function getNumber(username) {
try {
let user = await User.findOne({
username: username
});
if (!user) return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
return {
status: 200,
creator: 'SuryaDev',
data: user.number
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
}
}
}
module.exports.getNumber = getNumber;

async function findIndexNumber(username, number) {
try {
let user = await User.findOne({
username: username
});
if (!user) return {
status: false,
creator: 'SuryaDev',
message: 'User data not found.'
}
const index = user.number.findIndex(x => x.number === number);
const data = index ? (index + 1) : 0;
return isNaN(data) ? 0 : data;
} catch (error) {
return 0;
}
}
module.exports.findIndexNumber = findIndexNumber;

async function updateNumber(number, botname, connect) {
try {
const username = await getUsername(number)
const user = await User.findOne({
username: username
});
if (user) {
let numbers = [...user.number];
let timenow = datenow();
numbers.forEach((item, index) => {
if (numbers.length > 0 && item.number === number) {
let totalconnect = (typeof connect !== 'undefined') ? connect : item.totalconnect + 1;
numbers[index] = {
number: item.number,
logintime: item.logintime,
botname: botname || 'WhatsApp Bot',
lastconnect: timenow,
totalconnect: parseInt(totalconnect)
};
}
});
user.number = numbers;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully update number from username ${username}`
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
}
}
}
module.exports.updateNumber = updateNumber;

async function addNumber(username, object = {}) {
let invalid = {
status: 400,
creator: 'SuryaDev',
message: 'number & logintime parameter is required.'
}
try {
const user = await User.findOne({
username: username
});
if (user) {
if (typeof object !== 'object') return invalid;
if (!(object.number && object.logintime)) return invalid;
if (user.number && user.number.some(item => item.number === object.number)) return {
status: 400,
creator: 'SuryaDev',
message: 'This number already in database.'
}
let numbers = [...user.number, object]
user.number = numbers;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully added number to username ${username}`
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error extending number: ${error.message}`
}
}
}
module.exports.addNumber = addNumber;

async function delNumber(username, number) {
try {
const user = await User.findOne({
username: username
});
if (user) {
let numbers = [...user.number];
// Temukan indeks data dengan number
const indexToRemove = numbers.findIndex(item => item.number === number);
if (indexToRemove === -1) return {
status: 400,
creator: 'SuryaDev',
message: 'This number not in database.'
}
// Jika indeks ditemukan, lakukan splice untuk menghapus data dari array
if (indexToRemove !== -1) {
numbers.splice(indexToRemove, 1);
}
user.number = numbers;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully delete number to username ${username}`
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error extending number: ${error.message}`
}
}
}
module.exports.delNumber = delNumber;

async function resetNumber(username, number) {
try {
const user = await User.findOne({
username: username
});
if (user) {
user.number = [];
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully reset number from username ${username}`
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error extending number: ${error.message}`
}
}
}
module.exports.resetNumber = resetNumber;

async function listUsers() {
try {
const users = await User.find({});
if (users.length > 0) {
let result = users.map(user => ({
username: user.username,
password: user.password,
access: user.access,
number: user.number
}));
return {
status: 200,
creator: 'SuryaDev',
data: result
}
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'No users found'
}
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error retrieving users: ${error.message}`
}
}
}
module.exports.listUsers = listUsers;