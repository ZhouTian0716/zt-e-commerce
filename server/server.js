const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { readdirSync } = require('fs');

// App
const app = express();

// Database
mongoose.connect(process.env.DATABASE_MONGODB_URI || 'mongodb://localhost/ztEcomLocalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => console.log(`DB CONNECTED`))
.catch(err => console.log(`DB CONNECTION ERR`, err));

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cors());

// Routes auto loaded
readdirSync('./routes').map((r) => app.use( '/api', require('./routes/' + r )));



// Port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`🌍 Now listening on localhost:${port}`));