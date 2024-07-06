const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

let userData = {
    clicks: 0,
    earnings: 0.00,
    bonusMultiplier: 1
};

app.get('/data', (req, res) => {
    res.json(userData);
});

app.post('/data', (req, res) => {
    const { clicks, earnings, bonusMultiplier } = req.body;
    userData.clicks = clicks;
    userData.earnings = earnings;
    userData.bonusMultiplier = bonusMultiplier;
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
