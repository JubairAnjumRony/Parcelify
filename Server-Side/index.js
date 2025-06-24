const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    // req.decoded = decoded;
    req.user = decoded;
    next();
  });
};

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uo8ft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = "mongodb://127.0.0.1";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const usersCollection = client.db("Percelify").collection("users");
    // await usersCollection.insertOne({anem:'rje',age:28,})
    const parcelCollection = client.db("Percelify").collection("parcels");
    const paymentCollection = client.db("Percelify").collection("payments");
    const feedbackCollection = client.db("Percelify").collection("feedback");

    // Generate jwt token
    app.post("/jwt", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // verify Admin

    const verifyAdmin = async (req, res, next) => {
      const email = req.user?.email;

      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "admin";

      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // save users to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const email = { email: user.email };
      const existingUser = await usersCollection.findOne(email);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // find Admin Email
    app.get("/users/admin/:email", async (req, res) => {
      const DatabaseSearchBox = { email: req.params.email };
      const user = await usersCollection.findOne(DatabaseSearchBox);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    //  find DeliveryMen Email:
    app.get("/users/deliveryMen/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let deliveryMen = false;
      if (user) {
        deliveryMen = user?.role === "deliveryMen";
      }
      res.send({ deliveryMen });
    });

    //Adding Parcels
    app.post("/parcels", async (req, res) => {
      const parcel = req.body;
      const result = await parcelCollection.insertOne(parcel);
      res.send(result);
    });
    // getting parcels
    app.get("/parcels", async (req, res) => {
      const parcels = await parcelCollection.find().toArray();
      res.send(parcels);
    });

    // get parcels by id
    app.get("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parcelCollection.findOne(query);
      res.send(result);
    });

    // myParcels
    app.get("/myParcels", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await parcelCollection.find(query).toArray();
      res.send(result);
    });

    // update Parcel
    app.patch("/parcels/:id", async (req, res) => {
      const parcel = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: parcel.name,
          email: parcel.email,
          phoneNumber: parcel.phoneNumber,
          parcelType: parcel.parcelType,
          parcelWeight: parcel.parcelWeight,
          receiverName: parcel.receiverName,
          receiverPhoneNumber: parcel.receiverPhoneNumber,
          deliveryAddress: parcel.deliveryAddress,
          requestedDeliveryDate: parcel.requestedDeliveryDate,
          deliveryAddressLatitude: parcel.deliveryAddressLatitude,
          deliveryAddressLongitude: parcel.deliveryAddressLongitude,
          bookingDate: parcel.bookingDate,
          price: parcel.price,
          status: "pending",
        },
      };
      const result = await parcelCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // delete parcel
    app.delete("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parcelCollection.deleteOne(query);
      res.send(result);
    });

    //make DeliveryMan
    app.patch(
      "/users/deliveryMen/:id",
      verifyToken,

      async (req, res) => {
        const id = req.params.id;
        const user = req.body;
        const query = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "deliveryMen",
          },
        };
        const result = await usersCollection.updateOne(query, updatedDoc);
        res.send(result);
      }
    );

    // Make Admin
    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };

        const result = await usersCollection.updateOne(query, updatedDoc);
        res.send(result);
      }
    );
//  Assigning DeliveryMan
    app.post("/deliveryAssign",async (req,res)=>{
      const {deliveryManId,parcelId,assignDate,status} = req.body;
      try{
        const result = await parcelCollection.updateOne({
          _id: new ObjectId(parcelId)},
        {
          $set: {
            deliveryManId,
            assignDate,
            status,
          },
        }
      )
        
      res.send(result);
      }
      catch(error){
        console.error("Errror assigning delivery",error);
      }

    
    })
  
    // handling search
    app.get('/allParcels', async(req,res)=>{
      try{
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const dateQuery = {};
        if(startDate && endDate){
          dateQuery.requestedDeliveryDate = {
               $gte: startDate,
                $lte:endDate,
          }
        };
        const result = await parcelCollection.find(dateQuery).toArray();
        res.send(result);
      }catch(error){
        console.error("Error Fetching Data",error);
        res.status(500).send("internal server Error");
      }
    })

    // DeliveryMenStat 
    app.get('/deliveryMenStat',async(req,res) =>{
      const deliveryMen = await usersCollection.find({role:'deliveryMen'}).toArray();
      const deliveryMenStats = await Promise.all(deliveryMen.map(async(deliveryMen)=>{
        const deliveryMenId = deliveryMen._id.toString();
        const parcelCount = await parcelCollection.countDocuments({
          deliveryManId: deliveryMenId,
          status:'delivered'
        });

        const reviews = await feedbackCollection.find({deliveryMenId}).toArray();
        const averageReview = reviews.length>0? 
        reviews.reduce((sum,review)=>sum+review.rating,0)/reviews.length : 0;

        return {
          name:deliveryMen.name,
          phoneNumber: deliveryMen.phoneNumber,
          parcelCount,
          averageReview
        }

      }))
    })
 

    // My DeliveryList for DeliveryMen
    app.get('/myDeliveryList',async(req,res) =>{
      const email = req.query?.email;
      const user = await usersCollection.findOne({email:email});
      const deliveryMenId = user._id.toString();
      const result = await parcelCollection.find({deliveryManId: deliveryMenId}).toArray();
      res.send(result);
    })    
 

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
