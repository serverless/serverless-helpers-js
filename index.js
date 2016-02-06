/**
 * Serverless Helpers JS
 */

var ServerlessHelpers = {

  // Load Environment Variables
  loadEnv: function() {
    require('./env');
  },

  // Shim interacting with Lambda to a callback call
  shimCallback: function(method) {
    return function (event, context) {
      method(event, function (err, val) {
        return context.done(err, val);
      });
    }
  }

};

// Export
module.exports = ServerlessHelpers;
