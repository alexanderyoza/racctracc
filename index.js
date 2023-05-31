const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const path = require("path");
// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB CONNECTED'))
.catch(err => console.log('DB CONNECTION ERROR', err));


app.use(express.static('public'));
app.use('/images', express.static('images'));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));


// routes
const userRouter = require('./backend/routes/userRoutes');
const uploadRouter = require('./backend/routes/uploadRoutes');
app.use('/api/users', userRouter);
app.use('/api/uploads', uploadRouter);

//deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
}

// port
const port = process.env.PORT || 9000;



// listener
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));