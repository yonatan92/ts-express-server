/* 
  if there is an error thrown in the DB, asyncMiddleware
  will pass it to next() and express will handle the error */
import raw from "../../middleware/route-async-wrapper";
import db from "../../db/mysql-connection";
import {OkPacket,RowDataPacket} from "mysql2/promise";
import express, { Request,Response } from "express";
import log from "@ajar/marker";

const router = express.Router();

// parse json req.body on post routes
router.use(express.json());

// CREATES A NEW USER
router.post("/",raw(async (req:Request, res:Response) => {
    log.obj(req.body, "create a user, req.body:");
    const sql = `INSERT INTO users SET ?`;
    const results = await db.query(sql, req.body);
    const result:OkPacket = results[0] as OkPacket;
    const ok = {status:200,message:`User Created successfully`};
    const fail = {status:404,message:`Error in creating user `};
    const {status,message } = result.affectedRows  ? ok : fail;
    res.status(status).json({message,result});
  })
);

// GET ALL USERS
router.get("/",raw(async (req:Request, res:Response) => {
    // const sql = `
    // SELECT first_name, last_name, email, phone
    // FROM users
    // ORDER BY last_name asc;`;
    const sql = `SELECT * FROM users`;
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  })
);

router.get('/paginate/:page?/:items?', raw( async(req:Request, res:Response)=> {

  log.obj(req.params, "paginate, req.params:");
  let { page = '0' ,items = '10' } = req.params;

//   const users = await user_model.find()
//                 .select(`first_name last_name email phone`)
//                 .limit(parseInt(items))
//                 .skip(parseInt(page * items))

    const sql = `
      SELECT * FROM users 
      LIMIT ${parseInt(items)} 
      OFFSET ${parseInt(page) * parseInt(items)}`;
    const [rows] = await db.query(sql);
    res.status(200).json(rows);   

}))


// GETS A SINGLE USER
router.get("/:id",raw(async (req:Request, res:Response) => {
    const sql = `SELECT * FROM users WHERE id = '${req.params.id}'`;
    const results:RowDataPacket = await db.query(sql) as RowDataPacket;
    const user = results[0][0][0][0] = await db.query(sql);
    if (!user) {
       res.status(404).json({ message: `No user found. with id of ${req.params.id}` });
       return
    }
    res.status(200).json(results);
  })
);
// UPDATES A SINGLE USER
router.put("/:id",raw(async (req:Request, res:Response) => { 
    const updates =  Object.entries(req.body).map(([key])=>`${key}=?`) 
    const sql = `UPDATE users SET ${updates} WHERE id='${req.params.id}'`;
    // log.yellow(sql);
    const results = await db.query(sql, Object.values(req.body));
    const result:OkPacket = results[0] as OkPacket;
    const ok = {status:200,message:`User ${req.params.id} updated successfully`};
    const fail = {status:404,message:`Error in updating user ${req.params.id}`};
    const {status,message} = result.affectedRows ? ok : fail;
    res.status(status).json({message});
  })
);

// const result = await db.query(
//   `UPDATE programming_languages 
//   SET first_name=?, last_name=?, email=?, phone=? 
//   WHERE id=?`, 
//   [ 
//     'Roger', 'Rabbit', 'roger@rabbit.io', '+972-54-4869-722',
//     'b8ba2a9c-9dc2-11eb-82c9-00e270875516'
//   ]
// );



// DELETES A USER
router.delete("/:id",raw(async (req:Request, res:Response) => {
    var sql = `DELETE FROM users WHERE id=?`;
    const results = await db.query(sql, [req.params.id]);
    const result:OkPacket = results[0] as OkPacket;
    const ok = {status:200,message:`User ${req.params.id} deleted successfully`};
    const fail = {status:404,message:`Error in deleting user ${req.params.id}`};
    const {status,message} = result.affectedRows ? ok : fail;
    res.status(status).json({message});
  })
);

export default router;
