const express =  require("express");
const bodyParser = require("body-parser");
var app = express();

const archivos = require('fs');


//DB Handler
var db = {
    //Indicar BD o abrir conexion
    initDB: function () {
        var fs = require("fs");
        var contents = fs.readFileSync("./cryptos.json");
        this.cryptos = JSON.parse(contents);
    },

    //Busqueda de Cryptomonedas
    getCryptoBy: function (filter, value) {
        console.log("filtro: " + filter + "valor: " + value);
        var selected = null;
        this.cryptos.forEach(crypto => {
            console.log(crypto);
            console.log(crypto[filter]);
            if (crypto[filter] == value) {
                selected = crypto;
                return selected;
            }
        });
        return selected;
    },

    saveCryptos : function(){
      archivos.writeFileSync('cryptos.json', JSON.stringify(this.cryptos),
        function (error) {
            if (error) {
                console.log('Hubo un error al escribir en el archivo')
                console.log(error);
            }
        });
    }
    
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("index.html" );
});

app.get('/cryptos', (req, res) => {
  db.initDB();
  res.json(db.cryptos);
});

app.get('/cyptos/:cantidad', (req, res) => {
  db.initDB();
  var cantidad = req.params.cantidad;
  var crypto = db.getCryptoBy('cantidad', cantidad);
  res.json(crypto);
});

app.post('/cryptos',function(req,res){
  db.initDB();
  var crypto = req.body;
  console.log("Objeto post recibido");
  console.log(crypto);
  db.cryptos.push(crypto);
  db.saveCryptos();
  res.json({'status' : 'OK'});
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})