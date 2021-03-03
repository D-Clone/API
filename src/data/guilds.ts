import { Guild, GuildDocument } from './models/guild';
import DBWrapper from './db-wrapper';
import { GuildMember } from './models/guild-member';

export default class Guilds extends DBWrapper<string, GuildDocument> {
  protected getOrCreate(id: string) {
    return Guild.findById(id)
      ?.populate('owner')
      .populate('members')
      .populate('roles')
      .populate('channels')
      .exec();
  }

  async getUserGuilds(userId: string) {
    const userGuilds = (await Guild
      .find()
      .populate('members')
      .populate('roles')
      .exec())
      .filter(g => g.members.some(m => m.user === userId as any));
    
    const guilds = [];
    for (const userGuild of userGuilds) {
      const guild = await userGuild
        .populate('owner')
        .populate('channels')
        .execPopulate();
      for (const member of userGuild.members)
        await member
          .populate('user')
          .execPopulate();
      guilds.push(guild);
    }
    return guilds;
  }

  async getUserGuild(userId: string, guildId: string) {
    const guild = await Guild.findById(guildId);
    const inGuild = guild.members.some(m => m.user as any === userId);
    return (inGuild) ? guild : null;
  }
}