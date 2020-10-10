const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const path = require('path');


const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, '/build')))
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
        const result = await db.collection("applicants").find({}).toArray();
        res.status(200).json(result);
    }, res)
});

app.get('/api/employer-request', async (req, res) => {
    withDB(async (db) => {
        const result = await db.collection("employerRequest").find({}).toArray();
        res.status(200).json(result);      
   }, res)
})




app.post('/api/applicants/:id', async (req, res) => {

    withDB(async (db) => {
        const { username, text } = req.body
        const applicantId = parseInt(req.params.id)
        const applicantInfo = await db.collection('applicants').findOne({ id: applicantId });
   
       await db.collection('applicants').updateOne({ id: applicantId },
            {
                '$set': {
                    recommendations: applicantInfo.recommendations.concat({ username, text }),
                },
            })
        const updatedApplicantInfo = await db.collection("applicants").findOne({ id: applicantId })
        res.status(200).json(updatedApplicantInfo);
    })
});

app.post('/api/employerRequest/:id', async (req, res) => {

    withDB(async (db) => {

        const employerRequestId = parseInt(req.params.id);
        const { employerName, phone, email, employerMessage, applicantSelected, applicantId } = req.body;
   
       await db.collection('employerRequest').insertOne({
           employerName,
           phone,
           email,
           employerMessage,
           applicantSelected,
           applicantId
         });
        const currentRequest = await db.collection("employerRequest").findOne({ applicantId: employerRequestId });
        res.status(200).json(currentRequest);
    })
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(PORT, () => {
    console.log(` Server Listening on Port ${PORT}`)
})




