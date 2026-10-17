const express = require ('express');
const { PORT } = require('.');

const app = express();

app.use(express.static,('public'));
app.use(express.json, );

app.get('/', (req, res)=>{
    res.send('resultt');
})

app.listen(PORT, (req, res)=>{
    console.log(`app is listening on port ${PORT}`)
});