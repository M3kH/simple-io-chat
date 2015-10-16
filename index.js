'use strict';

import Server from './src/Server';
import Client from './src/Client';

if(typeof window === 'undefined'){
  new Server();
}else{
  new Client();
}
