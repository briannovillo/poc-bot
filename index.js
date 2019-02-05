// Libreria express para crear un api rest
const express = require("express");
const bodyParser = require("body-parser");

// Para hacer peticiones http de forma simple
const request = require('request');

// Para usar express dentro de Node
const app = express();

// Definimos el puerto
const port = process.env.PORT || 8899;

// Middleware de análisis del cuerpo de Node.js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const convertDolarToPeso = (fromMount) => fromMount * 38.45;
const convertPesoToDolar = (fromMount) => fromMount / 38.45;

const chooseStrategy = (fromCurrency) => new Map([
  ['dolares', convertDolarToPeso],
  ['pesos', convertPesoToDolar]
]).get(fromCurrency);

// Métodos de ruta (VERBOS HTTP: POST, GET, PUT, DELETE, etc...). Endpoint
app.post("/convert", (req, res) => {
 const fromCurrency = req.body.queryResult.parameters["fromCurrency"];
 const toCurrency = req.body.queryResult.parameters["toCurrency"];
 const fromMount = req.body.queryResult.parameters["fromMount"];
 const toMount = req.body.queryResult.parameters["toMount"];

 const strategy = chooseStrategy(fromCurrency);
 const converted = strategy(fromMount, toMount);

 // Formamos la respuesta que enviaremos a Dialogflow
  const _response = new Object();

  // DEFAULT RESPONSE EN DIALOGFLOW
  _response.fulfillmentText = `Es el equivalente a ${converted}`;
  _response.fulfillmentMessages = [{
    "text": {
      "text": [_response.fulfillmentText]
    }
  }];
  _response.source = "webhook";

  // Enviamos la respuesta
  res.status(200).send(_response);
});

// Escuchando nuestro servidor Node
app.listen(port, () => {
    console.log(`API REST en el puerto: http://localhost:${port}`);
});

