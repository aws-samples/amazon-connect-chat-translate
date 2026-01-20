import { post } from '@aws-amplify/api';
//async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames)
async function ProcessChatTextAPI(content, sourceLang, targetLang) {
    const apiName = 'amazonTranslateAPI';
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang },
        //body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {
            'Content-Type': 'application/json'
        }, // OPTIONAL
    };
    console.log("ProcessChatTextAPI: ", content);
    console.log("ProcessChatTextAPI: ", sourceLang);
    console.log("ProcessChatTextAPI: ", targetLang);
    //console.log("ProcessChatTextAPI: ", terminologyNames);
    console.log("ProcessChatTextAPI: ", path);
    console.log("ProcessChatTextAPI: ", myInit);
    console.log("API Name: ", apiName);
    try {
        // Correct Amplify API.post usage
        const resp = await post(apiName, path, myInit);
        console.log("Translated Message Payload: ", resp);
        return resp;
    }
    catch (error) {
        console.error("ProcessChatTextAPI: ", error);
        return error;
    }
}
export default ProcessChatTextAPI
