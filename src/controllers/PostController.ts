import * as express from 'express';
import { URL } from 'url';
import { ObjectId } from 'bson';

import { PostModel, PostDocument } from '../models';


export class PostController {

  constructor(private io: SocketIO.Server) { }

  post = async (req: express.Request, res: express.Response): Promise<void> => {
    req.body = req.body || {};
    try {
      let post = await PostModel.create(req.body);
      post = await this.findPostById(post._id);
      res.status(201).json(post);
      this.io.emit('new post', post.toJSON());
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  async get(req: express.Request, res: express.Response): Promise<void> {
    const conditions: any = {};
    const owner: string = req.query['owner'];
    const searchText: string = req.query['search'];

    if (owner) {
      conditions.owner = owner;
    } else if (searchText) {
      let re = /#\w{1,}/g;
      const hashtags = searchText.match(re);
      if (hashtags) {
        re = new RegExp(hashtags.join('|'), 'i');
        conditions.text = re;
      }
    }

    const posts = await PostModel.find(conditions)
      .populate({ path: 'owner', select: 'nickname' })
      .populate({ path: 'comments', populate: { path: 'owner' } })
      .sort('-createdAt')
      .exec();

    res.json(posts);
  }

  put = async (req: express.Request, res: express.Response): Promise<void> => {
    const user = (<any>req).user;

    try {
      const result = await PostModel.updateOne({ _id: req.params.id, owner: user._id }, req.body);
      res.status(200).json(result);

      if (result.nModified > 0) {
        const post = await this.findPostById(req.params.id);

        this.io.emit('post updated', post.toJSON());
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  findPostById(id: ObjectId | string) {
    return PostModel.findById(id)
      .populate({ path: 'owner', select: 'nickname' })
      .populate({ path: 'comments', populate: { path: 'owner' } });
  }
}