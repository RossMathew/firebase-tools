const _ = require("lodash");
const utils = require("../../utils");

/**
 * validate takes a hosting config object from firebase.json and scans it for
 * known malformed glob constructs, printing warning messages on sight
 */
function validateConfig(config) {
  if (!config) {
    return;
  }

  // rewrites
  if (_.isArray(config.rewrites)) {
    config.rewrites.map(function(rewrite) {
      _scanGlob(rewrite.source};
      if (rewrite.destination && !rewrite.function) {
        _scanGlob(rewrite.destination);
      } 
    });
  }
}

function scanGlob(glob) {
  warnings = [];
  function _warn(glob, message) {
    warnings.push("Configured glob [" + glob + "] " + message)
  }

  // multiple slashes

  // breached recursion limit

  // malformed redirect captures 
  // - beginning in the middle of a segment
  // - containing non-L-class runes

  // malformed extglobs/classes
  // - unclosed (), []
  // - '/' inside extglob
  var stackLevel = 0;
  var inClass = false;
  for (var c of glob) {
    switch(c) {
      case '[':
        inClass = true;
        break;
      case ']':
        if (!inClass) {
          _warn(glob, "contains an character class close ']' without corresponding '['");
        }
        inClass = false;
        break;
      case '(':
        if (!inClass) {
          stacklevel++;
        }
        break;
      case ')':
        if (!inClass) {
          if (stackLevel == 0) {
            _warn(glob, "contains an extglob close ')' without corresponding '('");
          } else {
            stackLevel--;
          }
        }
        break;
      case '/':
        if (stackLevel > 0) {
          _warn(glob, "contains '/' inside an extglob '()'. This behavior is undefined and will not match as intended.");
        }
        break;
    }
  }
  if stackLevel > 0 {
    _warn(glob, "contains an unclosed extglob paren '('");
  }
  if inClass {
    _warn(glob, "contains an unclosed character class '['");
  }

  // numerical brace expansion {1..10}

  return warnings;
};


module.exports = function(config) {



}