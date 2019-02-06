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
const convertEuroToPeso = (fromMount) => fromMount * 42;
const convertPesoToDolar = (fromMount) => fromMount / 38.45;
const convertEuroToDolar = (fromMount) => fromMount * 1.14;
const convertDolarToEuro = (fromMount) => fromMount / 1.14;

const chooseStrategy = (fromCurrency, toCurrency) => {
  let strategy;

  if(fromCurrency === 'dolares' && toCurrency === 'pesos') strategy = convertDolarToPeso;
  if(fromCurrency === 'euros' && toCurrency === 'pesos') strategy = convertEuroToPeso;
  else if(fromCurrency === 'pesos' && toCurrency === 'dolares') strategy = convertPesoToDolar;
  else if(fromCurrency === 'euros' && toCurrency === 'dolares') strategy = convertEuroToDolar;
  else if(fromCurrency === 'dolares' && toCurrency === 'euros') strategy = convertDolarToEuro;

  return strategy;
};

// Métodos de ruta (VERBOS HTTP: POST, GET, PUT, DELETE, etc...). Endpoint
app.post("/convert", (req, res) => {
 const fromCurrency = req.body.queryResult.parameters["fromCurrency"];
 const toCurrency = req.body.queryResult.parameters["toCurrency"];
 const mount = req.body.queryResult.parameters["mount"];

 const strategy = chooseStrategy(fromCurrency, toCurrency);
 const converted = strategy(mount);

 // Formamos la respuesta que enviaremos a Dialogflow
  const response = {};

  // DEFAULT RESPONSE EN DIALOGFLOW
  response.fulfillmentText = `Es el equivalente a ${converted} ${toCurrency}`;
  response.fulfillmentMessages = [{
    "text": {
      "text": [response.fulfillmentText]
    }
  }];
  response.source = "webhook";

  // Enviamos la respuesta
  res.status(200).send(response);
});

// Escuchando nuestro servidor Node
app.listen(port, () => {
    console.log(`API REST en el puerto: http://localhost:${port}`);
});

