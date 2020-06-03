const express = require('express');
const app = express();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcryptjs');


const UserModel = require('./models/users');
const AdvertisingModel = require('./models/advertising');
const OrderModel = require('./models/orders');

require('./configs/passport')
require('./middlewares')(app);
require('./routes')(app);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage });


app.post(("/login"), (req, res, next) => {
  passport.authenticate('local', { session: false, }, (err, user, info) => {
    if (err || !user) {
      // res.send(err.message);
      return res.status(400).json({
        message: info.message || err,
        user: user
      });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user.id, 'jwtsecret');

      return res.status(200).json({
        token: token,
        user: {
          id: user.id,
          role: user.role
        }
      });

    });
  })(req, res);
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body
  const salt = await bcrypt.genSalt(10);
  const userPassword = await bcrypt.hash(password, salt);
  UserModel.add(email, userPassword)
    .then((result) => {
      res.statusCode = 200;
      res.send("registred");
    }).catch((err) => {
      res.statusCode = 409;
      res.send(`email ${err.fields.email} is already exist`);
    })

});

app.post('/add-order', (req, res) => {
  const { name, price, totalPrice, count, userId } = req.body;
  UserModel.getUserById(userId)
    .then(user => {
      OrderModel.add(user.dataValues.email, name, price, totalPrice, count)
        .then(_ => {
          res.statusCode = 200;
          res.send('ordered')
        })
        .catch(err => console.log(err));
    });
});

app.post('/admin/add-goods', upload.single('goods'), (req, res) => {
  const { name, price } = req.body;
  const img = `http://localhost:8080/static/uploads/${req.file.filename}`;
  AdvertisingModel.add(name, img, price)
    .then(_ => res.redirect('/admin'));
});

app.get('/admin/orders', passport.authenticate('jwt', { session: false }), (req, res) => {
  (req.user.role === "admin") ?
    OrderModel.getAll()
      .then(orders => {
        res.statusCode = 200;
        res.send(orders);
      }) :
    res.next();
});

app.get('/admin/goods', passport.authenticate('jwt', { session: false }), (req, res) => {
  (req.user.role === "admin") ?
    AdvertisingModel.getAll()
      .then(goods => res.send(goods)) :
    res.next();
})

app.get('/goods', (req, res) => {
  AdvertisingModel.getAll()
    .then(goods => res.send(goods));
});


app.get('/admin/goods', passport.authenticate('jwt', { session: false }), (req, res) => {
  (req.user.role === "admin") ?
    GoodsModel.getAll()
      .then(goods => res.send(goods)) :
    res.status(403)

})

app.listen(8080);
