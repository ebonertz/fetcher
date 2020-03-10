const fetch = require('node-fetch');
global.Headers = fetch.Headers;

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer <bearer-token>");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.commercetools.co/support-weretail-demo/channels/1565bad8-cc12-4bdb-a17a-949bfa64e543", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
