# Level 1 · Exercise 2 — Optician (glasses view)

## Statement

The optician **"Cul d'Ampolla"** wants to computerise the management of its customers and its sales of glasses (see [Exercise 1](../exercici1/README.md) for the full list of requirements).

## Design decisions

This time the glasses become a first-class entity with their own collection, so the shop can browse and manage its catalogue independently of who has bought what.

| Collection  | Purpose                                                                   |
|-------------|---------------------------------------------------------------------------|
| `glasses`   | Catalogue of glasses: brand, frame type, supplier and price.              |
| `suppliers` | Supplier details. Referenced from each pair of glasses via `supplierId`.  |
| `customers` | Customer details plus an embedded array of their `purchases`.             |

- **Glasses as a collection** — `glasses` is a top-level collection, validated with the same `glassesSchema` that is used inside each purchase.
- **Snapshot on purchase** — each `Purchase` embeds a copy of the glasses as they were at the moment of the sale, so later changes to the catalogue (for instance, a price update) do not alter the sales history.
- **Referencing** — suppliers are shared by many pairs of glasses, so they are kept in their own collection and referenced by `ObjectId`.
- **Embedding** — `Address` is embedded in both customers and suppliers, and `Purchase` is embedded in the customer.
- **Validation** — every collection is created with a `$jsonSchema` validator. `frameType` is restricted to `rimless`, `acetate` or `metallic`, and `price` is stored as `Decimal128`.

### Differences from Exercise 1

| Aspect              | Exercise 1 (customer view)        | Exercise 2 (glasses view)            |
|---------------------|-----------------------------------|--------------------------------------|
| Glasses             | Embedded only, inside purchases   | Own collection + snapshot in purchases |
| Employees           | `employees` collection + `soldBy` | Not modelled                         |
| Per-lens attributes | `prescription`, `lensColour`      | Not modelled                         |
| Frame colour        | Stored                            | Not modelled                         |

## Data model

![Optician data model — glasses view](optician.png)

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
docker exec -i mongodb-dev mongosh -u admin -p dev_password_123 --authenticationDatabase admin --quiet < nivell1/exercici2/optician.js
```

Or, with `mongosh` installed locally:

```bash
mongosh "mongodb://admin:dev_password_123@localhost:27017/?authSource=admin" nivell1/exercici2/optician.js
```

> **Note:** both exercises use the same `optician` database. This script drops the `customers`, `suppliers` and `glasses` collections before recreating them.
