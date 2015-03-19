var custom_name = 'my-echo-server';

module.exports = {
  name: custom_name,
  port: 5000,
  bunyan: {
    name: custom_name,
    stream: process.stdout,
    level: 'info'
  },
  ngrok: {
    enabled: false,
    authtoken: '<your-ngrok-authtoken>',
    subdomain: custom_name
  }
};
