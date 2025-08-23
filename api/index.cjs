const express = require('express')
const cors = require('cors')
const app = express();
const PORT = 5000 || 8080;


app.use(cors(
{
    origin: 'http://localhost:5174',
    methods: ['POST'],
    credentials: true
}
));

app.use(express.json())

// Register Handler
app.post('/api/register',(req, res)=>{
    res.json('test ok!');
});

app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}`)
});