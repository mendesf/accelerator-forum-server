import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as Bluebird from 'bluebird';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as path from 'path';

import createRouter from './router';

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/forum';
mongoose.connect(mongodbUri);

const app = express();
const server = new http.Server(app);
const io = socketIO(server);
const router = createRouter(io);


app.use(bodyParser.json());
app.use('/api', router);

const root = path.join(__dirname, '../../accelerator-forum-client/dist');
console.log(root);

app.use(express.static(root));
app.all('/*', (req, res) =>
  res.sendFile(path.join(root, 'index.html'))
);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
  console.log('Press CTRL-C to stop\n');
});
