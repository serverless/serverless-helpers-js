'use strict';
/**
 * Retrieve CloudFormation information within a lambda.
 */

var async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Promise = require('bluebird'),
    AWS = require('aws-sdk');

var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

var CF = {
};

/**
 * Load CF output variables into environment
 */
CF.loadVars = async (function() {
  // Build CF stack name
  if (!process.env.SERVERLESS_PROJECT || !process.env.SERVERLESS_STAGE) {
    throw new Error("Serverless environment not set");
  }
  stackName = process.env.SERVERLESS_PROJECT + "-" + process.env.SERVERLESS_STAGE + "-r";

  return await (CF.describeCFStack(stackName)
                  .then(function(stackDescription) {
                    if (!stackDescription.hasOwnProperty('Outputs') || stackDescription.Outputs.constructor !== Array) {
                      return Promise.reject(new Error("No outputs in stack description"));
                    }

                    return Promise.each(stackDescription.Outputs, function (outVar) {
                      process.env["SERVERLESS_CF_" + outVar.OutputKey] = outVar.OutputValue;
                      return null;
                    });
                  })
                  .catch(function (err) {
                    console.log("WARN: Error retrieving CF variables");
                  }));
});

/**
 * Get the CF stack description
 */
CF._describeCFStack = Promise.method(function(stackName) {
  cloudformation.describeStacks({ StackName: stackname }, function(err, data) {
    if (err) {
      throw err;
    }
    if (!data.Stacks || data.Stacks.constructor !== Array || data.Stacks.length === 0) {
      throw new Error("invalid response", data);
    }
    // Return only the stack description
    return data.Stacks[0];
  })
});

module.exports = CF;