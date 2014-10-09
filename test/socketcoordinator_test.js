/*global describe,it,before*/
'use strict';
var socketcoordinator = require('../lib/socketcoordinator.js');
var client = require('socket.io-client');
var chai = require('chai');
var async = require('async');

var app = require('http').createServer();

var address = "http://localhost:3000";

chai.should();
var expect = chai.expect;

describe('socketcoordinator test', function() {
    before(function(done){
        socketcoordinator.start(app);

        app.listen(3000);
        done();
    });

    function getConnection(){
        return client(address, {'forceNew':true });
    }

    function getConnectedPair(cb){
        var io1 = getConnection();
        var io2 = getConnection();

        var roomID;

        async.series([
            function(acb){
                async.parallel([
                    function(pcb){
                        io1.on('connect', function() {
                            pcb();
                        });
                    },
                    function(pcb){
                        io2.on('connect', function() {
                            pcb();
                        });
                    }
                ], acb);
            },
            function(acb){
                io1.emit('start', function(err, id){
                    expect(err).to.not.exist;
                    id.should.exist;

                    roomID = id;

                    acb();
                });
            },
            function(acb){
                io2.emit('join', roomID, function(err){
                    expect(err).to.not.exist;
                    acb();
                });
            }
        ], function(err){
            expect(err).to.not.exist;

            cb(io1, io2);
        });
    }

    it('fail -- room not created yet', function(done) {
        var io1 = getConnection();

        io1.on('connect', function(){
            io1.emit('join', '1234', function(err){
                err.should.equal('noTokenServerFound');
                done();
            });
        });
    });

    it('start and connect', function(done) {
        getConnectedPair(function(){
            done();
        });
    });

    it('data transmission', function(done) {
        getConnectedPair(function(c1, c2){
            c2.on('cmd', function(data){
                data.should.equal('1');
                done();
            });

            c1.emit('cmd', '1');
        });
    });
});
