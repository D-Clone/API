import { Socket } from 'socket.io';
import { PermissionTypes } from '../../../data/types/entity-types';
import { Channel } from '../../../data/models/channel';
import { Guild } from '../../../data/models/guild';
import { generateSnowflake } from '../../../data/snowflake-entity';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WebSocket } from '../websocket';
import WSEvent, { Args, Params, WSEventParams } from './ws-event';

export default class implements WSEvent {
  on: keyof WSEventParams = 'CHANNEL_CREATE';

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard)
  ) {}

  async invoke(ws: WebSocket, client: Socket, { partialChannel, guildId }: Params.ChannelCreate) {
    await this.guard.can(client, guildId, PermissionTypes.General.MANAGE_CHANNELS);
    
    const channel = await Channel.create({
      _id: generateSnowflake(),
      name: partialChannel.name,
      summary: partialChannel.summary,
      guildId,
      type: partialChannel.type,
      memberIds: []
    });

    await Guild.updateOne(
      { _id: guildId },
      { $push: { channels: channel } },
      { runValidators: true }
    ).lean();

    client.join(channel.id);

    ws.io
      .to(guildId)
      .emit('CHANNEL_CREATE', { channel } as Args.ChannelCreate);
  }
}
