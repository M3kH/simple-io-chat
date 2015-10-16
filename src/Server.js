'use strict';

import ChatServer from './chat/ChatServer';
import io from 'socket.io';
import child_process from 'child_process';

export default class Server{

  constructor(){
    this.lobies = [];
    this.players = [];
    this.io = io();

    this.chat = new ChatServer(this.io);
    this.createHttp();
    this.io.listen(3033);
  }

  createHttp(){
    if(child_process){
      child_process.spawn(
        './node_modules/.bin/http-server',
        ['./', '-p', '3000', '-o', '-s'],
        { stdio: 'inherit' }
      );
    }
  }

}
