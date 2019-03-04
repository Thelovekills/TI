const express = require('express');
const session = require('cookie-session');
const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');
const archivos = require('fs');

// Initializacion del express
const app = express();

// configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'vistas'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var db = {
    //Indicar BD o abrir conexion
    initDB: function () {
        var fs = require("fs");
        var contents = fs.readFileSync("./usuarios.json");
        this.alumnos = JSON.parse(contents);
        db.saveUsuario();
    },

    saveUsuario : function(){
        archivos.writeFileSync('usuarios.json', JSON.stringify(this.alumnos),
          function (error) {
              if (error) {
                  console.log('Hubo un error al escribir en el archivo')
                  console.log(error);
              }
          });
    }
    
    
}

app.use(morgan('dev'));
app.use(session({
  secret: 'mysecretword',
  signed: true
}));

// Variables globales
app.use((req, res, next) => {
  res.locals.formatDate = (date) => {
    let myDate = new Date(date * 1000);
    return myDate.toLocaleString();
  }

  if(req.session.access_token && req.session.access_token != 'undefined') {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
});

// Routes
app.use(require('./routes/index'));


app.use(express.static(path.join(__dirname, 'public')));






// Starting the Server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});