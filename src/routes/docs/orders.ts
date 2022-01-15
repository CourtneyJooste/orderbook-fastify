
const orderObj = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      price: { type: 'string' },
      size: { type: 'string' },
      side: { type: 'string' }
    },
  }
};

export const GetOrderSchema = {
  description: 'Gets orders',
  tags: ['orders'],
  summary: 'Gets all ask and bid orders from orderbook',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        bids: { ...orderObj },
        asks: { ...orderObj }
      },
    },
  },
};

export const AddOrderSchema = {
  description: 'Adds order to orderbook',
  tags: ['orders'],
  summary: 'Adds a new limit order',
  body: {
    type: 'object',
    properties: {
      price: { type: 'string' },
      size: { type: 'string' },
      side: { type: 'string', description: 'buy or sell' },
    },
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'boolean'
    },
  },
};

export const GetTradesSchema = {
  description: 'Gets trades',
  tags: ['trades'],
  summary: 'Gets all successful trades',
  response: {
    200: {
      description: 'Successful response',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          price: { type: 'string' },
          size: { type: 'string' },
          sellerId: { type: 'string' },
          buyerId: { type: 'string' },
          created: { type: 'string', format: 'datetime' }
        },
      }
    },
  },
};
