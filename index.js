'use strict';

var breach = require('breach_module');
var common = require('./lib/common.js');
var http = require('http')
var async = require('async');
var express = require('express');

common._ = {
  vim_handler: require('./lib/vim_handler.js').vim_handler({})
}

var bootstrap = function(http_srv) {
  var http_port = http_srv.address().port;
  breach.init(function() {
    breach.register('core', 'inst:.*');
    breach.register('core', 'tabs:keyboard');
    breach.register('core', 'controls:keyboard');

    breach.expose('init', function(src, args, cb_) {
      console.log('Vimmode Init');
      breach.module('core').call('controls_set', {
        type: 'TOP',
        url: 'http://127.0.0.1:' + http_port + '/inputline',
        dimension: 200,
      }, cb_);
      async.parallel([
        common._.vim_handler.init
        ], cb_);
    });

    breach.expose('kill', function(args, cb_) {
      console.log('Vimmode Exit');
      breach.module('core').call('controls_unset', {
        type: 'BOTTOM',
      }, cb_);
      async.parallel([
        common._.vim_handler.kill
        ], function(err) {
          common.exit(0);
        });
    });
  });
};

(function setup() {
  var app = express();

  var args = process.argv;
  args.forEach(function(a) {
    if(a === '--debug') {
      common.DEBUG = true;
    }
  });

  /* App Configuration */
  app.use('/', express.static(__dirname + '/controls'));
  app.use(require('body-parser')());
  app.use(require('method-override')());

  /* Listen locally only */
  var http_srv = http.createServer(app).listen(0, '127.0.0.1');

  http_srv.on('listening', function() {
    var port = http_srv.address().port;
    console.log('HTTP Server started on `http://127.0.0.1:' + port + '`');
    return bootstrap(http_srv);
  });
})();

process.on('uncaughtException', function(err) {
  common.fatal(err);
});
