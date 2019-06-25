
//import firebase from 'firebase';

export const contacts = [
  { userID: "2", userName: "Gestor" },
  { userID: "3", userName: "Equipo" },
  { userID: "4", userName: "Reporting" },
  { userID: "5", userName: "Notifica" },
  { userID: "6", userName: "Huper" },
  //{ userID: "7", userName: "Informal" }
  /* {userID: "8", userName: "Ted"},
   {userID: "9", userName: "Marshall"},
   {userID: "10", userName: "Robin"},
   {userID: "11", userName: "Barney"},
   {userID: "12", userName: "Lilly"}*/
];


export const defaultChat1 = {
  /*let saludo;
  const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child('Saludo');
  nameRef2.on('value', (snapshot2) => {
    saludo = snapshot2.val().concepto;
  });

  let Pregunta;
  const nameRef = firebase.database().ref().child('Mensaje-ChatBot').child('Saludo');
  nameRef.on('value', (snapshot) => {
    Pregunta = snapshot.val().concepto;
  });*/


  //return {
   chatID: "13",
   thread: [],
   participants: "6"
  //};
  /* chatID: "1",
   thread: [{
     text: "Hola Monica", 
     from: "6"
     },{
     text: "Que haces?", 
     from: "6"
     },{
     text: "tarea 1 configuración React", 
     from: "2"
     },{
     text: "Impacta el objetvio de la semana", 
     from: "1"
   }],
   participants: "6"*/
}

export const defaultChat2 = {
/*  chatID: "14",
  thread: [{
    text: "dude are you ingoring me?",
    from: "4"
  }],
  participants: "4"


  */
 chatID: "8",
  thread: [],
  participants: "2"
}

export const defaultUser = {

  userID: "1",
  activeChat: defaultChat1,
  userChats: [defaultChat1, defaultChat2],
  userName: "Gunther",
  location: "New York City",
  thumbnail: "https://img.buzzfeed.com/buzzfeed-static/static/2014-09/16/0/enhanced/webdr10/grid-cell-24140-1410840984-5.jpg",
  contacts: contacts,
  status: "online",
  statusUpdates: [
    "I get knocked down, but I get up again, you're never gonna keep me down",
    "Headed to work, come say wassup",
    "Damn this new Chumbawamba record is fire",
    "Just perkin at Central Perk",
    "Pretty sure I just saw Bruce Willis at the shop. Crazy."
  ]
};

