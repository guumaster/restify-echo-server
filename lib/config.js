module.exports = {
  name: 'restify-echo',
  port: process.env.PORT || 3000,
  bunyan: {
    name: 'restify-echo',
    stream: process.stdout,
    level: 'debug'
  },
  ngrok: {
    enabled: false,
    authtoken: '', // '<your-ngrok-authtoken>',
    subdomain: ''  // '<your-ngrok-subdomain>'
  }
};
