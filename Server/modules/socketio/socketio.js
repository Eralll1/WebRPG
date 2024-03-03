import { Server } from "socket.io";

const Rooms = {no_room:{}}

export function startSocketServer(server) {
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // ????????????
        methods: ["GET", "POST"]
}})
    io.listen(4000);

    /*
    io.use((socket, next) => {
      if (socket.handshake.query) {
        let userId = socket.handshake.query?.userId;
        if (userId) socket.user = userId;
        console.log(userId);
      next();
    }});
    */


    io.on("rooms_connection", async smth => {
      console.log("123");
      console.log(smth)
    })


    io.on('connection', async socket => {
      console.log("New client connected");
      console.log(socket.handshake.auth);
      socket.on("disconnect", () => {
        console.log("Client disconnected"); 
    })})


} 


