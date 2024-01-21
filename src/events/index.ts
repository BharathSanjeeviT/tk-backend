import express from "express"
import { Module } from "libs/utils/types/module";
import { pool } from "config/db.js"
import { Events, EventsHome } from "./types";
import { createEvent, deleteEvent, getAllEvents, getEventDetails, updateEvent } from "./queries.js";

const router = express.Router();
const BASE_ROUTE = "/events";

const eventProperties = [
      'name', 'description', 'tag_line', 'rules', 'img_link',
      'fee', 'date', 'team_size', 'youtube', 'instagram',
      'first_prize', 'second_prize', 'third_prize'
];

// To get all events in homepage
router.get("/",async (req,res)=>{
    try{
        const client = await pool.connect()
        const result = await client.query(getAllEvents)
        const events : Array<EventsHome> = result.rows
        client.release()
        return res.send({events,status})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

//To get specific event
router.get("/:id",async (req,res)=>{
    const { id } = req.params
    try{
        const client = await pool.connect()
        const result = await client.query(getEventDetails,[id])
        const events : Array<Events> = result.rows
        client.release()
        return res.send({events,"status":200})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

// To create a event
router.post('/',async(req,res)=>{
    try{
        const client = await pool.connect()
        const eventData = { ...req.body }
        const sql_arr = eventProperties.map(props => eventData[props])
        if(eventData.name){
            await client.query(createEvent, sql_arr)
            .then((data)=>{
                client.release()
            })
            return res.json({"status":200})
        }else return res.json({"status":400})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

//To delete a event
router.delete('/:id',async (req,res)=>{
    const { id } = req.params
    try{
        if(id) {
            const client = await pool.connect()
            await client.query(deleteEvent,[id])
            .then(()=>{
                client.release()
            })
            return res.send({"status":200})
        } else res.send({"status":400})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

// To update a event details
router.put("/:id", async (req,res)=>{
    const { id } = req.params
    try{
        const client = await pool.connect()
        const eventData = { ...req.body }
        const sql_arr = eventProperties.map(props => eventData[props])
        if(id){
            await client.query(updateEvent, [...sql_arr,id])
            .then((data)=>{
                client.release()
            })
            return res.json({"status":200})
        }else return res.json({"status":400})
    }catch(err){
        console.log(err)
        return res.send({"status":500})
    }
})

// router.put("/incharge/:id",(req,res)=>{
//     const { id } = req.params
//     try{
//
//     } catch(err){
//         console.log(err)
//         return res.send({"status":500})
//     }
// })

const MODULE : Module = {
    router,
    BASE_ROUTE
}
export default MODULE;
