const express = require('express')
const session = require('express-session');
const { Admin } = require('mongodb');


const app = express()

const {
    insertProduct,
    updateProduct,
    getProductById,
    deleteProduct,
    getDB,

} = require('./databaseHandler');

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '156655hjkkjhgggghgg',
    cookie: { maxAge: 600000 }
}));


app.get('/edit', async(req, res) => {
    const id = req.query.id;

    const s = await getProductById(id);
    res.render("edit", { student: s });
})
app.post('/update', async(req, res) => {
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.txtPicture;
    const id = req.body.txtId;

    
    updateProduct(id, nameInput, priceInput, pictureInput);
    res.redirect("/");
})
app.get('/insert', (req, res) => {
    res.render('insert')
})
app.post('/insert', async(req, res) => {
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.txtPicture;
    const newProduct = {name: nameInput, price: priceInput, imgUrl: pictureInput, size: { dai: 20, rong: 40 } }
    
    if (nameInput.length  < 4) {
        res.render("insert", { errorMsg: 'Name should be more than 4 character' })
        return;
    } 
    await insertProduct(newProduct, "SanPham");
    res.redirect("/");
})
app.get('/delete', async(req, res) => {
    const id = req.query.id;

    
    await deleteProduct(id);
    res.redirect("/");
})

app.get('/', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("SanPham").find({}).toArray();
    res.render('index', { data: allProducts, auth: req.session["users"] })
})


app.get('/noLogin', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("SanPham").find({}).toArray();
    res.render('nologin', { data: allProducts, auth: req.session["users"] })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})