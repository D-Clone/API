import { Document, model, Schema } from 'mongoose';
import { GuildDocument } from './guild';
import { UserDocument } from './user';

export interface GuildMemberDocument extends Document {
  guild: GuildDocument;
  user: UserDocument;
}

export const GuildMember = model<GuildMemberDocument>('guildMember', new Schema({
  guild: { type: String, ref: 'guild' },
  user: { type: String, ref: 'user' }
}));