import SlackOAuthClient from 'messaging-api-slack';
import React from 'react';
import { connect } from 'react-redux';
import { consultaMensajes }  from '../../modules/chatBot/actions';



// get access token by setup OAuth & Permissions function to your app.
// https://api.slack.com/docs/oauth


class Slack2 extends React.Component {
    state = { client: null };
    componentDidMount() {
        const { SlackOAuthClient } = require('messaging-api-slack')
        this.setState({

            client: SlackOAuthClient.connect(
              // 'xoxp-482555533539-486285033681-535707706853-443780a32ce31f5f3c8b9b6684e2ad96'
                'xoxb-482555533539-532878166725-SImPnsMh0QvM2osXpUnMy7Wa'
            )
        });

    }
    render() {

        console.log('llamars');
        if (this.state.client) {
        //    console.log('Crear');
            //obtiene el historico y envia el mensaje
/*
            const cambio = this.state.client.callMethod('channels.history', { channel: 'CE61KKZCZ', count: 10}).then(res => {
               
               this.props.consultaMensajes(res.messages);
                
            });

            */
           // console.log(PromiseValue);
           // cambio.on('PromiseValue', (snapshot2) => {
            //   console.log(snapshot2.val());
           // });
            
            //console.log('Crear2')
       //     this.state.client.postMessage('CE61KKZCZ', { text: 'Hello 15!' });
         //   this.state.client.postEphemeral('CE61KKZCZ', 'UEA8D0ZL1', { text: 'Hello 2!' });
            this.state.client.postMessage(
                'CE61KKZCZ',
                { text: ':sonrisa_burlona:',
                    attachments: [
                        {
                            text: 'Choose a game to play',
                            fallback: 'You are unable to choose a game',
                            callback_id: 'wopr_game',
                            color: '#FFA3E3',
                            attachment_type: 'default',
                            actions: [
                                {
                                  name: 'game',
                                  text: 'Chess',
                                  type: 'button',
                                  value: 'chess',
                                }
                            ]
                        },
                    ]
                }
               
            );
            



       //    this.state.client.channels.hystori({ 'xoxp-482555533539-486285033681-534095674742-b669a7c9baf19f3fec2357cfdfdfa640', 'CE61KKZCZ' }).then(res => {
        //    console.log(res);
       // }
          
         
         /*   this.state.client.getChannelInfo('CE61KKZCZ').then(res => {
                console.log(res);
                // {
                //   id: 'C8763',
                //   name: 'fun',
                //   ...
                // }
              });
            
           //  slack.channels.history({token, channel})
            //    const cambio = this.state.client.callMethod('  channels.history', { channel: 'CE61KKZCZ'});
       // console.log(cambio);
       */
              
        }
      
        
        return null;
    }
}


const mapAppStateToProps = (state) => (
    {
        consultaMensaje: state.chatReducer.consultaMensaje,
        
    });
export default connect(mapAppStateToProps, {consultaMensajes}) (Slack2);