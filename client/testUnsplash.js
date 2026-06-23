const https = require('https');

https.get('https://source.unsplash.com/1200x800/?France,travel', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Location:', res.headers.location);
}).on('error', (e) => {
  console.error(e);
});
