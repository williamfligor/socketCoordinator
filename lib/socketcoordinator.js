/*
 * 
 * user/repo
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */
'use strict';

var socketio = require('socket.io');

var token = require('./token');

var coordinator = {};


/**
 * Start the server
 * @param app - HTTP like - var app = require('http').createServer();
 */
coordinator.start = function (app) {
    var io = socketio(app);

    io.on('connection', function (socket) {
        var room;

        // Create a room generating a room id
        socket.on('create', function(cb){
            token.getToken(function(tk){
                room = tk;
                // joining
                socket.join(room);
                cb(null, room);
            });
        });

        // Start a room with a hard coded id (in the client)
        socket.on('start', function(id, cb){
            socket.join(id);
            room = id;
            cb();
        });

        // Join an already created room
        socket.on('join', function(id, cb){
            if(!io.sockets.adapter.rooms.hasOwnProperty(id)){
                return cb('noTokenServerFound');
            }

            socket.join(id);

            room = id;
            cb();
        });

        socket.on('message', function (data) {
            socket.to(room).broadcast.emit('message', data);
        });
    });
};

module.exports = coordinator;