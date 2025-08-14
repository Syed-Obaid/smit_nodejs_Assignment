const express = require("express");

const app = express();
app.use(express.json());

const { allProduct } = require("./data");

app.get("/", (req, res) => {
  res.send(allProduct);
});

const user = true;
app.post("/addProduct", (req, res) => {
  if (user) {
    const product = req.body;
    allProduct.push(product);
    res.send({
      message: "Product Added successfully",
      addedProduct: product,
    });
  } else {
    res.status(401).send("product Added failed");
  }
});

app.put("/addProduct/:id", (req, res) => {
  if (user) {
    const index = parseInt(req.params.id);
    let updatedindex = allProduct.findIndex((p) => p.id === index);

    if (updatedindex === -1) {
      return res.status(404).send({ message: "Product not found" });
    }
    allProduct[updatedindex] = req.body;

    res.send({
      message: "Edit Successfully",
      updatedProduct: allProduct[updatedindex],
    });
  } else {
    res.status(401).send("Failed to Edit");
  }
});

app.delete("/addProduct/:id", (req, res) => {
  if (user) {
    const index = parseInt(req.params.id);
    const deleted = allProduct.findIndex((p) => p.id === index);
    if (deleted === -1) {
      return res.status(404).send({ message: "Product not found" });
    }
    const deleteProduct = allProduct.splice(deleted, 1);

    res.send({
      message: "Delete Successfully",
      deletedProduct: deleteProduct,
    });
  } else {
    res.status(401).send("Failed to Delete");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Running on localhost:${PORT}`);
});
