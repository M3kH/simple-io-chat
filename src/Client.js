'use strict';
import io from 'socket.io';
import $ from 'jquery';
import _ from 'underscore';
import Base from './utils/Base';

export default class Client extends Base{

  constructor(){
    super();

    // Some ui bindings
    this.ui = {
      loader: $('.loader'),
      cont_login: $('.login'),
      cont_chat: $('.chat'),
      username: $('#username'),
      btn_connect: $('#connect'),

      message: $('#message'),
      btn_send: $('#send-message'),

      box_chat: $('.box-chat'),
      list_chat: $('.box-chat ul'),

      box_users: $('.box-users'),
      list_users: $('.box-users ul')
    };

    this.bindDom();

    // Socket IO actions
    this.actions = {
      'connect': data => this.onCurrentUserConnect(data),
      'disconnect': data => this.onCurrentUserDisconnect(data),
      'user:joined': data => this.onUserConnect(data),
      'user:exit': data => this.onUserDisconnect(data),
      'users:list': data => this.onUserList(data),
      'message': data => this.addMessage(data)
    };

  }

  bindDom(){
    this.ui.username.on('keyup', e => this.validateUsername(e));
    this.ui.btn_connect.on('click', e => this.tryToLogin(e));
    this.ui.btn_send.on('click', e => this.sendMessage(e));
    this.ui.message.on('keyup', e => this.checkPressEnter(e));
  }

  validUserName(){
    return (this.ui.username.val().length > 4);
  }

  validateUsername(e){
    var showLogin = false;
    if(this.validUserName()) showLogin = true;
    this.ui.btn_connect.toggleClass('hide', !showLogin);
  }

  tryToLogin(){
    this.ui.cont_login.toggleClass('hide', true);
    this.ui.loader.toggleClass('hide', false);
    this.socket = io('http://' + window.location.hostname + ':3033');
    super.bindActions();
  }

  onCurrentUserConnect(data){
    this.ui.loader.toggleClass('hide', true);
    this.ui.cont_chat.toggleClass('hide', false);
    this.socket.emit('user:joined', this.ui.username.val());
  }

  onCurrentUserDisconnect(data){
    this.ui.loader.toggleClass('hide', false);
    this.ui.cont_chat.toggleClass('hide', true);
  }

  onUserConnect(data){
    var user = _.escape(data.name),
        id = data.id;
    this.appendMessage(`${user} connect`);
    this.addUser(id, user);
  }

  onUserDisconnect(data){
    var user = _.escape(data.user),
        id = data.id;
    this.appendMessage(`${user} disconnect`);
    this.removeUser(id, user);
  }

  sendMessage(e){
    var message = this.ui.message.val();
    this.ui.message.val('');
    this.socket.emit('send:message', message);
  }

  checkPressEnter(e){
    if(e.keyCode == 13){
      this.sendMessage(e);
    }
  }

  addMessage(data){
    data.user = _.escape(data.user);
    data.msg = _.escape(data.msg);
    this.appendMessage(`<div class="col s2">${data.user}</div>
                        <div class="col s10">${data.msg}</div>`);
  }

  appendMessage(message){
    this.ui.list_chat.append(`<li class="row">${message}</li>`)
    this.ui.box_chat.animate({scrollTop: this.ui.box_chat[0].scrollHeight}, 200);
  }

  onUserList(user_list){
    this.ui.list_users.html('');
    _.each(user_list, obj => this.addUser(obj.id, obj.name))
  }

  addUser(id, name){
    if(id && name){
      this.ui.list_users.append(`<li id="${id}">${name}</li>`);
    }
  }

  removeUser(id, name){
    this.ui.list_users.find('#'+id).remove();
  }

}
