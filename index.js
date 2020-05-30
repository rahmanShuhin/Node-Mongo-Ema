const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express();
//middleware
app.use(cors());
app.use(bodyParser.json())
//database connection user and password
const user_db = process.env.USER_DB;
const pass_db = process.env.PASS_DB;
const uri = `mongodb+srv://${user_db}:${pass_db}@cluster0-kw21o.mongodb.net/test?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true });


//get the product by id
app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({ key }).toArray((err, documents) => {
            // console.log('Succesfuly inserted',result)
            res.send(documents[0]);
        })
        client.close();
    });

})
//get multiple product
app.post('/getProductsByKey', (req, res) => {
    //const key = req.params.key;
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            // console.log('Succesfuly inserted',result)
            res.send(documents);
        })
        client.close();
    });

})

//get data from mongodb
app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents) => {
            // console.log('Succesfuly inserted',result)
            res.send(documents);
        })
        client.close();
    });

})

//post product to database
app.post('/addProduct', (req, res) => {
    // console.log(req.body);
    //save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result) => {
            console.log('Succesfuly inserted', result)
            res.send(product);
        })
        client.close();
    });

})
//store customer order in database
app.post('/placeOrder', (req, res) => {
    // console.log(req.body);
    //save to database
    const orderDetail = req.body;
    orderDetail.orderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        collection.insertOne(orderDetail, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        })
        client.close();
    });

})
//server listen to port 5001
const port = process.env.PORT || 4200;
app.listen(port, () => console.log('listen to port ', port));