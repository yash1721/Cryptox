const path = require("path");
const http = require("http");
var mongoose = require("mongoose");
const Article = require('./models/articles')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const bodyParser = require('body-parser');
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
const dotenv = require('dotenv').config();
const cron = require('node-cron')
const moment = require('moment')
const cookieParser = require('cookie-parser');
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(cookieParser());
// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/openai', require('./routes/openaiRoutes'));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use(bodyParser.json({ limit: '5mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const session = require('express-session');
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.io = io ;
// conect database
mongoose.connect('mongodb://localhost:27017/Cryptex',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
var db = mongoose.connection;

// check connect

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));

// userlogin route
const userlogin = require('./routes/login')
app.use('/login', userlogin)
// userlogin route ends
//user_signup route
const UserSignup = require('./routes/Users_Signup')
app.use('/sign_up', UserSignup)
//==============================


// home page route starts
const homePage = require('./routes/home')
app.use('/', homePage)
// home page route ends 
//Blog

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
// route for the crypto_dashboard page starts
const crypto_dashbaord = require('./routes/crypto_dashboard')
app.use('/index', crypto_dashbaord)

// route for the crypto_dashbaord page ends
app.get('/blog', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})
// liveData api starts

const livedataapi = require('./routes/livedataapi')
app.use('/api/livedata', livedataapi)
// live data api ends
app.use('/articles', articleRouter)

app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
const portfolioRoute = require ('./routes/portfolio')
app.use("/portfolio", portfolioRoute) 
  
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/my_store", function (request, result) {
  result.render("my_store");
});

const paymentRoute= require('./routes/payment')
app.use('/add_money', paymentRoute)


const pdfdownload = require ('./routes/generatepdf')
app.use('/generatepdf', pdfdownload) 

const openairoute = require ('./routes/openaiRoutes')
app.use('/nftimagegenrator' ,  openairoute) ; 

// buy_asset route starts
const buyassetroute = require('./routes/buy_assets');
app.use('/buy_assets', buyassetroute)
// buy_asset route ends

// sell asset_route starts
const sellassetroute = require ('./routes/sell_assets')
app.use('/sell_assets' , sellassetroute)
// sell asset route ends

const paymentSuccess = require ('./routes/paymentSuccess')
app.use('/payment-success', paymentSuccess);
app.get("/contact_us", function (request, result) {
  result.render("contact_us");
});

// transaction route starts
const transactionRoute = require ('./routes/transaction')
app.use("/transactions", transactionRoute);
// transaction route ends

// watchlist route starts
const watchlistroute = require ('./routes/watchlist')
app.use('/watchlist' , watchlistroute)
// watchlist route ends

// otp route starts
const otpRoute = require('./routes/otp')
app.use('/otp', otpRoute )
// otp route ends


//==============================

// auction route starts
const auction = require('./models/auction')
const userData = require('./models/user');
const verifytoken = require('./controllers/auth')
const ObjectId = mongoose.Types.ObjectId
io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      socket.currentRoom = roomId;
  });
  socket.on('chatMessage', (message) => {
      console.log(message)           
      socket.broadcast.to(socket.currentRoom).emit('chatMessage', { text: message, isOwner: false });
  });
  socket.on('disconnect', () => {
      socket.leave(socket.currentRoom);
  });
})
app.get('/auction', verifytoken, async (req, res) => {
  const auctionId = decodeURIComponent(req.query.id)
  const roomId = auctionId;
  io.on('connection', (socket) => {
    socket.emit('joinRoom', roomId);
});
  const auctionData = await auction.findOne({ _id: new ObjectId(auctionId) })
  const Image = await userData.findOne({_id: new ObjectId(req.user.id)})
  res.render('auction.ejs', { data: auctionData , Image:Image.Image});
})
// auction route ends

// marketplace route starts
app.use('/marketplace', async (req, res) => {
  res.render('marketplace.ejs');
})
// marketplace route ends
// prediction api route starts
const predictionapiroute = require('./routes/apiprediction')
app.use('/api/predict', predictionapiroute);
// prediction api route ends


// logout route
const logoutRoute = require('./routes/logout');
app.use('/logout', logoutRoute)
// logout route ends

// forget password route starts
const forgetPasswordRoute = require('./routes/forgetpassword')
app.use('/forgetpassword', forgetPasswordRoute)

// forget password route ends
// route for the reset password starts
const ResetPasswordRoute = require ('./routes/resetpassword')
app.use('/resetpassword', ResetPasswordRoute)
// route for reset password ends

//Route for ProfiCalculator starts
const ProfitCalculatorRoute = require('./routes/ProfitCalculator')
app.use('/ProfitCalculator', ProfitCalculatorRoute)
// Route for ProfitCalculator ends

// Route for the UserProfile Route
const UserProfileRoute = require('./routes/userProfile')
app.use('/userprofile', UserProfileRoute)
// Route for UserProfile ends

// Route for the updating UserProfile Route
const UpdateUserProfileRoute = require('./routes/updateprofile')
app.use('/updateuserprofile', UpdateUserProfileRoute)
// Route for UserProfile ends

// Route for the nft dashboard starts
const nftdashboardRoute = require('./routes/nftdashboard')
app.use('/nftdashboard', nftdashboardRoute)
// Route for nft dashboard ends

// Route for creating Auction starts
const auctionCreationRoute = require('./routes/auctionCreate')
app.use('/auctionCreate', auctionCreationRoute)
// Route for auction creation ends

// googlesignup route ends
const googlesignupRoute = require('./routes/googlesignup')
app.use('/googlesignup', googlesignupRoute)
// google singup route ends

// google login authentication route starts
const googleRoute = require('./routes/googlelogin')
app.use('/auth/google', googleRoute)
// google login authentication route ends

// buyandsellapi route starts
const buyandsellApiRoute = require('./routes/apibuyandsell')
app.use('/api/buysell', buyandsellApiRoute)
// buyandsellapi route ends
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));