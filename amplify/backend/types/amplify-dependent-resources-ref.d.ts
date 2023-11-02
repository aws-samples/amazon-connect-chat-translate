export type AmplifyDependentResourcesAttributes = {
  "api": {
    "amazonTranslateAPI": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "connecttranslateblog690eb6d1": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "CreatedSNSRole": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "amazonTranslateLambda": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "postInstallScript": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "predictions": {
    "interpretTextcabd9d8d": {
      "region": "string",
      "type": "string"
    },
    "translateText0519c50f": {
      "region": "string",
      "sourceLang": "string",
      "targetLang": "string"
    }
  }
}