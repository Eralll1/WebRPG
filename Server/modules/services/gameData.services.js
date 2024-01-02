
import  client  from "../db/index.js";

const ADMINKEY = "admin_key";

class GameDataService{
    async init_const () {

        this._init_file = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) NOT NULL,
                path VARCHAR(255) NOT NULL,
                size INT NOT NULL
                );`)
        };
        this._init_model = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS models (
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) NOT NULL,
                file_id INT,
                FOREIGN KEY (file_id) REFERENCES files (id)
                );`)
        };
        this._init_entity = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS entities(
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) NOT NULL,
                model_id INT,
                FOREIGN KEY (model_id) REFERENCES models (id)
                );`)
        };
        this._init_character = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS entities(
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) NOT NULL,
                model_id INT,
                FOREIGN KEY (model_id) REFERENCES models (id)
                );`)
        };
        this._init_status = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS statutes(
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) NOT NULL,
                description TEXT
                );`)
        };
        this._init_effect = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS effects(
                id SERIAL PRIMARY KEY,
                damage INT NOT NULL,
                status_id INT,
                FOREIGN KEY (status_id) REFERENCES statutes (id)
                );`)
        };
        this._init_characteristics = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS characteristics(
                id SERIAL PRIMARY KEY,
                description TEXT NOT NULL,
                amount INT NOT NULL
                );`)
        };
        this._init_skill = async ()=>{
            client.query(`
                CREATE TABLE IF NOT EXISTS effects(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                file_id INT NOT NULL,
                effect_id INT,
                FOREIGN KEY (effect_id) REFERENCES effects (id),
                FOREIGN KEY (file_id) REFERENCES files (id)
                );`)
        };
        client.query("BEGIN")
        this._init_file();
        this._init_model();
        this._init_entity();
        this._init_character();
        this._init_status();
        this._init_effect();
        this._init_characteristics();
        this._init_skill();
        client.query("COMMIT")
        };

    async admin_add(adminKey,tableName, data){
        if (adminKey !== ADMINKEY){
            return "wrong key!"
        } else{

            let res = "";
            data.forEach(element => {
                
                res += element.toString()
                res += ","
            });
            if (res.length !== 0){
                res = res.slice(0,res.length -1)
            }


            return await client.query(`INSERT INTO $1 VALUES ($2)`,
                                [tableName,res]
                                )
        }
    };

    async admin_remove(adminKey,tableName, id){
        if (adminKey !== ADMINKEY){
            return "wrong key!"
        } else{

            return await client.query(`DELETE FROM $1 WHERE id = $2;`,[tableName,id])
        }
    };

}

export default new GameDataService()

/*
Герой:
    - Существо
    - характеристики
    - способность
    - предмет
    - пользователь
*/