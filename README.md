Serverless Helpers (Node.js Version)
=================================
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

# Currently unmaintained

At the moment this library is unmaintained, we're going to take another look at it after we've release V1 of the Framework to evaluate how we should support it in the future.

###Features
* Helps your modules locate and load Stage Variables that the Serverless framework adds on deployment.
* Allows access to the CF Output variables that you defined in the `s-resources-cf.json` file.

## CF Output variables
To have your lambda access the CF output variables you have to give it the `cloudformation:describeStacks` access rights in the lambda IAM role.

The CF.loadVars() promise will add all CF output variables to the process'
environment as *SERVERLESS_CF_`OutVar name`*. It will add a few ms to the
startup time of your lambda.

Change your lambda handler as follows:

```
// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js');
ServerlessHelpers.loadEnv();

// Require Logic
var lib = require('../lib');

// Lambda Handler
module.exports.handler = function(event, context) {
  ServerlessHelpers.CF.loadVars()
  .then(function() {
    lib.respond(event, function(error, response) {
      return context.done(error, response);
    });
  })
  .catch(function(err) {
    return context.done(err, null);
  });
};
```

