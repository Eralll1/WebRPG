import { Server } from "socket.io";



function startSocketServer(server) {
    const io = new Server(server, { cors: { origin: '*' } })
    io.listen(4000);
    /*
     io.use((socket, next) => {
        if (socket.handshake.query) {
          let userId = socket.handshake.query?.userId;
    
          if (userId) socket.user = userId;
          next();
        }
      });
    */
    io.on('connection', async socket => {
        console.log("New client connected");
        socket.on("disconnect", () => {
        console.log("Client disconnected");
    });})

    
} 


