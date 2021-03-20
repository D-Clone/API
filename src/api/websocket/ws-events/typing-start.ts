import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, Args, Params, WSEventParams } from './ws-event';

export default class implements WSEvent<'TYPING_START'> {
  on = 'TYPING_START' as const;

  async invoke(ws: WebSocket, client: Socket, { channelId, userId }: Params.TypingStart) {
    client.broadcast
      .to(channelId)
      .emit('TYPING_START', { userId } as Args.TypingStart);
  }
}
