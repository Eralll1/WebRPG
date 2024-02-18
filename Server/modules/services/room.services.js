import  client  from "../db/index.js";

const MAX_USER_IN_ROOM = 10;


class RoomService {

    async init () {
        client.query("BEGIN");
        client.query(`
            CREATE TABLE IF NOT EXISTS rooms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(32) NOT NULL,
            user_count INT NOT NULL DEFAULT 0,
            owner_id SERIAL REFERENCES users(id) ON DELETE CASCADE
            );`);

        client.query(`
            CREATE TABLE IF NOT EXISTS room_members (
            id SERIAL PRIMARY KEY,
            room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
            user_id INT REFERENCES users(id) ON DELETE CASCADE
            );`);
        client.query("COMMIT");
    };

    async create(req, res){

        let room_name,user_name
        try{
            room_name = req.body.roomName;
            user_name = req.body.user.user_name
        }catch{
            res.status(400).send("incorrect data");
            return
        }
        

        if(!/^\w+$/.test(room_name)){
            res.status(400).send("invalid room_mame");
            return;
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const owner = await client.query(`SELECT * FROM rooms WHERE owner_id = $1`,[user.rows[0].id]);
        const rooms = await client.query(`SELECT * FROM rooms WHERE name = $1`,[room_name]);


        if (rooms.rows.length !== 0){
            res.status(403).send(`there is already room with name ${room_name}`);
            return
        }
        if (owner.rows.length !== 0){
            res.status(403).send("user already have room");
            return
        }

        client.query(`INSERT INTO rooms(name,owner_id) VALUES($1,$2);`,[room_name,user.rows[0].id]);
        roomService.connect(req,res)


    };
    
    async connect(req, res) {
        
        let room_name,user_name
        try{
            room_name = req.body.roomName;
            user_name = req.body.user.user_name
        }catch{
            res.status(400).send("incorrect data");
            return
        }

        const room = await client.query(`SELECT * FROM rooms WHERE name = $1`,[room_name]);


        if (room.rows.length === 0){
            res.status(404).send({message:"No such room"})
            return
        }

        if(room.rows[0].user_count === MAX_USER_IN_ROOM){
            res.status(403).send({message:"room is full"})
            return
        }


        const user_id = (await client.query(`SELECT * FROM users WHERE user_name = $1`,[user_name])).rows[0].id;
        const room_id = room.rows[0].id;

        client.query("BEGIN")
        client.query(`INSERT INTO room_members(room_id,user_id) VALUES($1,$2)`, [room_id, user_id]);
        client.query(`UPDATE rooms SET user_count = $1 WHERE id = $2`,[room.rows[0].user_count + 1, room.rows[0].id])
        client.query("COMMIT")

        res.status(200).send({roomName})
    };

    async disconnect(req, res){

        let user_name
        try{
            user_name = req.body.user.user_name
        }catch{
            res.status(400).send("incorrect data");
            return
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const user_id = user.rows[0].id

        const connection = await client.query(`SELECT * FROM room_members WHERE user_id = $1`, [user_id])

        const room = await client.query(`SELECT * FROM rooms WHERE id = $1`,[connection.rows[0].room_id]);

        client.query(`BEGIN`);
        client.query(`UPDATE rooms SET user_count = $1 WHERE id = $2`,[room.rows[0].user_count - 1, connection.rows[0].room_id]);
        client.query(`DELETE FROM room_members WHERE user_id = $1`, [user_id]);
        client.query(`COMMIT`);

        res.status(200);
    };

    async deleteRoomByOwner(req,res){

        let user_name
        try{
            user_name = req.body.user.user_name
        }catch{
            res.status(400).send("incorrect data");
            return
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name]);
        await client.query(`DELETE FROM rooms WHERE owner_id = $1;`, [user.rows[0].id]);
        
        res.status(200);
        // disconnect all users!!!!!!!!
    };

    async checkConnection(req,res){

        let user_name
        try{
            user_name = req.body.user.user_name
        }catch{
            res.status(400).send("incorrect data");
            return
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const connection = await client.query(`SELECT * FROM room_members WHERE user_id = $1`, [ user.rows[0].id])

        if (connection.rowCount === 0){
            res.status(404).send({message:"user is not connected"})
            return
        }
        
        const room = await client.query(`SELECT * FROM rooms WHERE id = $1`, [connection.rows[0].room_id])
        res.status(200).send({room:room.rows[0]})
        
    };

    async getRoomByOwner(req, res){

        let user_name
        try{
            user_name = req.body.user.user_name
        }catch{
            res.status(400).send("incorrect data");
            return
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name]);
        const room = await client.query(`SELECT * FROM rooms WHERE owner_id = $1`, [user.rows[0].id]);

        if (room.rowCount !== 1){
            res.status(404).send({message:"User doesn't have a room"});
            return
        }
        res.status(200).send({room:room.rows[0]});
    };

    async getUsersInRoom(req,res){
        let room_name
        try{
            room_name = req.body.roomName;
        }catch{
            res.status(400).send("incorrect data");
            return
        }
        const room = (await client.query(`SELECT * FROM rooms WHERE name = $1`,[room_name])).rows[0]
        // проверка наличия комнаты
        const users = (await client.query(`SELECT * FROM room_members WHERE room_id = $1`, [room.id])).rows 

        res.status(200).send(users)
    }
};

const roomService = new RoomService;
export default roomService