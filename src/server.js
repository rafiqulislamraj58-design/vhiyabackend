import app from './app/app.js';
import { connectDB } from './config/db.js'
import 'dotenv/config'
await connectDB();
app.listen(4000,()=>{
console.log('app is  runing on server 4000')
})
