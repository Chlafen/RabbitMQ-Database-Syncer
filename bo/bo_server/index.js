const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index.js');
const app = express();
const PORT = process.argv[2].split('=')[1] || 3000;

app.use(cors({
  origin: '*'
})); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/products',  indexRouter);

// make the built react app available
app.use(express.static(__dirname + '/bo_client/build'));

app.use('/', (req, res) => {
  // send the built react app
  res.sendFile(__dirname + '/bo_client/build/index.html');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // set an interval to send a sync request every 5 seconds
});