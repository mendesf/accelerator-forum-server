import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';

export type PostDocument = mongoose.Document & {
  text: string,
  comments: ObjectId[],
  owner: ObjectId,
};

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }],
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const PostModel = mongoose.model<PostDocument>('Post', postSchema);