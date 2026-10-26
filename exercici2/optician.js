db = db.getSiblingDB("optician");

db.customers.drop();
db.suppliers.drop();
db.glasses.drop();


// ---------------- SHARED SCHEMAS ----------------
// customers and suppliers both have an address, so I write it only once
const addressSchema = {
  bsonType: "object",
  required: ["street", "number", "city", "postcode", "country"],
  properties: {
    street: { bsonType: "string" },
    number: { bsonType: "string" },
    floor: { bsonType: "string" },
    door: { bsonType: "string" },
    city: { bsonType: "string" },
    postcode: { bsonType: "string" },
    country: { bsonType: "string" }
  }
};

const frameTypes = ["rimless", "acetate", "metallic"];

// used by the glasses collection and also embedded inside each purchase
const glassesSchema = {
  bsonType: "object",
  required: ["brand", "frameType", "supplierId", "price"],
  properties: {
    brand: { bsonType: "string" },
    frameType: { bsonType: "string", enum: frameTypes },
    supplierId: { bsonType: "objectId" }, // reference to suppliers
    price: { bsonType: "decimal" }
  }
};

const purchaseSchema = {
  bsonType: "object",
  required: ["saleDate", "glasses"],
  properties: {
    saleDate: { bsonType: "date" },
    glasses: glassesSchema
  }
};


// ---------------- COLLECTIONS ----------------

db.createCollection("suppliers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "address", "telephone", "taxId"],
      properties: {
        name: { bsonType: "string" },
        address: addressSchema,
        telephone: { bsonType: "string" },
        fax: { bsonType: "string" },
        taxId: { bsonType: "string" } // NIF
      }
    }
  }
});

db.createCollection("glasses", {
  validator: {
    $jsonSchema: glassesSchema
  }
});

// purchases go inside the customer
db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "address", "telephone", "email", "registrationDate"],
      properties: {
        name: { bsonType: "string" },
        address: addressSchema,
        telephone: { bsonType: "string" },
        email: { bsonType: "string" },
        registrationDate: { bsonType: "date" },
        purchases: { bsonType: "array", items: purchaseSchema }
      }
    }
  }
});
