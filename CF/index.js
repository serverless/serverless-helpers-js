'use strict';
/**
 * Retrieve CloudFormation information within a lambda.
 */

var BbPromise = require('bluebird'),
    AWS = require('aws-sdk');

var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15', region: process.env.SERVERLESS_REGION });

var CF = {
};

/**
 * Load CF output variables into environment
 */
CF.loadVars = function () {
  // Build CF stack name
  if ((!process.env.SERVERLESS_PROJECT_NAME || !process.env.SERVERLESS_STAGE || !process.env.SERVERLESS_REGION)) {
    return BbPromise.reject(new Error("Serverless environment not set"));
  }

  var stackName = process.env.SERVERLESS_PROJECT_NAME + "-" + process.env.SERVERLESS_STAGE + "-r";
  return CF._describeCFStack(stackName)
    .then(function(stackDescription) {
      if (!stackDescription.hasOwnProperty('Outputs') || stackDescription.Outputs.constructor !== Array) {
        return BbPromise.reject(new Error("No outputs in stack description"));
      }

      return BbPromise.each(stackDescription.Outputs, function (outVar) {
        process.env["SERVERLESS_CF_" + outVar.OutputKey] = outVar.OutputValue;
        return null;
      });
    })
    .catch(function (err) {
      console.log("WARN: Error retrieving CF variables");
      return BbPromise.reject(err);
    });
};

/**
 * Get the CF stack description
 */
CF._describeCFStack = function(stackName) {
  return new BbPromise(function(resolve,reject) {
    cloudformation.describeStacks({ StackName: stackName }, function(err, data) {
      if (err) {
        return reject(err);
      }
      
      if (!data || !data.Stacks || data.Stacks.constructor !== Array || data.Stacks.length === 0) {
        return reject(new Error("invalid response", data));
      }
      
      // Return only the stack description
      return resolve(data.Stacks[0]);
    });
  });
};

module.exports = CF;