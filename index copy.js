const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Serve ShopVistaHQ as the homepage
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "ShopvistaHQ", "index.html"),
        (err) => {
            if (err) {
                console.error("Homepage error:", err);
                res.status(500).send("Homepage file could not be loaded.");
            }
        }
    );
});

// Serve ShopVistaHQ pages and assets from the root URL
app.use(express.static(path.join(__dirname, "ShopvistaHQ")));

// Serve project files
app.use(express.static(__dirname));

// Serve ShopVistaHQ files and assets
app.use("/shopvistaHQ", express.static(path.join(__dirname, "ShopvistaHQ")));




// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "ShopvistaHQ", "assets", "images"));
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage });

// JSON file paths
const cartFile = "./cart.json";
const SALES_FILE = "./sales.json";
const deliveryFile = "./delivery.json";


// ------------------ ROUTES ------------------ //
const dataFiles = [
  "phone.json",
  "computer.json",
  "appliance.json",
  "otherpi.json",
  "otherp.json",
  "electrical.json",
  "chandelier.json",
  "buildingmat.json",
  "electronics.json",
  "accessories.json"
];

// Search route
app.get("/search", async (req, res) => {
  const query = req.query.query?.toLowerCase() || "";

  try {
    let results = [];

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, file); // adjust folder if needed
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        // Search in each item
        const matched = data.filter(item =>
          item.pModel.toLowerCase().includes(query)
        );
        results = results.concat(matched);
      }
    }

    res.json(results); // return all matches across all files
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



app.post("/sales", async (req, res) => {
  let sales = [];

  if (fs.existsSync("sales.json")) {
    sales = JSON.parse(
      await fs.promises.readFile("sales.json", "utf8")
    );
  }

  sales.push(req.body);

  await fs.promises.writeFile(
    "sales.json",
    JSON.stringify(sales, null, 2)
  );

  res.json({ message: "Sale recorded" });
});


app.get("/sales", (req, res) => {
  res.sendFile(path.join(__dirname, "cart.json"));
});
app.get("/cart/:orderId",  (req, res)=> {
    const cartFile = path.join(__dirname, "cart.json")
    const cart = JSON.parse(fs.readFileSync(cartFile,"utf8"))

    const phona = cart.find( ph => ph.orderId === String(req.params.orderId))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})


// ---- PAYMENT SUCCESS → SALES + CUSTOMERS ----
app.post("/payment-success", (req, res) => {
  const { name, email, phone, address, amount, deliveryFee, vat, total } = req.body;

  // ---- SALES ----
  let sales = fs.existsSync("sales.json") ? JSON.parse(fs.readFileSync("sales.json", "utf8")) : [];
  const order = {
    orderId: "ORD-" + Date.now(),
    name, email, phone, address, amount, deliveryFee, vat, total,
    date: new Date().toLocaleDateString()
  };
  sales.push(order);
  fs.writeFileSync("sales.json", JSON.stringify(sales, null, 2));

  // ---- CUSTOMERS ----
  let customers = fs.existsSync("customers.json") ? JSON.parse(fs.readFileSync("customers.json", "utf8")) : [];
  const nextId = customers.length === 0
    ? "#00101"
    : `#${String(parseInt(customers[customers.length - 1].clientId.replace("#", "")) + 1).padStart(5, "0")}`;
  const customer = { clientId: nextId, name, email, phone, address };
  customers.push(customer);
  fs.writeFileSync("customers.json", JSON.stringify(customers, null, 2));

  res.json({ success: true });
});

// ---- GET ALL CUSTOMERS ----
app.get("/customers", (req, res) => {
  if (!fs.existsSync("customers.json")) return res.json([]);
  const customers = JSON.parse(fs.readFileSync("customers.json", "utf8"));
  res.json(customers);
});

// Get all cart orders
app.get("/api/cart", (req, res) => {
    let cart = [];
    if (fs.existsSync(cartFile)) {
        const data = fs.readFileSync(cartFile, "utf8");
        if (data) cart = JSON.parse(data);
    }
    res.json(cart); // newest orders first
});
// Get all cart orders
app.get("/api/pay/:orderId", (req, res) => {
    let cart = [];
    if (fs.existsSync(cartFile)) {
        const data = fs.readFileSync(cartFile, "utf8");
        if (data) cart = JSON.parse(data);
    }
    res.json(cart); // newest orders first
});

// Mark order as paid → move to sales.json
app.post("/api/pay/:orderId", (req, res) => {
    const orderId = String(req.params.orderId);

    let cart = [];
    let sales = [];

    // Load cart safely
    if (fs.existsSync(cartFile)) {
        const data = fs.readFileSync(cartFile, "utf8");
        if (data) cart = JSON.parse(data);
    }

    // Load sales safely
    if (fs.existsSync(SALES_FILE)) {
        const data = fs.readFileSync(SALES_FILE, "utf8");
        if (data) sales = JSON.parse(data);
    }

    // Find order
    const index = cart.findIndex(item => String(item.orderId) === orderId);
    if (index === -1) return res.status(404).json({ message: "Order not found" });

    // Move to sales
    const paidOrder = cart.splice(index, 1)[0];
    sales.push(paidOrder);

    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));
    fs.writeFileSync(SALES_FILE, JSON.stringify(sales, null, 2));

    res.json({ success: true, message: "Order paid and moved to sales" });
});




