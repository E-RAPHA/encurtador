//app.js

const os = require('os')

const redisClient = require('./redis');
const mongodb = require("./mongodb")
const Link = require('./models/linkModel.js')
const express = require('express');





const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.json());




app.get("/", (req, res) => {


  res.render(`home`, { servidorUsado: os.hostname() });


})


const redireciona = require('./controllers/redireciona');

app.get("/:urlpequena", redireciona)



const linkADM  = require("./controllers/linkADM.js")
app.get("/:urlpequena/:linkAdm", linkADM )








const crialink = require("./controllers/criaLink");

app.post("/", crialink)


app.listen(5000, function () {
  console.log('rodando na  5000, http://localhost');
});












