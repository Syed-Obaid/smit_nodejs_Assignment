const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());

const uri =
  "mongodb://syedobaidullah1:obaid123@ac-xj7j4si-shard-00-00.bl7w47p.mongodb.net:27017,ac-xj7j4si-shard-00-01.bl7w47p.mongodb.net:27017,ac-xj7j4si-shard-00-02.bl7w47p.mongodb.net:27017/?replicaSet=atlas-4weuct-shard-0&ssl=true&authSource=admin";

const client = new MongoClient(uri);
const dbname = "todoApp";
let collection;

const data = [
  { name: "obaid", age: 23, email: "obaid@example.com" },
  { name: "john", age: 30, email: "john@example.com" },
  { name: "jane", age: 25, email: "jane@example.com" },
];

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db(dbname);
    collection = db.collection("todos");

    const count = await collection.countDocuments();
    if (count === 0) {
      const insertData = await collection.insertMany(data);
      console.log(`Inserted ${insertData.insertedCount} documents`);
    } else {
      console.log("Collection already has data, skipping inserts.");
    }
    return 'done.';
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}
main()

app.get("/todos", async (req, res) => {
  try {
    if (!collection) return res.status(500).send("Database not connected yet");
    const todos = await collection.find({}).toArray();
    res.send(todos);
  } catch (err) {
    res.status(500).send("Error fetching todos");
  }
});

app.post("/todos", async (req, res) => {
  try {
    if (!collection) return res.status(500).send("Database not connected yet");
    const newTodo = req.body;
    const result = await collection.insertOne(newTodo);
    res.send(result);
  } catch (err) {
    res.status(500).send("Error creating todo");
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    if (!collection) return res.status(500).send("Database not connected yet");
    const id = req.params.id;
    const updatedTodo = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTodo }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send("Error updating todo");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    if (!collection) return res.status(500).send("Database not connected yet");
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    res.status(500).send("Error deleting todo");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
