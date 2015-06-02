

var myevent = _.extend({}, Backbone.Events);

var Message = Backbone.Model.extend({
  // url: 'https://api.parse.com/1/classes/chatterbox',
  url: 'http://127.0.0.1:3000/classes/room1',
  defaults: {
    objectId: '',
    username: '',
    roomname: '',
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'http://127.0.0.1:3000/classes/room1',

  loadMsgs: function(){
    this.fetch();

    // this.fetch();
  },

  parse: function(response, option){
    var result = [];
    for (var i = response.results.length - 1; i>=0; i-- ){
      result.push(response.results[i]);
    }

    return result;
  }

});

var MessageView = Backbone.View.extend({

  template: _.template('<div class="message" data-id="<%- objectId %>" data-room="<%- roomname %>"> \
    <div class="user"><%- username %></div> \
    <div class="text"><%- text %></div> \
    <div class="createDate"><%- createdAt %></div> \
    </div>'),

  render: function(){
    this.$el.html(this.template(this.model.attributes));

    return this.$el;
  },

});

var FormView = Backbone.View.extend({
    // var userName = $('input[name="user"]').val();
    // var userMessage = $('input[name="mymessage"]').val();
    // var userRoom = $('input[name="myroom"]').val() || 'default';
  events: {
    'click #sendButton' : 'handleSubmit',
    'change #roomSelect' : 'triggerRoomSelect'
  },

  handleSubmit: function(){
    var $username = this.$('input[name="user"]').val();
    var $usermessage = this.$('input[name="mymessage"]').val();
    var $userroom = this.$('input[name="myroom"]').val();

    this.collection.create({
      username: $username,
      text: $usermessage,
      roomname: $userroom
    });
  },

  triggerRoomSelect: function(){
    var input = this.$('#roomSelect').val();
    console.log("roomSelect triggered! input: ", input);
    myevent.trigger("zzz", input);
  },

});


var MessagesView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('sync',this.render, this);
    myevent.bind('zzz', this.updateRoom, this);

  },

  updateRoom: function(data){
    console.log("catched event in the other view: roomSelect!");
    console.log(arguments);
    console.log(data);

    this.$el.children().hide();
    this.$el.children().find('[data-room="' + data + '"]').show();

  },

  template: _.template('<div class="frame-msg"><%= mydata %></div>'),

  render: function(){
    var result = this.collection.reduce(function(memo, item){
      var messageView = new MessageView({model: item});
      return messageView.render().html() + memo;
      // return memo + messageView.render().html();
    }, '');
    this.$el.html(this.template({mydata: result}));
  },



});