app.get("/shopvistaHQ/computer",  (req, res)=> {
    const computerFile = path.join(__dirname, "computer.json")
    const datah = JSON.parse(fs.readFileSync(computerFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/computer/:id",  (req, res)=> {
    const computerFile = path.join(__dirname, "computer.json")
    const phone = JSON.parse(fs.readFileSync(computerFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/computer/:id", upload.single("image"), (req, res) => {
  const computerFile = path.join(__dirname, "computer.json");
  const computer = JSON.parse(fs.readFileSync(computerFile, "utf-8"));

  const index = computer.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = computer[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  computer[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(computer, null, 2)

  fs.writeFileSync(computerFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});



app.get("/shopvistaHQ/accessories",  (req, res)=> {
    const accessoriesFile = path.join(__dirname, "accessories.json")
    const datah = JSON.parse(fs.readFileSync(accessoriesFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/accessories/:id",  (req, res)=> {
    const accessoriesFile = path.join(__dirname, "accessories.json")
    const phone = JSON.parse(fs.readFileSync(accessoriesFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/accessories/:id", upload.single("image"), (req, res) => {
  const accessoriesFile = path.join(__dirname, "accessories.json");
  const accessories = JSON.parse(fs.readFileSync(accessoriesFile, "utf-8"));

  const index = accessories.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = accessories[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  accessories[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(accessories, null, 2)

  fs.writeFileSync(accessoriesFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});



app.get("/shopvistaHQ/electronics",  (req, res)=> {
    const electronicsFile = path.join(__dirname, "electronics.json")
    const datah = JSON.parse(fs.readFileSync(electronicsFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/electronics/:id",  (req, res)=> {
    const electronicsFile = path.join(__dirname, "electronics.json")
    const phone = JSON.parse(fs.readFileSync(electronicsFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/electronics/:id", upload.single("image"), (req, res) => {
  const electronicsFile = path.join(__dirname, "electronics.json");
  const electronics = JSON.parse(fs.readFileSync(electronicsFile, "utf-8"));

  const index = electronics.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = electronics[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  electronics[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(electronics, null, 2)

  fs.writeFileSync(electronicsFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});




app.get("/shopvistaHQ/buildingmat",  (req, res)=> {
    const buildingmatFile = path.join(__dirname, "buildingmat.json")
    const datah = JSON.parse(fs.readFileSync(buildingmatFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/buildingmat/:id",  (req, res)=> {
    const buildingmatFile = path.join(__dirname, "buildingmat.json")
    const phone = JSON.parse(fs.readFileSync(buildingmatFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/buildingmat/:id", upload.single("image"), (req, res) => {
  const buildingmatFile = path.join(__dirname, "buildingmat.json");
  const buildingmat = JSON.parse(fs.readFileSync(buildingmatFile, "utf-8"));

  const index = buildingmat.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = buildingmat[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  buildingmat[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(buildingmat, null, 2)

  fs.writeFileSync(buildingmatFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});



app.get("/shopvistaHQ/chandelier",  (req, res)=> {
    const chandelierFile = path.join(__dirname, "chandelier.json")
    const datah = JSON.parse(fs.readFileSync(chandelierFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/chandelier/:id",  (req, res)=> {
    const chandelierFile = path.join(__dirname, "chandelier.json")
    const phone = JSON.parse(fs.readFileSync(chandelierFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/chandelier/:id", upload.single("image"), (req, res) => {
  const chandelierFile = path.join(__dirname, "chandelier.json");
  const chandelier = JSON.parse(fs.readFileSync(chandelierFile, "utf-8"));

  const index = chandelier.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = chandelier[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  chandelier[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(chandelier, null, 2)

  fs.writeFileSync(chandelierFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});




app.get("/shopvistaHQ/electrical",  (req, res)=> {
    const electricalFile = path.join(__dirname, "electrical.json")
    const datah = JSON.parse(fs.readFileSync(electricalFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/electrical/:id",  (req, res)=> {
    const electricalFile = path.join(__dirname, "electrical.json")
    const phone = JSON.parse(fs.readFileSync(electricalFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/electrical/:id", upload.single("image"), (req, res) => {
  const electricalFile = path.join(__dirname, "electrical.json");
  const electrical = JSON.parse(fs.readFileSync(electricalFile, "utf-8"));

  const index = electrical.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = electrical[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  electrical[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(electrical, null, 2)

  fs.writeFileSync(electricalFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});

app.get("/shopvistaHQ/phone",  (req, res)=> {
    const phoneFile = path.join(__dirname, "phone.json")
    const datah = JSON.parse(fs.readFileSync(phoneFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/phone/:id",  (req, res)=> {
    const phoneFile = path.join(__dirname, "phone.json")
    const phone = JSON.parse(fs.readFileSync(phoneFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/phone/:id", upload.single("image"), (req, res) => {
  const phoneFile = path.join(__dirname, "phone.json");
  const phone = JSON.parse(fs.readFileSync(phoneFile, "utf-8"));

  const index = phone.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = phone[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  phone[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(phone, null, 2)

  fs.writeFileSync(phoneFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});

app.get("/shopvistaHQ/appliance",  (req, res)=> {
    const applianceFile = path.join(__dirname, "appliance.json")
    const datah = JSON.parse(fs.readFileSync(applianceFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/appliance/:id",  (req, res)=> {
    const applianceFile = path.join(__dirname, "appliance.json")
    const phone = JSON.parse(fs.readFileSync(applianceFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/appliance/:id", upload.single("image"), (req, res) => {
  const applianceFile = path.join(__dirname, "appliance.json");
  const appliance = JSON.parse(fs.readFileSync(applianceFile, "utf-8"));

  const index = appliance.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = appliance[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  appliance[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(appliance, null, 2)

  fs.writeFileSync(applianceFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});






app.get("/shopvistaHQ/otherp",  (req, res)=> {
    const otherpFile = path.join(__dirname, "otherp.json")
    const datah = JSON.parse(fs.readFileSync(otherpFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/otherp/:id",  (req, res)=> {
    const otherpFile = path.join(__dirname, "otherp.json")
    const phone = JSON.parse(fs.readFileSync(otherpFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/otherp/:id", upload.single("image"), (req, res) => {
  const otherpFile = path.join(__dirname, "otherp.json");
  const otherp = JSON.parse(fs.readFileSync(otherpFile, "utf-8"));

  const index = otherp.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = otherp[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2", "imageUrl0", "imageUrl1", "imageUrl2", "imageUrl3"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  otherp[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(otherp, null, 2)

  fs.writeFileSync(otherpFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});

app.get("/shopvistaHQ/otherpi",  (req, res)=> {
    const otherpiFile = path.join(__dirname, "otherpi.json")
    const datah = JSON.parse(fs.readFileSync(otherpiFile, "utf8"))
    res.json(datah)
})
app.get("/shopvistaHQ/otherpi/:id",  (req, res)=> {
    const otherpiFile = path.join(__dirname, "otherpi.json")
    const phone = JSON.parse(fs.readFileSync(otherpiFile,"utf8"))

    const phona = phone.find( ph => ph.id === Number(req.params.id))

    if(!phona){
        return res.status(404).json({message: 'Product Not Found'})
    }
    res.status(200).json(phona)
})

app.put("/shopvistaHQ/otherpi/:id", upload.single("image"), (req, res) => {
  const otherpiFile = path.join(__dirname, "otherpi.json");
  const otherpi = JSON.parse(fs.readFileSync(otherpiFile, "utf-8"));

  const index = otherpi.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const oldProduct = otherpi[index];

  const allowedFields = ["pName","pModel", "pBrand", "about", "prize", "rView", "desc", "desc2"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] && req.body[field] !== "") {
      updates[field] =
        field === "prize" ? Number(req.body[field]) : req.body[field];
    }
  });

  // ✅ If new image uploaded → delete old image
  if (req.file) {
    if (oldProduct.imageUrl) {
      const oldPath = path.join(__dirname, oldProduct.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    updates.imageUrl = `assets/images/${req.file.filename}`;
  }

  otherpi[index] = {
    ...oldProduct,
    ...updates
  };
  const jData = JSON.stringify(otherpi, null, 2)

  fs.writeFileSync(otherpiFile, jData,);
  res.json({ message: "UPDATED SUCCESSFULLY" });
});


app.put("/delivery", (req, res) => {
  const deliveryFile = path.join(__dirname, "delivery.json");
  let delivery = JSON.parse(fs.readFileSync(deliveryFile, "utf-8"));

  const updates = req.body;

  console.log("Recived updates:", updates);
  const index = 0;
  if(index === -1){
    return res.status(404).json({message: "not found"})
  }
  delivery[index] = { ...delivery[index], ...updates}


  fs.writeFileSync(deliveryFile, JSON.stringify(delivery, null, 2));
  res.json({ message: "UPDATED SUCCESSFULLY" });
});

app.get("/delivery", async (req, res) => {
    if(!fs.existsSync("delivery.json")) return res.json([]);
    const delivery = JSON.parse(await
        fs.promises.readFile("delivery.json", "utf8"));
        res.json(delivery);
});

app.get("/cart", async (req, res) => {
    if(!fs.existsSync("cart.json")) return res.json([]);
    const cart = JSON.parse(await
        fs.promises.readFile("cart.json", "utf8"));
        res.json(cart);
});
app.post("/cart", async (req, res)=>{
    let cart = [];

    if (fs.existsSync("cart.json")){
        cart = JSON.parse(await
    fs.promises.readFile("cart.json", "utf8"));
    }
    cart.push(req.body);
    await fs.promises.writeFile("cart.json",
    JSON.stringify(cart,null,2));
        res.send("Contact");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
