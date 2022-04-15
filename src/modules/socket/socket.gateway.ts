import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventNames } from './types/eventName';

@WebSocketGateway(8081, { cors: {} })
export class SocketsGateway implements OnGatewayInit {
  private logger = new Logger('SocketsGateway');

  @WebSocketServer()
  server: Server;

  sendEvent<T extends Record<string, any> = Record<string, any>>(
    eventName: EventNames,
    { __to, ...data }: T,
  ) {
    if (__to) {
      console.log(String(__to));

      this.server.to(__to).emit(eventName, data);
    } else {
      this.server.emit(eventName, data);
    }
  }

  afterInit(server: Server) {
    server.on('connect', (socket: Socket) => {
      socket.on(EventNames.JoinRoom, (room) => {
        socket.join(room.name);
      });

      socket.on(EventNames.LeaveRoom, (room) => {
        socket.leave(room.name);
      });
    });
  }
}
