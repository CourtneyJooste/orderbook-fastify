import { FastifyRequest, RouteOptions } from 'fastify';
import { Book, NewOrder, orderSchema, Reply, ReplyT, Trade } from '../types';
import { preValidation } from '../middleware';
import { GetOrderSchema } from './docs';
import { Orderbook } from '../lib';
import { v4 as uuidv4 } from 'uuid';
import { AddOrderSchema, GetTradesSchema } from './docs/orders';

const orderbook = Orderbook();

export const getOrders = async (req: FastifyRequest, reply: Reply): Promise<Book> => {
  return orderbook.state();
};

const getOrdersRoute: RouteOptions = {
  method: 'GET',
  url: '/orders',
  handler: getOrders,
  preValidation,
  schema: GetOrderSchema,
};

export const addOrder = async (req: FastifyRequest, reply: Reply): Promise<boolean> => {
  const order = req.body;
  const validated = await orderSchema.validate(order, { stripUnknown: true });

  const r = reply as ReplyT;

  // Push new order and sync request to queue
  r.queue.add('add', orderbook.add({ id: uuidv4(), ...validated } as NewOrder));
  r.queue.add('sync', orderbook.processOrders());
  return true;
};

const addOrderRoute: RouteOptions = {
  method: 'POST',
  url: '/order',
  handler: addOrder,
  preValidation,
  schema: AddOrderSchema,
};

export const getTrades = async (req: FastifyRequest, reply: Reply): Promise<Trade[]> => {
  return orderbook.getTrades();
};

const getTradesRoute: RouteOptions = {
  method: 'GET',
  url: '/trades',
  handler: getTrades,
  preValidation,
  schema: GetTradesSchema,
};

const routes = [getOrdersRoute, addOrderRoute, getTradesRoute];

export default routes;
