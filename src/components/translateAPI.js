import { post } from '@aws-amplify/api';
import awsconfig from ".../aws-exports";
import { Amplify } from 'aws-amplify';

const existingConfig = Amplify.getConfig(awsconfig);

async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames) {
    //const apiName = 'amazonTranslateAPI';
    const apiName = existingConfig.API?.REST.apiName;
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {}, // OPTIONAL
    };
    console.log("ProcessChatTextAPI: ", content);
    console.log("ProcessChatTextAPI: ", sourceLang);
    console.log("ProcessChatTextAPI: ", targetLang);
    console.log("ProcessChatTextAPI: ", terminologyNames);
    console.log("ProcessChatTextAPI: ", path);
    console.log("ProcessChatTextAPI: ", myInit);
    console.log("API Name: ", apiName);
    try {
        var result = await post(apiName, path, myInit,).response;
        var isSuccess = await result.json();
        if (isSuccess.success) {
            console.log("ProcessChatTextAPI: ", isSuccess.data);
            return isSuccess.data;
        }
        console.log("ProcessChatTextAPI: ", result);
        return result;
    }
    catch (error) {
        console.error("ProcessChatTextAPI: ", error);
        return error;
    }
}
export default ProcessChatTextAPI
