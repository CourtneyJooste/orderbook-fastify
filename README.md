# Orderbook Fastify

### A Project by Courtney Jooste

A fast, in-memory orderbook for posting limit orders and fulfilling trades.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Endpoints

Please see the postman collection in the ./postman-collection folder for examples and see the Swagger API for documentation.

```http request
# Auth
GET /auth

# Get orderbook
GET /orders

# Submit limit order
POST /order

# Recent trades
GET /trades
```

## Testing

```bash
# unit tests
$ yarn test

# test coverage
$ yarn coverage
```

## Environment

Create a .env file in your project root and populate the following:

```dotenv
USERNAME=<your username>
PASSWORD=<bcrypt hashed password with salt=10>
TOKEN_KEY=<the key for your web tokens>
PORT=<optional port to use instead of 8080>
```

In a production environment, the usernames and passwords should be matched against a user pool instead of using environment variables.

## Authentication

First, ensure you have followed the .env set up.

Make a GET request to /auth with params username and password.

```http request
http://localhost:8080/auth?username=demo&password=demo
```

## Docs

[Swagger](https://swagger.io) is used to generate docs.

```http request
Go to route /docs
Eg: localhost:8080/docs
```

## Issues / TODOs

Market price is currently not calculated and orders can be posted that overbid. This means that the price between a sell and buy can have a differing value. Currently the trades will favour the seller and execute the trade at the price that the buyer offers.

## References

- WK Selph: How to Build a Fast Limit Order Book [^1]
- Vaccuumlabs: Lessons learnt from writing a high frequency trading engine in Node.js [^2]

[^1]: https://goo.gl/KF1SRm
[^2]: https://vacuumlabs.com/blog/technology/high-frequency-trading-engine-in-node-js
