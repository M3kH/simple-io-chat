'use strict';

export default class Base{

  constructor(socket, events, actions){
    this.events = events || false;
    this.actions = actions || false;
    this.socket = socket || false;

    if(this.socket && this.actions){
      this.bindActions();
    }

    // Reset events with the binds ones
    if(this.events){
      var _events = this.events;
      this.events = {};
      this.bindEvents(_events);
    }
  }

  bindEvents(events){
    for (let event in events) {
      this.on(event, events[event]);
    }
  }

  on(name, fn){
    if(!this.events) this.events = {};
    this.events[name] = this.events[name] || [];
    this.events[name].push(fn);
  }

  trigger(name, args){
    this.events[name] = this.events[name] || [];
    args = args || [];
    this.events[name].forEach((fn) => {
      fn.apply(this, args);
    });
  }

  bindActions(){
    if(!this.socket){
      throw new Error('You cant declare actions if you dont use a socket');
    }
    for (let event in this.actions) {
      this.onSocket(event, this.actions[event]);
    }
  }

  onSocket(name, fn){
    if(!this.socket){
      throw new Error('You need a socket to run this action');
    }
    this.socket.on(name, data => fn(data));
  }

  triggerSocket(name, args){
    if(!this.socket){
      throw new Error('You need a socket to run this action');
    }
    this.socket.emit(name, args);
  }

}
