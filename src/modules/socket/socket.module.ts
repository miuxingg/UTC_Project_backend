import { Module } from '@nestjs/common';
import { SocketsGateway } from './socket.gateway';

@Module({
  providers: [SocketsGateway],
  exports: [SocketsGateway],
})
export class SocketModule {}
