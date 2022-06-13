import pkg from 'pg';
const { Client } = pkg;
import {users} from './users.mjs';


async function boocle()
{
    for(const obj of users)
        {
            let id = obj.id;
            let uname = obj.username;
            let pwd = obj.password;
            let mail = obj.email;
            let created = obj.createdOn;
            let last_login = obj.lastLogin;

            try{
                await client.query(
                    `INSERT INTO users (user_id, username, password, email, created_on, last_login) 
                    VALUES ($1, $2, $3, $4, $5, $6);`,
                    [id, uname, pwd, mail, created, last_login]
                );
            }
            catch(err){
                console.log('erreur');
                console.log(err);
            }
        }
}


const client = new Client({
    host: '127.0.0.1',
    user: 'lokkeroom_admin',
    database: 'lokkeroom_db',
    password: 'bonjour',
    port: 5432,
})

const execute = async (query) => {
    try {
        await client.connect();     // gets connection
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await boocle()
        await client.end();         // closes connection
    }
};

const text = `
    CREATE TABLE IF NOT EXISTS "users" (
        user_id serial PRIMARY KEY,
	    username VARCHAR ( 50 ) UNIQUE NOT NULL,
	    password VARCHAR ( 50 ) NOT NULL,
	    email VARCHAR ( 255 ) UNIQUE NOT NULL,
	    created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP 
);`;

execute(text).then(result => {
    if (result) {
        console.log('Table created');
        
    }
});