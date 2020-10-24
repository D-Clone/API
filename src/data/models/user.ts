import { Document, model, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export enum StatusType {
  Online = 'ONLINE',
  DND = 'DND',
  Idle = 'IDLE',
  Offline = 'OFFLINE'
}

export class UserVoiceState {
  channelId: string;
  guildId: string;
  selfMuted = false;
  connected = false;
}

export interface FriendRequest {
  userId: string,
  type: FriendRequestType
}

export enum FriendRequestType {
  Outgoing = 'OUTGOING',
  Incoming = 'INCOMING' 
}

export interface UserDocument extends Document {
  _id: string;
  username: string;
  createdAt: Date;
  avatarURL: string;
  status: StatusType;
  friends: string[];
  friendsRequests: FriendRequest[];
  voice: UserVoiceState;
}

export const User = model<UserDocument>('user', new Schema({
  _id: String,
  avatarURL: String,
  username: String,
  createdAt: Date,
  status: String,
  friends: [{ type: String, ref: 'user' }],
  friendRequests: { type: Array, default: [] },
  voice: { type: Object, default: new UserVoiceState() }
}).plugin(passportLocalMongoose));
