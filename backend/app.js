const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

const LeaderboardRouter = require('./routes/leaderRoute');

var corsOptions = {
        origin: 'localhost', // 'http://3.80.99.11'
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());

app.use(cors(corsOptions));

app.use('/soduku' ,LeaderboardRouter);

app.listen(PORT, () => {
        console.log(`Chat backend listening on port ${PORT}`)
        });




