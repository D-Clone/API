import { Guild, GuildDocument } from './models/guild';
import DBWrapper from './db-wrapper';
import { generateSnowflake } from './snowflake-entity';
import Deps from '../utils/deps';
import Channels from './channels';
import GuildMembers from './guild-members';
import Roles from './roles';
import { UserDocument } from './models/user';
import { Invite } from './models/invite';

export default class Guilds extends DBWrapper<string, GuildDocument> {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private members = Deps.get<GuildMembers>(GuildMembers),
    private roles = Deps.get<Roles>(Roles),
  ) { super(); }

  public async get(id: string | undefined) {
    const guild = await Guild
      .findById(id)
      ?.populate('members')
      .populate('roles')
      .populate('channels')
      .exec();
    if (!guild)
      throw new TypeError('Guild Not Found');
    return guild;
  }

  public async create(name: string, ownerId: string) {    
    const guildId = generateSnowflake();
    const everyoneRole = await this.roles.create('@everyone', guildId);

    return await Guild.create({
      _id: guildId,
      name,
      ownerId,
      roles: [ everyoneRole ],
      members: [
        await this.members.create(guildId, ownerId, everyoneRole),
      ],
      channels: [
        await this.channels.createText(guildId),
        await this.channels.createVoice(guildId),
      ],
    });
  }

  public async join(user: UserDocument, guild: GuildDocument) {
    user.guilds.push(guild.id as any);
    await guild.save();

    const member = await this.members.create(guild.id, user.id);
    guild.members.push(member);
    await guild.save();

    return member;
  }

  public async invites(guildId: string) {
    return await Invite.find({ guildId });
  }
}
