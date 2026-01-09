const AWS = require('aws-sdk');

const translate = new AWS.Translate({ apiVersion: '2017-07-01' }); // Fix API version (best practice)

// Allowed language codes for validation (prevents injection attacks)
const ALLOWED_LANGUAGE_CODES = [
  'af', 'sq', 'am', 'ar', 'hy', 'az', 'bn', 'bs', 'bg', 'ca', 'zh', 'zh-TW',
  'hr', 'cs', 'da', 'fa-AF', 'nl', 'en', 'et', 'fa', 'tl', 'fi', 'fr', 'fr-CA',
  'ka', 'de', 'el', 'gu', 'ht', 'ha', 'he', 'hi', 'hu', 'is', 'id', 'it', 'ja',
  'kn', 'kk', 'ko', 'lv', 'lt', 'mk', 'ms', 'ml', 'mt', 'mn', 'no', 'ps', 'pl',
  'pt', 'pt-BR', 'pt-PT', 'pa', 'ro', 'ru', 'sr', 'si', 'sk', 'sl', 'so', 'es',
  'es-MX', 'sw', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'auto'
];

// Maximum text length to prevent DoS
const MAX_TEXT_LENGTH = 10000;

exports.handler = (event, context, callback) => {
  let payload;
  
  try {
    payload = JSON.parse(event.body);
  } catch (parseError) {
    console.error("Invalid JSON in request body:", parseError);
    return callback(null, { 
      "statusCode": 400, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, 
      "body": JSON.stringify({ error: "Invalid JSON in request body" }) 
    });
  }
  
  console.log("event: ", event);
  
  // Input validation
  const { content, sourceLang, targetLang } = payload;
  
  if (!content || typeof content !== 'string') {
    return callback(null, { 
      "statusCode": 400, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, 
      "body": JSON.stringify({ error: "Missing or invalid 'content' field" }) 
    });
  }
  
  if (content.length > MAX_TEXT_LENGTH) {
    return callback(null, { 
      "statusCode": 400, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, 
      "body": JSON.stringify({ error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` }) 
    });
  }
  
  if (!sourceLang || !ALLOWED_LANGUAGE_CODES.includes(sourceLang)) {
    return callback(null, { 
      "statusCode": 400, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, 
      "body": JSON.stringify({ error: "Invalid or missing source language code" }) 
    });
  }
  
  if (!targetLang || !ALLOWED_LANGUAGE_CODES.includes(targetLang)) {
    return callback(null, { 
      "statusCode": 400, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, 
      "body": JSON.stringify({ error: "Invalid or missing target language code" }) 
    });
  }

  let params = {
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
    Text: content,
  };
  console.log("parameters: " + JSON.stringify(params));

  translate.translateText(
    params,
    function(error, response) {

      if (error) {
        console.log(error);
        callback(null, { "statusCode": 500, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, "body": JSON.stringify({ error: "Translation failed" }) });
      }
      else {
        console.log('response ' + JSON.stringify(response));
        callback(null, { "statusCode": 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, "body": JSON.stringify((response)) });
      }
    }

  );
};
