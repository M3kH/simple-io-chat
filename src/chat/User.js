'use strict';

import Base from './../utils/Base';
import _ from 'underscore';

export default class User extends Base{
  constructor(socket, io){
    // socket, events, actions
    super(socket, false, {
      'user:joined': data => this.joined(data),
      'send:message': data => this.message(data),
      'disconnect': data => this.exit(data)
    });

    this.id = _.uniqueId('user_');
    this.io = io;
  }

  joined(name){
    this.name = name;
    this.io.emit('user:joined', {name: name, id: this.id});
  }

  message(message){
    this.io.emit('message', {user: this.name, id: this.id, msg: message});
  }

  exit(data){
    this.io.emit('user:exit', {name: this.name, id: this.id});
    this.trigger('user:exit');
  }
}
