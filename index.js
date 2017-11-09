const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h2>Hello, Express</h2>')
});

app.listen(3000, () => {
    console.log('The server has started!');
});