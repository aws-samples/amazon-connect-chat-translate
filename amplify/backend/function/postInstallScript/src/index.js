var aws = require("aws-sdk");
var translate = new aws.Translate();

exports.handler = async function(event, context, callback) {
    console.log("CDEBUG ==> Request Received:\n" + JSON.stringify(event)); 

    var responseStatus;
    var responseData = {};
    if (event.RequestType == "Create") {
        
        var customTerminology = [
        '"en","es","de"',
        '"Sunshine and Oranges","Sunshine y Oranges","Sunshine und Oranges"'
         ].join('\n');
        
        var createTerminologyParams = {
          MergeStrategy: 'OVERWRITE', 
          Name: 'connectChatTranslate', 
          TerminologyData: { 
            File: Buffer.from(customTerminology) || 'STRING_VALUE',
            Format: 'CSV' 
          },
          Description: 'Custom Terminology for Amazon Connect Chat sample web app',
        };
        
        responseStatus = "SUCCESS";
        var createTerminologyRequest = await translate.importTerminology(createTerminologyParams).promise();
        responseData = {"REQUEST": "createTerminologyRequest"};
        console.log("EVENT TYPE CREATE", createTerminologyRequest);
        return await sendResponse(event, context, responseStatus, responseData);
    }
    if (event.RequestType == "Update") {
        responseStatus = "SUCCESS";
        responseData = {"REQUEST": "nothing"};
        console.log("EVENT TYPE UPDATE");
        return await sendResponse(event, context, responseStatus, responseData);
    }
    if (event.RequestType == "Delete") {
        
        var deleteTerminologyParams = {
          Name: 'connectChatTranslate' 
        };
        var deleteTerminologyRequest = await translate.deleteTerminology(deleteTerminologyParams).promise();
        responseStatus = "SUCCESS";
        responseData = {"REQUEST": "deleteTerminologyRequest"};
        console.log("EVENT TYPE DELETE", deleteTerminologyRequest);
        return await sendResponse(event, context, responseStatus, responseData);
    }

    
};

async function sendResponse(event, context, responseStatus, responseData) {
    let responsePromise = new Promise((resolve, reject) => {
        var responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
            PhysicalResourceId: context.logStreamName,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: responseData
        });
        console.log("CDEBUG ==> Response Body:\n", responseBody);
        var https = require("https");
        var url = require("url");

        var parsedUrl = url.parse(event.ResponseURL);
        var options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "PUT",
            headers: {
                "content-type": "",
                "content-length": responseBody.length
            }
        };
        console.log("CDEBUG ==> Sending Response...\n");
        var request = https.request(options, function(response) {
            console.log("Status code: " + response.statusCode);
            console.log("Headers: " + JSON.stringify(response.headers));
            resolve(JSON.parse(responseBody));
            context.done();
        });
        request.on("error", function(error) {
            console.log("CDEBUG ==> Response Error:" + error);
            reject(error);
            context.done();
        });
        request.write(responseBody);
        request.end();
    });
    return await responsePromise;
}
