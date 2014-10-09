/*
 * 
 * user/repo
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */
'use strict';

var socketio = require('socket.io');
var uuid = require('node-uuid');

var coordinator = {};

coordinator.start = function (app) {
    var io = socketio(app);

    var room;

    io.on('connection', function (socket) {
        socket.on('start', function(cb){
            room =  uuid.v4();

            // joining
            socket.join(room);
            cb(null, room);
        });

        socket.on('join', function(id, cb){
            if(!io.sockets.adapter.rooms.hasOwnProperty(id)){
                return cb('noTokenServerFound');
            }

            socket.join(id);
            cb();
        });

        socket.on('cmd', function (data) {
            socket.to(room).broadcast.emit('cmd', data);
        });
    });
};

module.exports = coordinator;
