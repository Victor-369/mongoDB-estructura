# mongoDB-estructura

Data modelling exercises with **MongoDB**.

The aim is to design document-oriented databases, deciding when to **embed** data and when to **reference** it, and to enforce each structure with `$jsonSchema` validators.

## Exercises

### Level 1 — Optician "Cul d'Ampolla"

An optician wants to computerise the management of its customers, suppliers and sales of glasses.

| Exercise | Point of view | Description |
|----------|---------------|-------------|
| [Exercise 1](nivell1/exercici1/README.md) | Customer | Model centred on the customer, with purchases embedded and suppliers/employees referenced. |
| [Exercise 2](nivell1/exercici2/README.md) | Glasses  | Model centred on the glasses, which become their own collection. |

### Level 2 — Food delivery

A company wants a website where customers can order food online, for home delivery or store pickup.

| Exercise | Description |
|----------|-------------|
| [Exercise 1](nivell2/exercici1/README.md) | Model centred on the order, with its items embedded and customers, stores, products, pizza categories and workers referenced. |

## Repository structure

```
mongoDB-estructura/
├── docker-compose.yml        # Local MongoDB 8.0 instance
├── nivell1/
│   ├── exercici1/            # Optician — customer view
│   │   ├── README.md
│   │   ├── optician.js       # mongosh script (collections + validators)
│   │   ├── optician.puml     # PlantUML data model
│   │   └── optician.png      # Rendered diagram
│   └── exercici2/            # Optician — glasses view
│       └── ...
└── nivell2/
    └── exercici1/            # Food delivery
        ├── README.md
        ├── food_delivery.js  # mongosh script (collections + validators)
        ├── food_delivery.puml
        └── food_delivery.png
```

## Requirements

- [Docker](https://www.docker.com/) and Docker Compose
- Optionally, [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/) installed locally
- Optionally, [PlantUML](https://plantuml.com/) to regenerate the diagrams

## Getting started

1. Start MongoDB:

   ```bash
   docker compose up -d
   ```

   This launches a `mongo:8.0` container named `mongodb-dev` on port `27017`. The default credentials are `admin` / `dev_password_123`; they can be overridden with the `MONGO_ROOT_USER` and `MONGO_ROOT_PASSWORD` environment variables (for example, in a `.env` file).

2. Load an exercise script:

   ```bash
   docker exec -i mongodb-dev mongosh -u admin -p dev_password_123 --authenticationDatabase admin --quiet < nivell1/exercici1/optician.js
   ```

3. Explore the result:

   ```bash
   docker exec -it mongodb-dev mongosh -u admin -p dev_password_123 --authenticationDatabase admin optician
   ```

4. Stop the container when finished:

   ```bash
   docker compose down        # add -v to delete the stored data as well
   ```

## Technologies

- MongoDB 8.0
- mongosh
- Docker Compose
- PlantUML

## Licence

This project is released under the [MIT Licence](LICENSE).
