const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

///database connection
const uri = `mongodb+srv://${process.env.Traveller_USER}:${process.env.Traveller_PASS}@cluster0.zbwte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();

    const database = client.db("traveller");

    const blogsCollection = database.collection("blogs");
    const ordersCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    ///add blog
    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;

      const result = await blogsCollection.insertOne(newBlog);
      res.json(result);
    });

    ///load all blogs
    app.get("/blogs", async (req, res) => {
      const blogs = await blogsCollection.find({}).toArray();
      res.send(blogs);
    });

    ///load single bikes
    app.get("/singleBlog/:id", async (req, res) => {
      const id = req.params.id;
      const blog = await blogsCollection.findOne({ _id: ObjectId(id) });
      res.send(blog);
    });

    ///add order
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;

      const result = await ordersCollection.insertOne(newOrder);
      res.json(result);
    });

    ///load specific user Orders
    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;

      const myOrders = await ordersCollection.find({ email: email }).toArray();
      res.send(myOrders);
    });

    ///review post
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    ///load review
    app.get("/review", async (req, res) => {
      const reviews = await reviewCollection.find({}).toArray();
      res.send(reviews);
    });

    ///load all orders
    app.get("/allOrders", async (req, res) => {
      const allOrders = await ordersCollection.find({}).toArray();
      res.send(allOrders);
    });

    ///update status
    app.put("/orders/", async (req, res) => {
      const id = req.query.id;
      const status = req.query.status;

      const filter = { _id: ObjectId(id) };

      const updateDoc = {
        $set: { status: status },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    ///delete order
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orderDelete = await ordersCollection.deleteOne(query);
      res.send(orderDelete);
    });

    ///load all bike
    app.get("/bikes", async (req, res) => {
      const allOrders = await blogsCollection.find({}).toArray();
      res.send(allOrders);
    });

    ///delete bike
    app.delete("/deleteBlog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blogDelete = await blogsCollection.deleteOne(query);
      res.send(blogDelete);
    });

    ///user create
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    ///make admin
    app.put("/makeAdmin", async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    ///check admin
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const user = await usersCollection.findOne(filter);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Connected");
});

app.listen(port, () => {
  console.log(`port connected`, port);
});
