import DBWrapper from './db-wrapper';
import { Channel, ChannelDocument } from './models/channel';

export default class Channels extends DBWrapper<string, ChannelDocument> {
    protected async getOrCreate(id: string) {
        return await Channel
            .findById(id)
            .populate('members')
            .exec();
    }
}