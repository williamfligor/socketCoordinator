#  [![Build Status](https://travis-ci.org/williamfligor/socketCoordinator.svg?branch=master)](https://travis-ci.org/williamfligor/socketCoordinator)

> A module to use socket.io to connect a device meant to be controlled to a controller.


## Getting Started

Install the module with: `npm install socketcoordinator`

```js
var socketcoordinator = require('socketcoordinator');
```

Install with cli command

```sh
$ npm install -g socketcoordinator
```

## Documentation

It is expected that the device being controlled can give the user an access token, given to the device when connecting to the server. This token will be inputted on the controlling device which will link the two together.

## Examples

Server
```js
var app = require('http').createServer();

var socketcoordinator = require('socketcoordinator').start(app);

app.listen(3000);
```

Device Client

```js

var client = require('socket.io-client')('http://localhost:3000');

// use create if you have the ability to display the ID to the user
// To use a hard coded ID (ie one that is printed on the device)
// use .emit('start', hardCodedID, function()
client.emit('create', function(err, id){
    if(err) throw err;

    console.log(id);
});

client.on('cmd', function(command){
    // handle command from server
    console.log(command);
});

// Send data ever second to controlling device
setInterval(function(){
    socket.emit('cmd', 10);
}, 1000);
```

Controlling Client

```js

var client = require('socket.io-client')('http://localhost:3000');

var token = '1234'; // Token shown by device

// err can equal noTokenServerFound
// Meaning that a device with that token is not connected to the server
client.emit('join', function(err){
    if(err) throw err;

    client.on('cmd', function(command){
        // handle command from server
        console.log(command);
    });

    // Send cmd ever second to device
    setInterval(function(){
        socket.emit('cmd', {move: 10});
    }, 1000);
});
```
## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014
Licensed under the MIT license.
