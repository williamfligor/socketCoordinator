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

coordinator.start = function (app) {
    var io = socketio(app);

    io.on('connection', function (socket) {
        var room;

        socket.on('create', function(cb){
            token.getToken(function(tk){
                room = tk;
                // joining
                socket.join(room);
                cb(null, room);
            });
        });

        socket.on('start', function(id, cb){
            socket.join(id);
            room = id;
            cb();
        });

        socket.on('join', function(id, cb){
            if(!io.sockets.adapter.rooms.hasOwnProperty(id)){
                return cb('noTokenServerFound');
            }

            socket.join(id);

            room = id;
            cb();
        });

        socket.on('cmd', function (data) {
            socket.to(room).broadcast.emit('cmd', data);
        });
    });
};

module.exports = coordinator;
