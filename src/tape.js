var reduce = require('lodash.reduce');
var extend = require('lodash.assign');
var find = require('lodash.find');
var getTypeFromSource = require('./utils/get-type-from-source');
var getContext = require('./utils/get-context');
var canPlay = require('./utils/can-play');
var EE = require('events').EventEmitter;
var inherits = require('inherits');
var tapeManager = require('./tape-manager');

var context = getContext();

function Tape(sources) {
  EE.apply(this);
  this.sources = sources = typeof sources === "string" ? [sources] : sources;
  tapeManager.add(this);
}
inherits(Tape, EE);
extend(Tape.prototype, {
  getSource: function() {
    return this._source;
  }
});


// streaming tape
var domready = require('domready');
var audioContainer;
function getAudioContainer() {
  if (!audioContainer) {
    audioContainer = document.createElement('div');
    var s = audioContainer.style;
    s.position = 'fixed';
    s.left = "-9999px";
    s.top = "0";
    audioContainer.id = "kwantegy-container";
    document.body.appendChild(audioContainer);
  }
  return audioContainer;
}
function StreamingTape() {
  Tape.apply(this, arguments);

  var self = this;

  var elm = new Audio();
  elm.setAttribute('preload','none');
  this._el = reduce(this.sources, function(audioElm, source) {
    var srcElm = document.createElement('source');
    srcElm.setAttribute("src", source);
    srcElm.setAttribute("type", getTypeFromSource(source));
    audioElm.appendChild(srcElm);
    return audioElm;
  }, elm);

  this._el.addEventListener('canplaythrough', function() {
    self._source = context.createMediaElementSource(self._el);
    self.emit('ready', self._source);
  });

  domready(function() {
    getAudioContainer().appendChild(self.getEl());
  });

}
inherits(StreamingTape, Tape);

extend(StreamingTape.prototype, {
  getEl: function() {
    return this._el;
  },
  load: function() {
    this.getEl().setAttribute('preload','auto');
  },
  feed: function(cb) {
    var self = this;
    cb(this.getSource(), function(time) {
      self.getEl().play();
    });
  }
});



// buffered tape
function BufferedTape() {
  Tape.apply(this, arguments);
}
inherits(BufferedTape, Tape);

extend(BufferedTape.prototype, {
  load: function() {
    if (this.getSource()) return true;
    var self = this;
    var playableUrl = find(this.sources, canPlay);
    var request = new XMLHttpRequest();
    request.open('GET', playableUrl, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        if (!buffer) throw new Error("Could not decode " + playableUrl);
        self._buffer = buffer;
        self.emit('ready');
      })
    };
    request.send();
  },
  feed: function(cb) {
    var self = this;
    if (this._source) this._source.stop();
    var node = this._source = context.createBufferSource();
    node.buffer = this._buffer;
    cb(node, function(i) {
      node.start(i || 0);
    });
  }
});

module.exports = function(sources, opts) {
  if (opts && opts.stream === false) {
    return new BufferedTape(sources);
  } else {
    return new StreamingTape(sources);
  }
}