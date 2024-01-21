import { pool } from "config/db.js"
import express from "express"
import { begin, commit, createUser, deleteAllFromCart, deleteFromCart, getCart, getUserDetails, insertMissingOnes, rollback } from "./queries.js"
import { PostgresError } from "./types.js"
const router = express.Router()
const BASE_ROUTE = '/user'

const userDetails = [
    'name', 'email', 'phone_no', 'clg_name'
]

router.get('/:user_email', async (req,res)=>{
    const {user_email} = req.params
    try{
        const client = await pool.connect()
        const result = await client.query( getUserDetails, [user_email])
        return res.send({ data : result.rows ,"status":200})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

router.post('/', async (req,res)=>{
    const data = { ...req.body }
    const sql_arr = userDetails.map( prop => data[prop])
    try{
        const client = await pool.connect()
        await client.query(createUser,[...sql_arr])
            .then(()=>{
                client.release()
            })
        return res.send({"status":200})
    }catch(err) {
        if((err) && ((err as PostgresError).code === '23505'))
            return res.send({"status":409})
        return res.send({"status":500})
    }
})

router.get('/getCart/:user_id', async(req,res)=>{
    const { user_id } = req.params
    try{
        const client = await pool.connect()
        const result = await client.query(getCart,[user_id])
        return res.send({"status":200, data:result.rows})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

router.put('/updateCart/:user_id', async(req,res)=>{
    const { user_id } = req.params
    const { events_id } = req.body
    const client = await pool.connect()
    try{
        await client.query(begin);
        if(events_id.length == 0){
            await client.query(deleteAllFromCart,[user_id]);
        }else{
            await client.query(deleteFromCart,[user_id, events_id]);
            await client.query(insertMissingOnes,[user_id, events_id]);
        }
        await client.query(commit);
        return res.send({"status" : 200})
    }catch(err){
        await client.query(rollback);
        if((err) && ((err as PostgresError).code === '23503'))
            return res.send({"status":404})
        return res.send({"status":500})
    }
})

const MODULE = {
    router,
    BASE_ROUTE
}
export default MODULE;
