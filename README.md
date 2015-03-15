# restify-echo

A simple echo server made with restify to serve every url you request. It catches all urls and sends back headers, body and metadata in JSON format. It allows you to change response `statusCode` and delay response with querystring parameters.

## Installation

```
        [sudo] npm install [-g] restify-echo
```

## Start the server

### If globally installed

Just exec the command:

```
        restify-echo 
```

### Local dependency

```
        ./node_modules/.bin/restify-echo  
```

### Different port

You can change the port with `PORT` env variable.

```
        PORT=4001 ./node_modules/.bin/restify-echo  
```

## Usage

Once you've started the server. Send requests to `http://localhost:3000/any/path/you/like?with=any&parameter=imaginable` with the client you prefer a browser, curl, [Postman](http://www.getpostman.com/) or [httpie](http://httpie.org/). You can make `GET|POST|PUT|DELETE` request.  


### Querystring parameters

* `statusCode` header status code to set in the response.
* `delay` amount of milliseconds to delay the response.
* `throw` type of restify error to throw. (ex: BadRequest, InternalError, etc)
* `msg` when `throw` parameter is present, the error message to use.


## TODO

* Bind to a single hostname
* Change parameters with CLI args instead of env
* Allow also a secure server
* throw in some tests

