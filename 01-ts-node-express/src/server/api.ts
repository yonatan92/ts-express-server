import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import log from '@ajar/marker';
import db from './db/mysql-connection';
import user_router from './modules/user/user-router';
import {env} from './utils/index'
import {error_handler,not_found} from './middleware/errors-handler';   

const PORT = Number(env('PORT'));
const HOST = env('HOST');


const app = express();

// middleware
app.use(cors());
app.use(morgan('dev'))

// routing
// app.use('/api/stories', story_router);
app.use('/api/users', user_router);
app.get('/',async (req,res,next)=>{
    res.status(200).json({show:'time'})
})
app.get('/items',async (req,res,next)=>{
    console.dir(db.query)
    db.query
    const postQueryString = `SELECT * FROM t1`;  

    const query = await db.query(postQueryString);

    res.status(200).json(query);
})

// central error handling
app.use(error_handler);

//when no routes were matched...
app.use('*', not_found);

//start the express api server
(async ()=> {
  await app.listen(PORT,HOST);
  log.magenta(`api is live on`,` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);  
})().catch(console.log)