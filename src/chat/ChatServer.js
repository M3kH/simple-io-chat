'use strict';

import Base from './../utils/Base';
import User from './User';
import _ from 'underscore';

export default class ChatServer extends Base{
  constructor( io ){
    var actions = {
      'connect': socket => this.onGuestJoin(socket)
    };

    // socket, events, actions
    super(io, false, actions);
    this.users = {};
  }

  onGuestJoin(socket){
    var _user = new User(socket, this.socket)
    this.users[_user.id] = _user;
    this.users[_user.id].on('user:exit', data => this.onUserDisconnect(_user.id));
  }

  onUserDisconnect(id){
    delete this.users[id];
  }

  refreshUsers(){
    var users = _.map(this.users, (instance, id) => {
      return {id: id, name: instance.name};
    });

    this.socket.emit('users:list', users);
  }
}
