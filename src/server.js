const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname, '/build')));
const PORT = 8000;
app.use(bodyParser.json())

const withDB = async (operations) => {
    try {
        const url = "mongodb+srv://JOHN:0995816060@cluster0.bfy6i.mongodb.net/JOHN?retryWrites=true&w=majority";
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    
            
        const db = client.db('JOHN')
       await  operations(db);

        client.close();  
        } catch (error) {
            res.status(500).json({message: 'Error connecting to db', error})
        }
}


app.get('/api/applicants', async (req, res) => {
    withDB(async (db) => {
        const applicantFirstName = "Alinafe"
        const result = await db.collection("applicants").find({}).toArray();
        res.status(200).json(result);      
   }, res)
    

})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})
app.listen(PORT, () => {
    console.log(` Server Listening on Port ${PORT}`)
})