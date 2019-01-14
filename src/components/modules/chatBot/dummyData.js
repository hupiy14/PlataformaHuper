
export const contacts = [
    {userID: "2", userName: "Ross"},
    {userID: "3", userName: "Joey"},
    {userID: "4", userName: "Chandler"},
    {userID: "5", userName: "Rachel"},
    {userID: "6", userName: "Monica"},
    {userID: "7", userName: "Phoebe"},
    {userID: "8", userName: "Ted"},
    {userID: "9", userName: "Marshall"},
    {userID: "10", userName: "Robin"},
    {userID: "11", userName: "Barney"},
    {userID: "12", userName: "Lilly"}
  ];
  
  export const defaultChat1 = {
    chatID: "13",
    thread: [{
      text: "Hola Monica", 
      from: "6"
      },{
      text: "Que haces?", 
      from: "6"
      },{
      text: "tarea 1 configuración React", 
      from: "1"
      },{
      text: "Impacta el objetvio de la semana", 
      from: "1"
    }],
    participants: "6"
  }
  
  export const defaultChat2 = {
    chatID: "14",
    thread: [{
      text: "dude are you ingoring me?",
      from: "4"
    }],
    participants: "4"
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
  
  