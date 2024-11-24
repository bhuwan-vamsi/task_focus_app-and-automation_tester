require('dotenv').config()
const express = require('express')
const { mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database Connected'))
.catch((err) => console.log('Database Connection Failed', err))

const app = express();

// middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/users", require("./routes/userRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));