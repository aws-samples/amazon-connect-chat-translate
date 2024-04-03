import { post } from '@aws-amplify/api';

async function ProcessChatTextAPI(content, sourceLang, targetLang, terminologyNames) {
    const apiName = 'amazonTranslateAPI';
    const path = '/translate';
    const myInit = { // OPTIONAL
        body: { 'content': content, 'sourceLang': sourceLang, 'targetLang': targetLang, 'terminologyNames': terminologyNames },
        headers: {
        }, // OPTIONAL
    };
    try {
        const result = await post({
            apiName,
            path,
            myInit,
        }).response
        console.log("ProcessChatTextAPI: ", result);
        const translatedText = result.data.body.translatedText;
        console.log('Translated Text:', translatedText);

        return translatedText;
    //return result; // result.data; // result.data.body; // result.data.body.content; // result.data.body.sourceLang; // result.data.body.targetLang; // result.data.body.terminologyNames; // result.data.body.translatedText
    } catch (error) {
        console.error('Translation failed:', error);
        throw error;
    
    }
}
export default ProcessChatTextAPI
