import { ObjectId } from 'mongodb';
export interface Account {
    gdUserId: string;
    username: string;
    discordHandle?: string;
    timezone?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AccountDocument extends Account {
    _id: ObjectId;
}
