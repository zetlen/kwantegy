var extend = require('lodash.assign');
var makeTape = require('./tape');
var reduce = require('lodash.reduce');
var addSourceElement = require('./utils/add-source-element');
var getContext = require('./utils/get-context');
var domready = require('domready');
var getAudioContainer = require('./utils/get-audio-container');

var KRecorder = function() {}
extend(KRecorder.prototype, {
  record: function(sources, opts, cb) {
    var elm = reduce(sources, addSourceElement, new Audio());
    elm.addEventListener('canplaythrough', function() {
      domready(function() {
        getAudioContainer().appendChild(elm);
        cb(makeTape(getContext().createMediaElementSource(elm)));
      });
    }); 
  }
})


module.exports = function() {
  return new KRecorder()
}