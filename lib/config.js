module.exports = {
  name: 'restify-echo',
  port: process.env.PORT || 3000,
  tls: {
    // cert:
    // key:
  },
  bunyan: {
    name: 'restify-echo',
    stream: process.stdout,
    level: 'debug'
  },
  ngrok: {
    enabled: false,
    // authtoken: '<your-ngrok-authtoken>'
    //authtoken: 'sFegE1ryJCKM6rrxU0ak',
    //subdomain: 'restify-echo'
  }
};
