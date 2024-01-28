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

        const { roomName } = req.body;
        const { user_name } = req.body.user

        if(!/^\w+$/.test(roomName)){
            res.status(400).send("invalid roomName");
            return;
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const owner = await client.query(`SELECT * FROM rooms WHERE owner_id = $1`,[user.rows[0].id]);
        const rooms = await client.query(`SELECT * FROM rooms WHERE name = $1`,[roomName]);


        if (rooms.rows.length !== 0){

            res.status(403).send(`there is already room with name ${roomName}`);

        }else if (owner.rows.length !== 0){

            res.status(403).send("user already have room");

        }else{

            client.query(`INSERT INTO rooms(name,owner_id) VALUES($1,$2);`,[roomName,user.rows[0].id]);
            roomService.connect(req,res)

        }

    };
    
    async connect(req, res) {
        
        
        const { roomName } = req.body;
        const { user_name } = req.body.user

        const room = await client.query(`SELECT * FROM rooms WHERE name = $1`,[roomName]);


        if (room.rows.length === 0){
            res.status(404).send({message:"No such room"})

        }else if(room.rows[0].user_count === MAX_USER_IN_ROOM){
            res.status(403).send({message:"room is full"})
        }else{

            const user_id = (await client.query(`SELECT * FROM users WHERE user_name = $1`,[user_name])).rows[0].id;
            const room_id = room.rows[0].id;

            client.query("BEGIN")
            client.query(`INSERT INTO room_members(room_id,user_id) VALUES($1,$2)`, [room_id, user_id]);
            client.query(`UPDATE rooms SET user_count = $1 WHERE id = $2`,[room.rows[0].user_count + 1, room.rows[0].id])
            client.query("COMMIT")

            res.status(200).send({message:`you are at ${roomName}`})
        }
    };

    async disconnect(req, res){
        const { user_name } = req.body.user

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const user_id = user.rows[0].id
        const connection = await client.query(`SELECT * FROM room_members WHERE user_id = $1`, [user_id])
        const room = await client.query(`SELECT * FROM rooms WHERE id = $1`,[connection.rows[0].room_id]);

        client.query(`BEGIN`);
        client.query(`UPDATE rooms SET user_count = $1 WHERE id = $2`,[room.rows[0].user_count - 1, connection.rows[0].room_id]);
        client.query(`DELETE FROM room_members WHERE user_id = $1`, [user_id]);
        client.query(`COMMIT`);

        res.status(200).send({message:"you leaved room"});

    };

    async deleteRoomByOwner(req,res){
        const { user_name } = req.body.user;
        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name]);
        await client.query(`DELETE FROM rooms WHERE owner_id = $1;`, [user.rows[0].id]);
        
        res.status(200);
        // disconnect all users!!!!!!!!
    };

    async checkConnection(req,res){

        const {user_name} = req.body.user

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const connection = await client.query(`SELECT * FROM room_members WHERE user_id = $1`, [ user.rows[0].id])

        if (connection.rowCount === 0){
            res.status(404).send({message:"user is not connected"})
        }else{
            const room = await client.query(`SELECT * FROM rooms WHERE id = $1`, [connection.rows[0].room_id])
            res.status(200).send({message:`user is in ${room.rows[0].name}`, room:room.rows[0]})
        }
    };

    async getRoomByOwner(req, res){
        const { user_name } = req.body.user;
        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name]);
        const room = await client.query(`SELECT * FROM rooms WHERE owner_id = $1`, [user.rows[0].id]);
        if (room.rowCount === 1){
            res.status(200).send({room:room.rows[0]});
        }else{
            res.status(404).send({message:"User doesn't have a room"});
        }
    };
};

const roomService = new RoomService;
export default roomService