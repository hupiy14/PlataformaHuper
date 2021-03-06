import React from 'react';
import ReactDOM from 'react-dom';
import { Chat, HeroCard } from '@progress/kendo-react-conversational-ui';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { ApiAiClient } from 'api-ai-javascript';
import { connect } from 'react-redux';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
        this.client = new ApiAiClient({
            accessToken: 'c008d8efe5394db4921b7db75db75d72'
        });
        this.client.eventRequest("Welcome").then(this.onResponse, this);
        this.user = {
            id: 1,
            name: 'John'
        };
        this.bot = {
            id: "botty",
            name: 'Botty McbotFace',
            avatarUrl: "https://demos.telerik.com/kendo-ui/content/chat/InsuranceBot.png"
        };
        this.addNewMessage = this.addNewMessage.bind(this);
    }

    аttachmentTemplate = (props) => {
        let attachment = props.item;
        if (attachment.type === "quote") {
            return (
            <div className="k-card k-card-type-rich">
                <div className="k-card-body">
                    <div><strong>Type:</strong>
                        <span>{attachment.coverage}</span>
                    </div>
                    <div>
                        <strong>Car model:</strong>
                        <span>{attachment.make}</span>
                    </div>
                    <div>
                        <strong>Car cost:</strong>
                        <span>{attachment.worth}</span>
                    </div>
                    <div>
                        <strong>Start date:</strong>
                        <span>{attachment.startDate}</span>
                    </div>
                    <hr/>
                    <div>
                        <strong>Total:</strong>
                        <span>{attachment.premium}</span>
                    </div>
                </div>
            </div> );
        } else if (attachment.type === "payment_plan") {
            return (
                <div className="k-card k-card-type-rich">
                    <div className="k-card-body">
                        { attachment.rows.map(( row, index ) =>

                            <div key={index}>{row.text}</div>
                        )}
                        <hr/><div><strong>Total:</strong>
                        <span>{attachment.premium}</span></div>
                    </div>
                </div> );
        } else if ( attachment.type === "calendar" ) {
         //return <Calendar onChange={(event) => {this.addNewMessage(event);}}/>;
        }
      /*  return <HeroCard title={attachment.title}
                imageUrl={attachment.images ? attachment.images[0].url : ""}
                subtitle={attachment.subtitle ? attachment.subtitle : "" }
                actions={attachment.buttons}
                onActionExecute={this.addNewMessage}/>;*/
    }

    parseActions = (actions) => {
        if (actions !== undefined ) {
            actions.map(action => {
                if (action.type === "postBack") {
                    action.type = 'reply';
                }
            });
            return actions;
        }
        return [];
    }

    parseText = ( event ) => {
        if (event.action !== undefined) {
            return event.action.value;
        } else if ( event.value ) {
            return event.value;
        } else {
            return event.message.text;
        }
    }

    onResponse = (activity) => {
        let that = this;
        activity.result.fulfillment.messages.forEach(function(element) {
            let newMessage;
            console.log(element.speech);
            newMessage = {
                text: element.speech,
                author: that.bot,
              //  timestamp: new Date(activity.timestamp),
             //   suggestedActions: element.replies ? element.replies.map(x => { return { type: "reply", title: x, value: x };}) : []
            };
            that.setState((prevState) => {
                return { messages: [ ...prevState.messages, newMessage ] };
            });
        });

        if (activity.result.fulfillment.data) {
            let newMessage;
         
            newMessage = {
                text: "",
                author: that.bot,
                timestamp: new Date(activity.timestamp),
                suggestedActions: activity.result.fulfillment.data.null.suggestedActions ? this.parseActions(activity.result.fulfillment.data.null.suggestedActions) : [],
                attachments: activity.result.fulfillment.data.null.attachments ? activity.result.fulfillment.data.null.attachments : []

            };
            that.setState((prevState) => {
                return { messages: [ ...prevState.messages, newMessage ] };
            });
        }

        if (activity.result.fulfillment.speech === "When do you want your insurance to start?") {
            this.setState((prevState) => {
                return { messages: [ ...prevState.messages, { author: this.bot, timestamp: new Date(activity.timestamp), attachments: [ { type: "calendar" } ] } ] };
            });
        }
    }

    addNewMessage = (event) => {
        let value = this.parseText(event);
        this.client.textRequest(value.toString()).then(this.onResponse, this);
        if (!event.value) {
            this.setState((prevState) => {
                console.log(value);
                return { messages: [ ...prevState.messages, { author: this.user, text: value, timestamp: new Date() } ] };
            });
        }
    };

    render() {
       
        return (
         
            <Chat
                messages={this.state.messages}
               // user={this.user}
                onMessageSend={this.addNewMessage}
            //    attachmentTemplate={this.аttachmentTemplate}
            />
        );
    }
}
const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        userId: state.auth.userId,

    });
export default connect(mapAppStateToProps, {  })(App);
