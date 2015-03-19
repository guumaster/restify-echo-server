# restify-echo

A simple echo server made with restify to serve every url you request. It catches all urls and sends back headers, body and metadata in JSON format. It allows you to change response `statusCode` and delay response with querystring parameters.

It has a simple [ngrok tunnels](https://ngrok.com) support built-in.

## Installation

```
        [sudo] npm install [-g] restify-echo
```

## Usage

```      
        Usage: 
        restify-echo [OPTIONS]
        
        Options:
          -c, --config     config file
          -n, --name       server name
          -p, --port       port to listen
          --ng, --ngrok    start an ngrok tunnel
          -s, --subdomain  ngrok subdomain (only if you provide a token)
          -t, --token      ngrok auth token
          -h, --help       Show help
        
        Examples:
          restify-echo -p 4000    starts the server in port 3000
          restify-echo --ngrok    starts a server with a tunnel available to everyone through internet
                                  
        
```

Once you've started the server. Send requests to `http://localhost:3000/any/path/you/like?with=any&parameter=imaginable` with the client you prefer a browser, curl, [Postman](http://www.getpostman.com/) or [httpie](http://httpie.org/). You can make `GET|POST|PUT|DELETE` request.  


### Querystring parameters

* `statusCode` header status code to set in the response.
* `delay` amount of milliseconds to delay the response.
* `throw` type of restify error to throw. (ex: BadRequest, InternalError, etc)
* `msg` when `throw` parameter is present, the error message to use.
* `json` send the response body you want to receive in the response.
* `meta` boolean to get a full response or only the body payload. Defaults to `true`.

### Global vs Local install

If you install it as a local dependency start the command like this: 

```
$> ./node_modules/.bin/restify-echo 
```

### Ngrok support

If you use `ngrok` options it would also start a server on port 4040 where you can inspect all request made through the public url. By default `ngrok` will give you a random subdomain name, you can only change it if you signup and get an `authtoken` (free).

### Config file

You can use a custom config file to setup your echo server. Check the `config_example.js` included or create one like this: 

```
// my_config.js file
        
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

```
And use it on execution:

```
$>  restify-echo -c my_config.js


## TODO

* Allow also a secure server
* throw in some tests
