import {pool} from "config/db.js";
import express from "express"
import { Module } from "libs/utils/types/module";
import {allowIfPaid, updatePaid} from "./queries.js";

const router = express.Router()
const BASE_ROUTE = '/admin'

router.put('/payEvent/:user_id',async (req,res)=>{
    const { user_id } = req.params
    try{
        const client = await pool.connect()
        await client.query(updatePaid,[user_id])
            .then(()=>{
                client.release()
            })
        return res.send({"status":200})
    } catch(err) {
        console.log(err)
        return res.send({"status":500})
    }
})

router.put('/allow/:user_id', async (req,res)=>{
    const { user_id } = req.params
    const { event_id } = req.body
    try{
        const client = await pool.connect()
        const result = await client.query(allowIfPaid,[user_id,event_id])
        client.release()
        if(result.rows.length == 1)
            return res.send({"status":200})
        else
            return res.send({"status":401})
    } catch(err) {
        console.log(err)
        return res.send({"status":500})
    }
})

const MODULE : Module = {
    router,
    BASE_ROUTE
}
export default MODULE;
