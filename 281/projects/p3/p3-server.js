const express = require('express')
const { coinCombo, coinValue } = require('./p3-module')
const app = express()
app.use(express.static('public'))

module.exports = {
    coinCombo, 
    coinValue
}

app.get('/coincombo', (req, res) => {
    const amount = parseInt(req.query.amount)
    if (isNaN(amount) || amount < 0){
        return res.status(400).json({error: 'invalid amount'})
    }
    const result = coinCombo(amount)
    res.json(result)
});

app.get('/coinvalue', (req, res) => {
    const coinCount = {
        pennies: parseInt(req.query.pennies) || 0,
        nickels: parseInt(req.query.pennies) || 0,
        dimes: parseInt(req.query.pennies) || 0,
        quarters: parseInt(req.query.pennies) || 0,
        halves: parseInt(req.query.pennies) || 0,
        dollars: parseInt(req.query.pennies) || 0
    }
    const result = coinValue(coinCount)
    res.json(result)
});

app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

const listenIP = 'localhost';
const listenPort = 8080;

app.listen(listenPort, listenIP, () =>{
    console.log(`Server is running on http://${listenIP}:${listenPort}`)
})
