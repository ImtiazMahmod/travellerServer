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
    const experienceCollection = database.collection("experience");
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

    ///load single blog
    app.get("/singleBlog/:id", async (req, res) => {
      const id = req.params.id;
      const blog = await blogsCollection.findOne({ _id: ObjectId(id) });
      res.send(blog);
    });

    ///update blog
    app.put("/singleBlog/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body.data;
      const filter = { _id: ObjectId(id) };

      const updateDoc = {
        $set: { data: data },
      };
      const result = await experienceCollection.updateOne(filter, updateDoc);
      res.json(result);
      console.log(result);
    });

    ///load specific tour spot experience
    app.get("/specificExperience", async (req, res) => {
      const title = req.query.title;
      const specificExperience = await experienceCollection
        .find({ title })
        .toArray();

      res.send(specificExperience);
    });

    ///add  experience
    app.post("/userExperience", async (req, res) => {
      const experience = req.body;

      const result = await experienceCollection.insertOne(experience);
      res.json(result);
    });

    ///load specific user experience
    app.get("/myExperience", async (req, res) => {
      const email = req.query.email;

      const myExperience = await experienceCollection
        .find({ email: email })
        .toArray();
      res.send(myExperience);
    });

    ///load specific user Blog
    app.get("/myBlog", async (req, res) => {
      const email = req.query.email;

      const myBlog = await blogsCollection.find({ email: email }).toArray();
      res.send(myBlog);
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

    ///load all experience
    app.get("/allExperience", async (req, res) => {
      const allExperience = await experienceCollection.find({}).toArray();
      res.send(allExperience);
    });

    ///update status
    app.put("/experience/", async (req, res) => {
      const id = req.query.id;
      const status = req.query.status;
      const filter = { _id: ObjectId(id) };

      const updateDoc = {
        $set: { status: status },
      };
      const result = await experienceCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    ///delete Experience
    app.delete("/deleteExperience/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deleteExperience = await experienceCollection.deleteOne(query);
      res.send(deleteExperience);
    });

    ///delete blog
    app.delete("/deleteBlog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blogDelete = await blogsCollection.deleteOne(query);
      res.send(blogDelete);
    });

    ///user create
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.json(result);
    });

    ///make admin
    app.put("/makeAdmin", async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updateDoc = {
        $set: {
          role: "Admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
      console.log(result);
    });

    ///check admin
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      console.log(email);
      const user = await usersCollection.findOne(filter);
      let isAdmin = false;
      if (user?.role === "Admin") {
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
