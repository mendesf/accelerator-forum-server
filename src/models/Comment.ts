import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';

export type CommentDocument = mongoose.Document & {
  text: string,
  post: ObjectId,
  owner: ObjectId
};

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post',
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema);