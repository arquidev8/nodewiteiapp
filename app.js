const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

// Especificar el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/propiedades', (req, res) => {
  const url = 'https://witei.com/api/v1/houses/';
  const headers = {'Authorization': 'Bearer 7a54f9633cf443d988c0c49e2b77989b'};

  request({url, headers}, (error, response, body) => {
    if (error) {
      res.status(500).send('Error interno del servidor');
    } else {
      const data = JSON.parse(body);
      res.render('propiedades', {propiedades: data.results});
    }
  });
});

app.get('/propiedad/:prop_id', (req, res) => {
  const prop_id = req.params.prop_id;
  const url = `https://witei.com/api/v1/houses/?identifier=${prop_id}`;
  const headers = {'Authorization': 'Bearer 7a54f9633cf443d988c0c49e2b77989b'};

  request({url, headers}, (error, response, body) => {
    if (error) {
      res.status(500).send('Error interno del servidor');
    } else {
      const data = JSON.parse(body);
      if (data.count > 0 && data.results[0].identifier === prop_id) {
        res.render('propiedad_detalle', {detalle: data.results[0]});
      } else {
        res.status(404).send('Propiedad no encontrada o no disponible');
      }
    }
  });
});

module.exports = app;