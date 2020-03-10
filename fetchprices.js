const fetch = require('node-fetch');
global.Headers = fetch.Headers;

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer <bearer-token>");
myHeaders.append("Content-Type", "application/json");

var graphql = JSON.stringify({
  query: "query products($locale: Locale!, $currency: Currency!, $skus: [String!], $sort: [String!]) {\n  products(limit: 20, skus: $skus, sort: $sort) {\n    results {\n      id\n      masterData {\n        current {\n          name(locale: $locale)\n          slug(locale: $locale)\n          allVariants(skus: $skus) {\n            sku\n            images {\n              url\n            }\n            price(currency: $currency) {\n              discounted {\n                value {\n                  ...ProductListPriceInfo\n                }\n              }\n              value {\n                ...ProductListPriceInfo\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment ProductListPriceInfo on BaseMoney {\n  centAmount\n  fractionDigits\n}",
  variables: {"skus":"eqwrsnbd","locale":"en","currency":"USD"}
})
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: graphql,
  redirect: 'follow'
};

fetch("https://api.commercetools.co/support-weretail-demo/graphql", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
