import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import  { Amplify }  from 'aws-amplify';
import awsconfig from '../aws-exports';
import Chatroom from './chatroom';
import translateText from './translate'
import detectText from './detectText'
import { addChat, setLanguageTranslate, clearChat, useGlobalState, setCurrentContactId } from '../store/state';

Amplify.configure(awsconfig);

const Ccp = () => {
    const [languageTranslate] = useGlobalState('languageTranslate');
    var localLanguageTranslate = [];
    const [Chats] = useGlobalState('Chats');
    const [lang, setLang] = useState("");
    const [currentContactId] = useGlobalState('currentContactId');
    const [languageOptions] = useGlobalState('languageOptions');
    const [agentChatSessionState, setAgentChatSessionState] = useState([]);
    const [setRefreshChild] = useState([]);

    console.log(lang)
    console.log(currentContactId)
    //console.log(Chats)

    // *******
    // Subscribe to the chat session
    // *******
    function getEvents(contact, agentChatSession) {
        console.log(agentChatSession);
        contact.getAgentConnection().getMediaController().then(controller => {
            controller.onMessage(messageData => {
                if (messageData.chatDetails.participantId === messageData.data.ParticipantId) {
                    console.log(`CDEBUG ===> Agent ${messageData.data.DisplayName} Says`,
                        messageData.data.Content)
                }
                else {
                    console.log(`CDEBUG ===> Customer ${messageData.data.DisplayName} Says`,messageData.data.Content);
                    processChatText(messageData.data.Content, messageData.data.Type, messageData.data.ContactId );
                }
            })
        })
    }
    // *******
    // Processing the incoming chat from the Customer
    // *******
    async function processChatText(content, type, contactId) {
        // Check if we know the language for this contactId, if not use dectectText(). This process means we only perform comprehend language detection at most once.
        console.log(type);
        let textLang = '';
          for(var i = 0; i < languageTranslate.length; i++) {
                if (languageTranslate[i].contactId === contactId) {
                    textLang = languageTranslate[i].lang
                     break
                } 
        }
        // If the contatId was not found in the store, or the store is empty, perform dectText API to comprehend
        if (localLanguageTranslate.length === 0 || textLang === ''){
            let tempLang = await detectText(content);
            textLang = tempLang.textInterpretation.language
        }


         // Update (or Add if new contactId) the store with the the language code
         function upsert(array, item) { // (1)
            const i = array.findIndex(_item => _item.contactId === item.contactId);
            if (i > -1) array[i] = item; // (2)
            else array.push(item);
          }
        upsert(languageTranslate, {contactId: contactId, lang: textLang})
        setLanguageTranslate(languageTranslate);
                
        // Translate the customer message into English.
        let translatedMessage = await translateText(content, textLang, 'en');
        console.log(`CDEBUG ===>  Original Message: ` + content + `\n Translated Message: ` + translatedMessage);
        // create the new message to add to Chats.
        let data2 = {
            contactId: contactId,
            username: 'customer',
            content: <p>{content}</p>,
            translatedMessage: <p>{translatedMessage}</p>
        };
        // Add the new message to the store
        addChat(prevMsg => [...prevMsg, data2]);
    }

    // *******
    // Subscribing to CCP events. See : https://github.com/aws/amazon-connect-streams/blob/master/Documentation.md
    // *******
    function subscribeConnectEvents() {
        window.connect.core.onViewContact(function(event) {
            var contactId = event.contactId;
            console.log("CDEBUG ===> onViewContact", contactId)
            setCurrentContactId(contactId);    
          });

        console.log("CDEBUG ===> subscribeConnectEvents");

        // If this is a chat session
        if (window.connect.ChatSession) {
            console.log("CDEBUG ===> Subscribing to Connect Contact Events for chats");
            window.connect.contact(contact => {

                // This is invoked when CCP is ringing
                contact.onConnecting(() => {
                    console.log("CDEBUG ===> onConnecting() >> contactId: ", contact.contactId);
                    let contactAttributes = contact.getAttributes();
                    console.log("CDEBUG ===> contactAttributes: ", JSON.stringify(contactAttributes));
                    let contactQueue = contact.getQueue();
                    console.log("CDEBUG ===> contactQueue: ", contactQueue);
                });

                // This is invoked when the chat is accepted
                contact.onAccepted(async() => {
                    console.log("CDEBUG ===> onAccepted: ", contact);
                    const cnn = contact.getConnections().find(cnn => cnn.getType() === window.connect.ConnectionType.AGENT);
                    const agentChatSession = await cnn.getMediaController();
                    setCurrentContactId(contact.contactId)
                    console.log("CDEBUG ===> agentChatSession ", agentChatSession)
                    // Save the session to props, this is required to send messages within the chatroom.js
                    setAgentChatSessionState(agentChatSessionState => [...agentChatSessionState, {[contact.contactId] : agentChatSession}])
                
                    // Get the language from the attributes, if the value is valid then add to the store
                    localLanguageTranslate = contact.getAttributes().x_lang.value
                    if (Object.keys(languageOptions).find(key => languageOptions[key] === localLanguageTranslate) !== undefined){
                        console.log("CDEBUG ===> Setting lang code from attribites:", localLanguageTranslate)
                        languageTranslate.push({contactId: contact.contactId, lang: localLanguageTranslate})
                        setLanguageTranslate(languageTranslate);
                        setRefreshChild('updated') // Workaround to force a refresh of the chatroom UI to show the updated language based on contact attribute.
                
                    }
                    console.log("CDEBUG ===> onAccepted, languageTranslate ", languageTranslate)
                    
                });

                // This is invoked when the customer and agent are connected
                contact.onConnected(async() => {
                    console.log("CDEBUG ===> onConnected() >> contactId: ", contact.contactId);
                    const cnn = contact.getConnections().find(cnn => cnn.getType() === window.connect.ConnectionType.AGENT);
                    const agentChatSession = await cnn.getMediaController();
                    getEvents(contact, agentChatSession);
                });

                // This is invoked when new agent data is available
                contact.onRefresh(() => {
                    console.log("CDEBUG ===> onRefresh() >> contactId: ", contact.contactId);
                });

                // This is invoked when the agent moves to ACW
                contact.onEnded(() => {
                    console.log("CDEBUG ===> onEnded() >> contactId: ", contact.contactId);
                    setLang('');
                });
                
                // This is invoked when the agent moves out of ACW to a different state
                contact.onDestroy(() => {
                    console.log("CDEBUG ===> onDestroy() >> contactId: ", contact.contactId);
                    // TODO need to remove the previous chats from the store
                    //clearChat()
                    setCurrentContactId('');
                    clearChat();
                });
            });

            /* 
            **** Subscribe to the agent API **** 
            See : https://github.com/aws/amazon-connect-streams/blob/master/Documentation.md
            */

            console.log("CDEBUG ===> Subscribing to Connect Agent Events");
            window.connect.agent((agent) => {
                agent.onStateChange((agentStateChange) => {
                    // On agent state change, update the React state.
                    let state = agentStateChange.newState;
                    console.log("CDEBUG ===> New State: ", state);

                });

            });
        }
        else {
            console.log("CDEBUG ===> waiting 3s");
            setTimeout(function() { subscribeConnectEvents(); }, 3000);
        }
    };


    // ***** 
    // Loading CCP
    // *****
    useEffect(() => {
        const connectUrl = process.env.REACT_APP_CONNECT_INSTANCE_URL;
        window.connect.agentApp.initApp(
            "ccp",
            "ccp-container",
            connectUrl + "/connect/ccp-v2/", { 
                ccpParams: { 
                    region: process.env.REACT_APP_CONNECT_REGION,
                    pageOptions: {                  // optional
                        enableAudioDeviceSettings: true, // optional, defaults to 'false'
                        enablePhoneTypeSettings: true // optional, defaults to 'true'
                      }
                } 
            }
        );
        subscribeConnectEvents();
    }, []);


    return (
        <main>
          <Grid columns='equal' stackable padded>
          <Grid.Row>
            {/* CCP window will load here */}
            <div id="ccp-container"></div>
            {/* Translate window will laod here. We pass the agent state to be able to use this to push messages to CCP */}
            <div id="chatroom" ><Chatroom session={agentChatSessionState}/> </div> 
            </Grid.Row>
          </Grid>
        </main>
    );
};

export default Ccp;
