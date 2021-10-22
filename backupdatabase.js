const { ObjectId, MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

async function getDB() {
    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0805DB");
    return dbo;
}

//return "-1": invalid; admin or customer
async function getRole(nameInput, pass) {
    const dbo = await getDB();
    const s = await dbo.collection("users").findOne({ name: nameInput, pass: pass });
    if (s == null)
        return "-1";
    else
        return s.role;
}

async function insertUser(newUser) {
    const dbo = await getDB();
    await dbo.collection("users").insertOne(newUser);
}

async function insertStudent(newStudent) {
    const dbo = await getDB();
    await dbo.collection("students").insertOne(newStudent);
}

async function updateStudent(id, nameInput, tuoiInput) {
    const filter = { _id: ObjectId(id) };
    const newValue = { $set: { name: nameInput, tuoi: tuoiInput } };

    const dbo = await getDB();
    await dbo.collection("students").updateOne(filter, newValue);
}
async function getStudentById(id) {
    const dbo = await getDB();
    const s = await dbo.collection("students").findOne({ _id: ObjectId(id) });
    return s;
}
async function deleteStudent(id) {
    const dbo = await getDB();
    await dbo.collection("students").deleteOne({ "_id": ObjectId(id) });
}
module.exports = { getDB, insertStudent, updateStudent, getStudentById, deleteStudent, insertUser }
    // exports.getDB = getDB;
    // exports.insertStudent = insertStudent;
    // exports.updateStudent = updateStudent;