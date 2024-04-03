import { post } from '@aws-amplify/api';
//async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames)
async function ProcessChatTextAPI(content, sourceLang, targetLang) {
    const apiName = 'amazonTranslateAPI';
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang },
        //body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {
        }, // OPTIONAL
    };
    console.log("ProcessChatTextAPI: ", content);
    console.log("ProcessChatTextAPI: ", sourceLang);
    console.log("ProcessChatTextAPI: ", targetLang);
    //console.log("ProcessChatTextAPI: ", terminologyNames);
    console.log("ProcessChatTextAPI: ", path);
    console.log("ProcessChatTextAPI: ", myInit);
    console.log("API Name: ", apiName);
    
    var result = await post({
        apiName,
        path,
        options: myInit,
    }).then(response => {
            console.log("Translated Message Response: ", response);
            return response;
        }
    );
    console.log("Translated Message: ", result);
    return result;
}

export default ProcessChatTextAPI
