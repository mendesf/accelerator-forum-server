import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { UserModel, UserDocument } from '../models';

const secret = process.env.SECRET || "Let's rock!";

export class AuthController {

  auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    let token = req.headers['x-access-token'];

    if (!token) {
      res.sendStatus(401);
      return;
    }
    jwt.verify(token.toString(), secret, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
        return;
      }
      (<any>req).user = decoded;
      next();
    });
  }

  signIn = async (req: express.Request, res: express.Response): Promise<void> => {
    req.body = req.body || {};
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json({ message: 'User not found.' });
      return;
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).json({ message: 'Invalid password.' });
      return;
    }

    this.goodToGo(user, res);
  }

  signUp = async (req: express.Request, res: express.Response): Promise<void> => {
    req.body = req.body || {};
    req.body.password = bcrypt.hashSync(req.body.password);
    try {
      const user = await UserModel.create(req.body);
      this.goodToGo(user, res);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  private goodToGo(user: UserDocument, res: express.Response): void {
    const token = jwt.sign({
      _id: user._id,
      nickname: user.nickname
    }, secret, { expiresIn: '1d' });

    res.setHeader('x-access-token', token);
    res.end();
  }
}