import {Client} from 'pg'
import { ENV } from './env'

export const postgresDB = new Client({
    host:ENV.DB.HOST,
    user:ENV.DB.USER,
    password:ENV.DB.PASSWORD,
    database:ENV.DB.NAME,
    port:ENV.DB.PORT,
})

export const connectDB = async() => {
    try{
        await postgresDB.connect()
        console.log("PostgreSQL connected Successfully")
    }catch(error) {
        console.log("PostgreSQL Connection Failed : ",error)
        process.exit(1)
    }
}