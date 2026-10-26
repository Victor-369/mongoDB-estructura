db = db.getSiblingDB("optician");

db.customers.drop();
db.suppliers.drop();
db.employees.drop();


// ---------------- SHARED SCHEMAS ----------------
// customers and suppliers both have an address, so I write it only once
const addressSchema = {
  bsonType: "object",
  required: ["street", "number", "city", "postcode", "country"],
  properties: {
    street: { bsonType: "string" },
    number: { bsonType: "string" },
    floor: { bsonType: "string" }, // optional
    door: { bsonType: "string" },  // optional
    city: { bsonType: "string" },
    postcode: { bsonType: "string" },
    country: { bsonType: "string" }
  }
};

// PerLens<T> from the diagram: one value for the left lens and one for the right.
// Reusable schema for attributes that have a value for each lens (left and right), such as prescription and colour.
function perLensSchema(type) {
  return {
    bsonType: "object",
    required: ["left", "right"],
    properties: {
      left: { bsonType: type },
      right: { bsonType: type }
    }
  };
}

const frameTypes = ["rimless", "acetate", "metallic"];

const glassesSchema = {
  bsonType: "object",
  required: ["brand", "supplierId", "prescription", "frameType", "frameColour", "lensColour", "price"],
  properties: {
    brand: { bsonType: "string" },
    supplierId: { bsonType: "objectId" },
    prescription: perLensSchema("number"),
    frameType: { bsonType: "string", enum: frameTypes },
    frameColour: { bsonType: "string" },
    lensColour: perLensSchema("string"),
    price: { bsonType: "decimal" }
  }
};

const purchaseSchema = {
  bsonType: "object",
  required: ["saleDate", "soldBy", "glasses"],
  properties: {
    saleDate: { bsonType: "date" },
    soldBy: {
      bsonType: "object",
      required: ["employeeId", "name"],
      properties: {
        employeeId: { bsonType: "objectId" },
        name: { bsonType: "string" }
      }
    },
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

db.createCollection("employees", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" }
      }
    }
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

