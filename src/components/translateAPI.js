import { post } from '@aws-amplify/api';

async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames) {
    const apiName = 'amazonTranslateAPI';
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {}, // OPTIONAL
    };
    console.log("ProcessChatTextAPI: ", myInit);
    try {
        var result = await post(apiName, path, myInit).response
        console.log("ProcessChatTextAPI: ", result);
        return result;
    }
    catch (error) {
        console.error("ProcessChatTextAPI: ", error);
        return error;
    }
}
export default ProcessChatTextAPI
