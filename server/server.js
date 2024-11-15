require('dotenv').config()
const express = require('express')
const { mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')

// database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database Connected'))
.catch((err) => console.log('Database Connection Failed', err))

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes/authRoutes'));

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));