const express = require('express')
const bodyParser = require('body-parser')
const app = express()
//const port = 3000

const session = require("express-session")
const port = process.env.PORT || 3000;
//const router = express.Router();

const userDb = require('./queries/userQueries');
const productDb = require('./queries/productQueries');
const cartDb = require('./queries/cartQueries');
const checkoutDb = require('./queries/checkoutQueries');
const orderDb = require('./queries/orderQueries');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
  //add login screen in client; res.render('index')
})

var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}));

app.get('/login', (request, response) => {
  //res.render('login');
})

app.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

/*
app.get('/register', (request, response) => {
  response.json({msg: 'new user'});
  //add register screen in client; res.render('register')
})

app.post("/register", async (req, res) => {
  const {username, password} = req.body;
  const newUser = await userDb.getUsers.createUser({username, password});

  if(newUser) {
    res.status(201).json({
      msg: "New user added", newUser
    });
  } else {
    res.status(500).json({msg: "Register user: Failure"});
  }
})
*/

app.get('/users', userDb.getUsers)
app.get('/users/:id', userDb.getUserById)
app.post('/users', userDb.createUser)
app.put('/users/:id', userDb.updateUser)
app.delete('/users/:id', userDb.deleteUser)

app.get('/products', productDb.getProducts)
app.get('/products/:id', productDb.getProductById)
app.get('/products/:id/quantity', productDb.getProductInventory);
app.post('/products', productDb.createProduct)
app.put('/products/:id', productDb.updateProduct)
app.delete('/products/:id', productDb.deleteProduct)

app.get('/cart', cartDb.getCartItems)
app.get('/cart/:id', cartDb.getCartItemById)
app.get('/cart/:id/total', cartDb.getTotal);
app.get('/cart/:id/session', cartDb.getSessionById)
app.post('/cart', cartDb.createCartItem)
app.post('/cart/:id/session', cartDb.createSession)
app.put('/cart/:id', cartDb.updateCartItem)
app.delete('/cart/:id', cartDb.deleteCartItem)
app.delete('/cart/:id/session', cartDb.deleteSession)

app.get('/checkout/addresses', checkoutDb.getUserAddresses)
app.get('/checkout/addresses/:id', checkoutDb.getUserAddressById)
app.get('/checkout/payments', checkoutDb.getUserPayments)
app.get('/checkout/payments/:id', checkoutDb.getUserPaymentById)
app.post('/checkout/addresses', checkoutDb.createUserAddress)
app.post('/checkout/payments', checkoutDb.createUserPayment)
app.put('/checkout/addresses/:id', checkoutDb.updateUserAddress)
app.put('/checkout/payments/:id', checkoutDb.updateUserPayment)
app.delete('/checkout/addresses/:id', checkoutDb.deleteUserAddress)
app.delete('/checkout/payments/:id', checkoutDb.deleteUserPayment)

app.get('/order/details', orderDb.getOrderDetails)
app.get('/order/details/:id', orderDb.getOrderDetailById)
app.get('/order/items', orderDb.getOrderItems)
app.get('/order/items/:id', orderDb.getOrderItemById)
app.get('/order/payments', orderDb.getPaymentDetails)
app.get('/order/payments/:id', orderDb.getPaymentDetailById)
app.post('/order/details', orderDb.createOrderDetail)
app.post('/order/items', orderDb.createOrderItem)
app.post('/order/payments', orderDb.createPaymentDetail)
app.put('/order/details/:id', orderDb.updateOrderDetail)
app.put('/order/items/:id', orderDb.updateOrderItem)
app.put('/order/payments/:id', orderDb.updatePaymentDetail)
app.delete('/order/details/:id', orderDb.deleteOrderDetail)
app.delete('/order/items/:id', orderDb.deleteOrderItem)
app.delete('/order/payments/:id', orderDb.deletePaymentDetail)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})



