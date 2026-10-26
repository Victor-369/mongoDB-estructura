db = db.getSiblingDB("food_delivery");

db.Customer.drop();
db.Store.drop();
db.Worker.drop();
db.PizzaCategory.drop();
db.Product.drop();
db.Order.drop();


// ---------------- COLLECTIONS ----------------

db.createCollection("Customer", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["Name", "Surname1", "Address", "PostalCode", "City", "Province", "Phone"],
      properties: {
        Name: { bsonType: "string" },
        Surname1: { bsonType: "string" },
        Surname2: { bsonType: "string" },
        Address: { bsonType: "string" },
        PostalCode: { bsonType: "string" },
        City: { bsonType: "string" },
        Province: { bsonType: "string" },
        Phone: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("Store", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["Address", "PostalCode", "City", "Province"],
      properties: {
        Address: { bsonType: "string" },
        PostalCode: { bsonType: "string" },
        City: { bsonType: "string" },
        Province: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("Worker", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["StoreId", "Name", "Surname1", "VatNumber", "Phone"],
      properties: {
        StoreId: { bsonType: "objectId" },
        Name: { bsonType: "string" },
        Surname1: { bsonType: "string" },
        Surname2: { bsonType: "string" },
        VatNumber: { bsonType: "string" },
        Phone: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("PizzaCategory", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["Name"],
      properties: {
        Name: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("Product", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["Name", "Price", "Type"],
      properties: {
        Name: { bsonType: "string" },
        Description: { bsonType: "string" },
        Image: { bsonType: "string" },
        Price: { bsonType: "decimal" },
        Type: { enum: ["PIZZA", "BURGER", "DRINK"] },
        PizzaCategory: { bsonType: "objectId" }
      }
    }
  }
});

// the products of the order go inside the order
db.createCollection("Order", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["CustomerId", "StoreId", "Date", "Type", "Items", "Total"],
      properties: {
        CustomerId: { bsonType: "objectId" },
        StoreId: { bsonType: "objectId" },
        Date: { bsonType: "date" },
        Type: { enum: ["HOME_DELIVERY", "STORE_PICKUP"] },
        Items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["ProductId", "Quantity", "UnitPrice"],
            properties: {
              ProductId: { bsonType: "objectId" },
              Quantity: { bsonType: "int" },
              UnitPrice: { bsonType: "decimal" }
            }
          }
        },
        Total: { bsonType: "decimal" },
        Note: { bsonType: "string" },
        DeliveryWorker: { bsonType: "objectId" }, // only for HOME_DELIVERY
        DeliveredDate: { bsonType: "date" }
      }
    }
  }
});
