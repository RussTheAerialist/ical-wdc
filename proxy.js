var cors = require('cors-anywhere');

var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 8080;

var server = cors.createServer({
  originWhitelist: [],
  removeHeaders: ['cookie', 'cookie2'],
  helpFile: 'index.html',
  httpProxyOptions: {
    "secure": false // Needed because internally we use a self-signed cert for SSL and don't install the root cert on people's machines
  }
});
server.listen(port, host, function() {
  console.log('CORS Proxy on ' + host + ':' + port);
});
server.on('proxyReq', function() {
  console.dir(arguments);
});
