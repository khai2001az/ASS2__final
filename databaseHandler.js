const { ObjectId, MongoClient } = require('mongodb');
const url = "mongodb+srv://khaidb:Ditmemay0909@cluster0.rjzex.mongodb.net/test";

async function getDB() {
    const client = await MongoClient.connect(url);
    const dbo = client.db("KhaiDB");
    return dbo;
}

//return "-1": invalid; admin or customer
async function getRole(nameInput, password) {
    const dbo = await getDB();
    const s = await dbo.collection("users").findOne({ username: nameInput, password: password });
    if (s == null)
        return "-1";
    else
        return s.role;
}

async function insertUser(newUser) {
    const dbo = await getDB();
    await dbo.collection("users").insertOne(newUser);
}

async function insertProduct(insertProduct) {
    const dbo = await getDB();
    await dbo.collection("SanPham").insertOne(insertProduct);
}



async function updateProduct(id, nameInput, priceInput, pictureInput) {
    const filter = { _id: ObjectId(id) };
    const newValue = { $set: { name: nameInput, price: priceInput, imgUrl: pictureInput } };

    const dbo = await getDB();
    await dbo.collection("SanPham").updateOne(filter, newValue);
}



async function getProductById(id) {
    const dbo = await getDB();
    const s = await dbo.collection("SanPham").findOne({ _id: ObjectId(id) });
    return s;
}


async function deleteProduct(id) {
    const dbo = await getDB();
    await dbo.collection("SanPham").deleteOne({ "_id": ObjectId(id) });
}


module.exports = {
        getDB,
        insertProduct,
        updateProduct,
        getProductById,
        deleteProduct,
        insertUser,
        getRole,

    }
    // exports.getDB = getDB;
    // exports.insertStudent = insertStudent;
    // exports.updateStudent = updateStudent;