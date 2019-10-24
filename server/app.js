const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts.route');
const userRoutes = require('./routes/user.route');

const app = express();
const user = "daniel";
const pass = "gCoxMZnlK3h7DdS8";
const bd = "node-angular";
const uri = `mongodb+srv://${user}:${pass}@cluster0-dtrgs.mongodb.net/${bd}`;
const ruta = '/home/acnologia/Documentos/Web/ANGULAR/AngularUdemy/mean/server/images';
mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log('Conectado...');
  })
  .catch((e) => {
    console.log(`Conection failed: ${e}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(ruta)));// damos accesos a las solicitudes que requieran imagenes a la carpeta imagenes

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATHC, DELETE, OPTIONS");
  next();
});

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

module.exports = app;

/*app.use((req, res, next) => {
  console.log('first middleware');
  next();
});*/

// ?retryWrites=true&w=majority