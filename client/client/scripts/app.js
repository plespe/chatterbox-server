// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: { "public" : 0 },
  messages: [],
  currentRoom: null,
  friends: {},
  currentFriend: null
};

app.send = function(message){

  if(!message){
    var userName = $('input[name="user"]').val();
    var userMessage = $('input[name="mymessage"]').val();
    var userRoom = $('input[name="myroom"]').val() || 'default';

    if (userName === "" || userMessage === ""){
      console.log("No input, exiting");
      return;
    }

    userName = s.escapeHTML(userName);
    userMessage = s.escapeHTML(userMessage);
    userRoom = s.escapeHTML(userRoom);

    message = {
      'username': userName,
      'text': userMessage,
      'roomname': userRoom
    };

    console.log('sending message: ' + userName + " : " + userMessage);
  }

  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

}

app.fetch = function(){
  console.log('chatterbox: GET messages sent');
  $.ajax({
    // always use this url
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.updateAppData(data);
      setTimeout(app.fetch, 5000);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get messages, trying again in 5secs');
      setTimeout(app.fetch, 5000);
    }
  });
};

app.init = function(){
  app.fetch();
}


// ---- Update Data from GET to app.messages
// ---- render messages and update filter by room.

app.updateAppData = function(data){
  var dataArr = data.results;
  app.rooms = { "public" : 0};
  app.messages = [];

  for(var i=0; i<dataArr.length; i++){
    var elemUser = s.escapeHTML(dataArr[i].username);
    var elemText = s.escapeHTML(dataArr[i].text);
    var elemRoom = s.escapeHTML(dataArr[i].roomname);
    if(!elemRoom){ elemRoom = "public"; }

    var elemDiv;
    if (app.friends.hasOwnProperty(elemUser)){
      elemDiv = '<div class="message" data-roomname="' + elemRoom + '" data-username="' + elemUser + '"><span class="username"><strong>' + elemUser + '</strong></span>:<strong> ' + elemText + '</strong></div>';
    } else{
      elemDiv = '<div class="message" data-roomname="' + elemRoom + '" data-username="' + elemUser + '"><span class="username">' + elemUser + '</span>: ' + elemText + '</div>';
    }

    if(elemUser && elemText){
      // if valid message, add the message
      app.messages.push({
        'username' : elemUser,
        'text' : elemText,
        'roomname' : elemRoom,
        'div' : elemDiv
      });

      // if valid message, add the room
      if(elemRoom === "public" || elemRoom === "default"){
        app.rooms["public"]++;
      } else if(app.rooms.hasOwnProperty(elemRoom)){
        app.rooms[elemRoom]++;
      } else {
        app.rooms[elemRoom] = 1;
      }
    }
  }

  // render new messages and room dropdown
  app.displayMessages();
  app.updateRoomMenu();
}



app.displayMessages = function(){
  // remove current messages from display
  $("#chats").html("");

  // append message divs to display
  for(var i=0; i<app.messages.length; i++){
    $("#chats").append(app.messages[i].div);
  }

  // bind click event: add friend on username click
  $(".username").on("click", function(){
    app.friends[$(this).text()] = true;
    app.updateFriendMenu();
  });

  app.updateFilterView();
};

// =========== Filtering Function  ==========

// ----- Creating Filters Option List for Room and Friend based on GET data
app.updateRoomMenu = function(){
  // reset room menu first
  $("#roomSelect").html("");
  // sort rooms: message count (return an array)
  var sortedRooms = getSortedRooms();
  for(var i=0; i<sortedRooms.length; i++){
    var myOptions = '<option value="' + sortedRooms[i] + '">' + sortedRooms[i] + ' (' + app.rooms[sortedRooms[i]] + ')</option>';
    $("#roomSelect").append(myOptions);
  }
  var everyroom = '<option value="EVERYROOM">EVERYROOM</option>';
  $("#roomSelect").prepend(everyroom);
};

app.updateFriendMenu = function(){
  $("#friendSelect").html("");
  for(var key in app.friends){
    var friendOption = '<option value="' + key + '">' + key + '</option>';
    $("#friendSelect").append(friendOption);
  }
  var everyone = '<option value="EVERYONE">EVERYONE</option>';
  $("#friendSelect").prepend(everyone);
}


// ----  Call by event listener to get Filtered Room and Friend -----
app.updateCurrentRoom = function(roomName){
  app.currentRoom = roomName;
  $("#currentRoom").html(app.currentRoom);
  if(roomName === "EVERYROOM") {
    app.currentRoom = null;
  }
  app.updateFilterView();
}

app.updateCurrentFriend = function(friendName){
  app.currentFriend = friendName;
  $("#currentFriend").html(app.currentFriend);
  if(friendName === "EVERYONE") {
    app.currentFriend = null;
  }
  app.updateFilterView();
}


  // ------ Update Filter View ------
app.updateFilterView = function(){
  // hide all
  $('.message').hide();
  // show roomName
  if(app.currentFriend === null && app.currentRoom === null){
    // no filter, show everything
    $('.message').show();
  }else if(app.currentFriend !== null && app.currentRoom === null){
    // filter by friend only
    $('div[data-username="' + app.currentFriend + '"]').show();

  } else if (app.currentFriend === null && app.currentRoom !== null){
    // filter by room only
    $('div[data-roomname="' + app.currentRoom + '"]').show();
  } else {
    // filter by room and friend
    $('div[data-roomname="' + app.currentRoom + '"][data-username="' + app.currentFriend + '"]').show();
  }
};


// =======  Helper functions  ==========

var getSortedRooms = function(){
  // function for sorting and returning key:value pairs of an object
  // used to sort chat rooms according to the message count
  var keys = [];
  for(var key in app.rooms){ keys.push(key); }
  return keys.sort(function(a,b){ return app.rooms[b]-app.rooms[a]; });
}


app.clearMessages = function(){
  $("#chats").html("");
};

app.addMessage = function(messageObj){
  var elemUser = s.escapeHTML(messageObj.username);
  var elemText = s.escapeHTML(messageObj.text);
  var myDiv = '<div class="message"><span class="username">' + elemUser + '</span>: ' + elemText + '</div>';
  $("#chats").html(myDiv);
}

app.addRoom = function(roomName){
  app.rooms = {};
  if(!app.rooms.hasOwnProperty(roomName)){
    app.rooms[roomName] = 0;
  }
  app.updateRoomMenu();
};

// ===== Document Ready for event listening =======

$().ready(function(){
  // on click
  $("#sendButton").on("click", function(){
    app.send();
  });

  document.getElementById("roomSelect").onchange = function(){
    console.info("new selected room: " + this.value);
    app.updateCurrentRoom(this.value);
  }

  document.getElementById("friendSelect").onchange = function(){
    console.info("new selected friend: " + this.value);
    app.updateCurrentFriend(this.value);
  }


  app.init();
});
