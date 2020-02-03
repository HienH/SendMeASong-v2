const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

//Connect to DB
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(cookieParser());


// Routers
const userRouter = require('./routes/user.router');
const songRouter = require('./routes/song.router');
app.use('/user', userRouter);
app.use('/song', songRouter);

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running in port ${port}`)
})