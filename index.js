/**
 * Serverless Helpers JS
 */

var ServerlessHelpers = {

  // Load Environment Variables
  loadEnv: function() {
    require('./env');
  },
  
  // Retrieve CF output variables
  // For now has to be called AFTER loadEnv() as we need
  // the SERVERLESS variables to compose the CF stack name.
  CF: require('./CF'),

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
