const connectToMongo = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.Port || 5000;


//Middlewares
app.use(cors()); 
app.use(express.json()); 

//Routes
app.use('/api/user',require('./routes/userPage'));
app.use('/api/macros',require('./routes/macroPage'));

//Start server and Handle errors
try {
  app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`)
  })
} catch (error) {
  console.error(`Error occured: ${error.message}.`);
  process.exit(1);
}

//Connect to MongoDB
try {
  connectToMongo(); 
} catch (error) {
  console.error(`Error occured: ${error.message}.`);
  process.exit(1);
}