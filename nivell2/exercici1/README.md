# Level 2 · Exercise 1 — Food delivery

## Statement

A company wants a website where customers can order food online, either for home delivery or for collection at one of its stores.

- For each **customer**: name, two surnames, address, postcode, city, province and telephone number.
- For each **order**: the customer, the store that handles it, the date and time, whether it is a home delivery or a store pickup, the products ordered and their quantities, the total price and an optional note.
- Each **product** has a name, description, image and price, and is a **pizza**, a **burger** or a **drink**.
- Pizzas belong to a **category** (for example, *Classic*), and a category can contain many pizzas.
- For each **store**: address, postcode, city and province.
- For each **worker**: the store where they work, name, two surnames, tax ID (NIF) and telephone number.
- For home deliveries, the system must record which worker delivered the order and the date and time of delivery.

## Design decisions

The order is the centre of the model: it links customers, stores, products and workers.

| Collection      | Purpose                                                                   |
|-----------------|---------------------------------------------------------------------------|
| `Customer`      | Customer details. Referenced from each order via `CustomerId`.            |
| `Order`         | Order details plus an embedded array of its `Items`.                      |
| `Product`       | Catalogue of pizzas, burgers and drinks.                                  |
| `PizzaCategory` | Pizza categories. Referenced from each pizza via `PizzaCategory`.         |
| `Store`         | Store details. Referenced from each order and each worker via `StoreId`.  |
| `Worker`        | Store staff. Referenced from home-delivery orders via `DeliveryWorker`.   |

- **Embedding**: an `OrderItem` only makes sense inside its order, so the products ordered are embedded in `Order.Items`. Each item stores the `ProductId`, the `Quantity` and the `UnitPrice`.
- **Price snapshot**: `UnitPrice` keeps the price at the moment of the order, so a later price change in the catalogue does not alter past orders.
- **Referencing**: customers, stores, products, categories and workers are shared by many documents. They are kept in their own collections and referenced by `ObjectId`.
- **Enums**: `Order.Type` is restricted to `HOME_DELIVERY` or `STORE_PICKUP`, and `Product.Type` to `PIZZA`, `BURGER` or `DRINK`.
- **Validation**: every collection is created with a `$jsonSchema` validator that checks required fields and data types. Prices and totals are stored as `Decimal` to avoid rounding errors.

### Rules not enforced by the validator

The diagram also describes the following rules. The script only documents them in comments, so the application must check them:

- Only pizzas have a `PizzaCategory`, and every pizza should have one.
- `DeliveryWorker` and `DeliveredDate` are only filled in for `HOME_DELIVERY` orders.

## Data model

![Food delivery data model](food_delivery.png)

The PlantUML source is available in [`food_delivery.puml`](food_delivery.puml).

## Files

| File                                       | Description                                                  |
|--------------------------------------------|--------------------------------------------------------------|
| [`food_delivery.js`](food_delivery.js)     | `mongosh` script that creates the `food_delivery` database and its collections with validators. |
| [`food_delivery.puml`](food_delivery.puml) | PlantUML source of the data model.                           |
| [`food_delivery.png`](food_delivery.png)   | Rendered diagram.                                            |

## How to run

From the root of the repository, start MongoDB and load the script:

```bash
docker compose up -d
docker exec -i mongodb-dev mongosh -u admin -p dev_password_123 --authenticationDatabase admin --quiet < nivell2/exercici1/food_delivery.js
```

Or, with `mongosh` installed locally:

```bash
mongosh "mongodb://admin:dev_password_123@localhost:27017/?authSource=admin" nivell2/exercici1/food_delivery.js
```

> **Note:** the script drops the `Customer`, `Store`, `Worker`, `PizzaCategory`, `Product` and `Order` collections before recreating them.
