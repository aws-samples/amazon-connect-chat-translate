import Predictions from '@aws-amplify/predictions';

async function DetectChatText(content) {

    let detectLang = Predictions.interpret({
        text: {
            source: {
                text: content,
            },
            type: "ALL"
        }
    })
    return detectLang
}

export default DetectChatText
