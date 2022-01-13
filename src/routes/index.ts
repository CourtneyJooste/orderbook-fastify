import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { RouteGenericInterface } from 'fastify/types/route';
import { preValidation } from '../middleware';
import authRoutes from './auth';
import { Reply } from '../types';

export const getOrders = async (req: FastifyRequest, reply: Reply): Promise<any[]> => {
  return [];
};

export const GetOrderSchema = {
  description: 'Gets orders',
  tags: ['orders'],
  summary: 'Gets orders',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' }
      },
    },
  },
};

const getOrdersRoute: RouteOptions = {
  method: 'GET',
  url: '/orders',
  handler: getOrders,
  preValidation,
  schema: GetOrderSchema,
};

const routes = [getOrdersRoute, ...authRoutes];

export default routes;
