import * as express from 'express';
import { CommentModel, CommentDocument } from '../models';
import { PostModel } from '../models';
import { ObjectId } from 'bson';

export class CommentController {

  constructor(private io: SocketIO.Server) { }

  post = async (req: express.Request, res: express.Response): Promise<void> => {
    req.body = req.body || {};
    try {
      let comment = await CommentModel.create(req.body);
      const post = await PostModel.findOne({ _id: comment.post });
      post.comments.push(comment._id);
      await post.save();

      comment = await this.findById(comment._id);

      res.status(201).json(comment);
      this.io.emit('new comment', comment.toJSON());
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  put = async (req: express.Request, res: express.Response): Promise<void> => {
    const user = (<any>req).user;

    try {
      const result = await CommentModel.updateOne({ _id: req.params.id, owner: user._id }, req.body);
      res.status(200).json(result);

      if (result.nModified > 0) {
        const comment = await this.findById(req.params.id);
        this.io.emit('comment updated', comment.toJSON());
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  findById(id: ObjectId | string): Promise<CommentDocument> {
    return CommentModel
      .findById(id)
      .populate('owner')
      .exec();
  }
}