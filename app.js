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
    insertUser,
    getRole,

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

app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async(req, res) => {
    const username = req.body.txtName;
    const password = req.body.txtPassword;

    if (username.length == " ") {
        res.render("register", { errorMsg: 'You should input name' })
        return;
    }
    if (password.length == " ") {
        res.render("register", { errorMsg: 'You should input password' })
        return;
    }
    insertUser({ username: username, password: password })
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/doLogin', async(req, res) => {
    const username = req.body.txtName;
    const password = req.body.txtPassword;

    if (username.length == " ") {
        res.render("login", { errorMsg: 'You should input name' })
        return;
    }
    if (password.length == " ") {
        res.render("login", { errorMsg: 'You should input password' })
        return;
    }
    console.log(username)
        //get role from database: could be "-1", admin, customer
    var role = await getRole(username, password);
    if (role != "-1") {
        req.session["User"] = {
            username: username,
            role: role

        }
    }
    res.redirect('/');
})

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
    const newProduct = { name: nameInput, price: priceInput, imgUrl: pictureInput, size: { dai: 20, rong: 40 } }

    if (nameInput.length <= 2) {
        res.render("index", { errorMsg: 'Name should be more than 2 character' })
        return;
    }
    if (priceInput.length == ' ') {
        res.render("index", { errorMsg: 'You should input name' })
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

app.post('/search', async(req, res) => {
    const searchInput = req.body.txtSearch;
    const dbo = await getDB()
    const allProducts = await dbo.collection("SanPham").find({ name: searchInput }).toArray();

    res.render('index', { data: allProducts })
})

app.get('/', checkLogin, async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("SanPham").find({}).toArray();
    res.render('index', { data: allProducts, auth: req.session["users"] })
})


app.get('/noLogin', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("SanPham").find({}).toArray();
    res.render('nologin', { data: allProducts, auth: req.session["users"] })
})

function checkLogin(req, res, next) {
    if (req.session["User"] == null) {
        res.redirect('/nologin')
    } else {
        next()
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})