const mongoose=require('mongoose');
const MongoUrl = process.env.MONGODB_URI || 'mongodb+srv://testuser:test12345@cluster0.mtcedjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
const connectDB=async ()=>{
    try{
        await mongoose.connect(MongoUrl,{
            serverSelectionTimeoutMS:30000, //wait for 30 seconds for the server
            socketTimeoutMS:45000, //close the socket after 45s of inactivity
            maxPoolSize:10,//maintain up to socket 10 socket connections
            minPoolSize:5,//keep atleast 5 people active
            maxIdleTimeMS:30000,//close idle connections after 30s
            family:4,//use ipv4 
            tls:true, //explicitly enable tls
        });
        console.log('Database connected');
    }catch(err){
        console.log('DB connection failed',err);
        process.exit(1);
    }
};
module.exports=connectDB;