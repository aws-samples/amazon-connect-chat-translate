import { API } from 'aws-amplify';

async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames) {
    const apiName = 'amazonTranslateAPI';
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {}, // OPTIONAL
    };
    console.log("myInit :", myInit);

    try {
        var result = await API.post(apiName, path, myInit);
        console.log("ProcessChatTextAPI: ", result);
        return result;
    }
    catch (error) {
        console.error("ProcessChatTextAPI: ", error);
        return error;
    }
}
export default ProcessChatTextAPI
