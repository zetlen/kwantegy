var tapes = [];
module.exports = {
  get: function() {
    return tapes;
  },
  add: function(tape) {
    tapes.push(tape);
  },
  remove: function(tape) {
    tapes.splice(tapes.indexOf(tape), 1);
  }
}