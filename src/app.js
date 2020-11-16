const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const router = require('./routes/router');
const chatRouter = require('./routes/chatRouter');
const myReqLogger = require('./loggers/requestLogger')

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(myReqLogger);
app.use('/', router);
app.use('/friend', chatRouter);


const port = 3000;
app.listen(port, ()=>{
    console.log(`App started at port ${port}!`)
});