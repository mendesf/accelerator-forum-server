# accelerator-forum-server
This is the back-end app for VanHack's Accelerator Program.

## Installing
First you have to install Node.js and MongoDB.

[How to install Node.js](https://nodejs.org/en/download/package-manager/)

[How to install MongoDB](https://docs.mongodb.com/manual/installation/)

> Use version `3.6.x`

`docker run --name mongodb -d -p 27017:27017 mongo:3.6.23`

Then run `npm install` to install all the dependencies.

## Running
First, run `npm run build` to transpile the files.
 
Now you can run `npm start` to start the server.
