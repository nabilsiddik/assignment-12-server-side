const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 5000;

// const cookieParser = require('cookie-parser')

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://user-authentication-30262.firebaseapp.com",
    "https://user-authentication-30262.web.app",
  ],
  credentials: true,
  optionalSuccessStatus: 200,
};

// // Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3u9wf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// verify token
// const verifyToken = (req, res, next) => {
//     const token = req.cookies?.token
//     if(!token){
//         return res.status(401).send({message: 'unauthorize access'})
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
//         if(err){
//             return res.status(401).send({message: 'unauthorize access'})
//         }

//         req.user = decoded
//     })

//     next()
// }

async function run() {
  try {
    // await client.connect();

    const userCollection = client.db("assignment-12").collection("users");
    const plantCollection = client.db("assignment-12").collection("plants");

    // generate jwt
    // app.post('/jwt', async(req, res) => {
    //     const email = req.body
    //     // create token
    //     const token = jwt.sign(email, process.env.SECRET_KEY, {
    //         expiresIn:'365d'
    //     })

    //     // console.log(token)
    //     res.cookie('token', token, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === 'production',
    //         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    //     }).send({success: true})

    // })

    // logout or clear cookie from browser
    // app.get('/logout', async(req, res) => {
    //     res.clearCookie('token', {
    //         maxAge: 0,
    //         secure: process.env.NODE_ENV === 'production',
    //         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    //     })
    //     .send({success: true})
    // })

    app.get("/", (req, res) => {
      res.send("Servicer is running perfectly");
    });

    // User related APIs
    // Post users
    app.post("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email };

      const isExist = await userCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }

      const result = await userCollection.insertOne({
        ...user,
        role: "customer",
        timeStamp: Date.now(),
      });
      res.send(result);
    });

    // Plants related api
    // Post plant
    app.post("/plants", async (req, res) => {
      const plant = req.body;
      const result = await plantCollection.insertOne(plant);
      res.send(result);
    });



    // get all plants
    app.get("/plants", async (req, res) => {
      const result = await plantCollection.find().toArray();
      res.send(result);
    });

    // get plants by id
    app.get("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantCollection.findOne(query);
      res.send(result);
    });

    // Get all users
    // app.get('/users', async (req, res) => {
    //     const result = await userCollection.find().toArray()
    //     res.send(result)
    // })

    // Tutorial Related APIs
    // Post tutorial
    // app.post('/tutorials', async (req, res) => {
    //     const tutorial = req.body

    //     // distructure tutor info from tutorial
    //     const {
    //         tutorName,
    //         tutorEmail,
    //         tutorImage,
    //         language,
    //         description,
    //         review,
    //         price
    //     } = tutorial

    //     tutor = {
    //         tutorName,
    //         tutorEmail,
    //         tutorImage,
    //         language,
    //         description,
    //         review,
    //         price
    //     }

    //     const result = await tutorialCollection.insertOne(tutorial)

    //     const tutorResult = await tutorCollection.insertOne(tutorial)
    //     res.send(result)
    // })

    // // Get all tutorials
    // app.get('/tutorials', async (req, res) => {
    //     const result = await tutorialCollection.find().toArray()
    //     res.send(result)
    // })

    // // Get tutorial of a specific id
    // app.get('/tutorials/:id', async (req, res) => {
    //     const id = req.params.id
    //     const query = { _id: new ObjectId(id) }
    //     const result = await tutorialCollection.findOne(query)
    //     res.send(result)
    // })

    // // Get tutorial based on specific email
    // app.get('/my-tutorials', verifyToken, async (req, res) => {
    //     const decodedEmail = req.user?.email
    //     const email = req.query.email

    //     if(decodedEmail !== email){
    //         return res.status(401).send({message: 'unauthorize access'})
    //     }

    //     const query = { tutorEmail: email }

    //     const result = await tutorialCollection.find(query).toArray()

    //     res.send(result)
    // })

    // // Delete tutorial of specific id
    // app.delete('/delete-tutorial/:id', async (req, res) => {
    //     const id = req.params.id
    //     const query = { _id: new ObjectId(id) }

    //     const result = await tutorialCollection.deleteOne(query)

    //     res.send(result)
    // })

    // // update tutorial of specific id
    // app.patch('/update-tutorial/:id', async (req, res) => {
    //     const id = req.params.id
    //     const updateFields = req.body
    //     const query = { _id: new ObjectId(id) }
    //     const option = { upsert: true }
    //     const update = {
    //         $set: updateFields
    //     }

    //     const result = await tutorialCollection.updateOne(query, update, option)

    //     res.send(result)
    // })

    // Tutor related APIs
    // Get all tutors
    // app.get('/tutors', async (req, res) => {
    //     const result = await tutorCollection.find().toArray()
    //     res.send(result)
    // })

    // // Get tutor of a specific id
    // app.get('/tutor/:id', async (req, res) => {
    //     const id = req.params.id
    //     const query = { _id: new ObjectId(id) }
    //     const result = await tutorCollection.findOne(query)
    //     res.send(result)
    // })

    // // Get tutor of a specific category
    // app.get('/tutors/:languageName', async (req, res) => {
    //     const languageCategory = req.params.languageName
    //     const query = { language: languageCategory }
    //     const result = await tutorCollection.find(query).toArray()
    //     res.send(result)
    // })

    // // Post booked tutors
    // app.post('/booked-tutors', async (req, res) => {
    //     const bookedTutor = req.body
    //     const result = await bookedTutorsCollection.insertOne(bookedTutor)
    //     res.send(result)
    // })

    // // get booked tutors
    // app.get('/booked-tutors', async (req, res) => {
    //     const result = await bookedTutorsCollection.find().toArray()
    //     res.send(result)
    // })

    // // Get booked tutorial of specific user
    // app.get('/my-booked-tutors', verifyToken, async (req, res) => {
    //     const decodedEmail = req.user?.email
    //     const email = req.query.email

    //     if(decodedEmail !== email){
    //         return res.status(401).send({message: 'unauthorize access'})
    //     }

    //     const query = { email: email }

    //     const result = await bookedTutorsCollection.find(query).toArray()

    //     res.send(result)
    // })

    // // update review of specific id
    // app.post('/my-booked-tutors/:id', async (req, res) => {
    //     const tutor = req.body
    //     const id = tutor.tutorId
    //     const query = { tutorId: id }

    //     const bookedTutor = await bookedTutorsCollection.findOne(query)

    //     let newCount = 0
    //     if (bookedTutor.review) {
    //         newCount = bookedTutor.review + 1
    //     } else {
    //         newCount = 1
    //     }

    //     // Update the review info in booked tutor
    //     const filter = { tutorId: id }
    //     const updatedDoc = {
    //         $set: {
    //             review: newCount
    //         }
    //     }

    //     const updateResult = await bookedTutorsCollection.updateOne(filter, updatedDoc)

    //     // console.log(bookedTutor, id)
    //     res.send(updateResult)
    // })

    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
