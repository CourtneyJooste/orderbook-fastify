export const Options = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Orderbook Fastify API',
      description: 'A fast, in-memory order book to create and fulfil limit orders',
      version: '1.0.0',
    },
    host: 'localhost:8080',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};
