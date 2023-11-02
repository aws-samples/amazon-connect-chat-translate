import React, { Fragment, useEffect } from "react";


const Chat = () => {
       const isLoaded = window.connect && window.connect.ChatSession;
       const connect = window.connect;

       useEffect(() => {
              console.log("CHAT ===> ", connect.ChatSession);
       }, []);

       return (
              <Fragment>
                    <h1>react-amazon-connect-chatjs</h1>
                    {isLoaded ? "loaded!" : "failed"}
                  </Fragment>
       );
};

export default Chat;
