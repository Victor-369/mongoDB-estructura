# Level 1 · Exercise 1 — Optician (customer view)

## Statement

The optician **"Cul d'Ampolla"** wants to computerise the management of its customers and its sales of glasses.

- For each **supplier**: name, address (street, number, floor, door, city, postcode and country), telephone, fax and tax ID (NIF).
- For each pair of **glasses**: brand, the prescription of each lens, the frame type (rimless, acetate or metallic), the frame colour, the colour of each lens and the price.
- For each **customer**: name, postal address, telephone, email address and registration date.
- The system must record which **employee** sold each pair of glasses, and the date and time of the sale.

## Design decisions

Since the interface is built around the customer, the `customers` collection is the centre of the model: a single read of a customer document returns everything the screen needs.

| Collection  | Purpose                                                                 |
|-------------|-------------------------------------------------------------------------|
| `customers` | Customer details plus an embedded array of their `purchases`.           |
| `suppliers` | Supplier details. Referenced from each pair of glasses via `supplierId`. |
| `employees` | Shop staff. Referenced from each sale via `soldBy.employeeId`.          |

- **Embedding** — `Address`, `Purchase`, `Glasses` and `SoldBy` are embedded documents. A purchase only makes sense in the context of its customer, so it lives inside the customer document.
- **Referencing** — suppliers and employees are shared by many sales, so they are kept in their own collections and referenced by `ObjectId`.
- **Extended reference** — `soldBy` stores the employee's `name` alongside `employeeId`, so the customer's purchase history can be displayed without an extra lookup.
- **`PerLens<T>`** — attributes that differ between the left and right lens (`prescription`, `lensColour`) are modelled as a `{ left, right }` object.
- **Validation** — every collection is created with a `$jsonSchema` validator. `frameType` is restricted to `rimless`, `acetate` or `metallic`, and `price` is stored as `Decimal` to avoid rounding errors.

## Data model

![Optician data model — customer view](optician.png)

The PlantUML source is available in [`optician.puml`](optician.puml).

## Files

| File                             | Description                                                  |
|----------------------------------|--------------------------------------------------------------|
| [`optician.js`](optician.js)     | `mongosh` script that creates the `optician` database and its collections with validators. |
| [`optician.puml`](optician.puml) | PlantUML source of the data model.                           |
| [`optician.png`](optician.png)   | Rendered diagram.                                            |

## How to run

From the root of the repository, start MongoDB and load the script:

```bash
docker compose up -d
docker exec -i mongodb-dev mongosh -u admin -p dev_password_123 --authenticationDatabase admin --quiet < nivell1/exercici1/optician.js
```

Or, with `mongosh` installed locally:

```bash
mongosh "mongodb://admin:dev_password_123@localhost:27017/?authSource=admin" nivell1/exercici1/optician.js
```

> **Note:** the script drops the `customers`, `suppliers` and `employees` collections before recreating them.
