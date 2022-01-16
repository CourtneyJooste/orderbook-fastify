export const Options = {
  routePrefix: '/docs',
  exposeRoute: true,
  enableCors: true,
  swagger: {
    info: {
      title: 'Orderbook Fastify API',
      description: 'A fast, in-memory order book to create and fulfil limit orders',
      version: '1.0.0',
    },
    host: `${process.env.HOST || 'localhost'}:${process.env.PORT || '8080'}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};
