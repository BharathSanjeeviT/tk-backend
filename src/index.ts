import express from "express"
import { PORT } from "../config/port.js"
import Events from  "./events/index.js"
import Users from  "./user/index.js"
import Admin from  "./admin/index.js"
const app = express()

app.use(express.json())

app.use(Events.BASE_ROUTE,Events.router)
app.use(Users.BASE_ROUTE,Users.router)
app.use(Admin.BASE_ROUTE,Admin.router)

app.listen(PORT,()=>{
    console.log(`PORT RUNNING ON ${PORT}`)
})
