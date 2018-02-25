import * as mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  email: string,
  nickname: string,
  password: string,
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    required: true
  },
  nickname: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    validate: /\S/,
    required: true
  }
}, { timestamps: true });

export const UserModel = mongoose.model<UserDocument>('User', userSchema);