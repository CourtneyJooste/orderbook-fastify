import { FastifyReply, FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { BigNumber } from 'bignumber.js';
import { object, string } from 'yup';

export type Request = FastifyRequest<RouteGenericInterface, Server, IncomingMessage, any>;

export type Reply = FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, any>;

export interface IQuerystring {
  username: string;
  password: string;
}

export interface IHeaders {
  'authorization': string;
}

export interface Book {
  bids: any[],
  asks: any[]
}

export interface Order {
  id: string,
  side: 'buy' | 'sell',
  price: BigNumber,
  size: BigNumber
}

export interface Orderbook {
  getTree(side: 'buy' | 'sell'): any,
  getTrades(): any,
  processOrders(): any,
  state(book?: Book): any,
  get(orderId: string): any,
  add(order: NewOrder): any,
  remove(orderId: string): any,
  match(match: MatchOrder): any,
  update(change: ChangeOrder): any
}

export const orderSchema = object({
  side: string().required().matches(/^(buy|sell)$/, 'Order must either be a buy or sell').typeError('Order must either be a buy or sell'),
  price: string().required(),
  size: string().required()
})

export interface NewOrder {
  orderId?: string,
  id: string,
  makerOrderId?: string,
  side: 'buy' | 'sell',
  price: string,
  size: string,
  remainingSize?: string
}

export interface MatchOrder {
  id?: string,
  makerOrderId: string,
  side: 'buy' | 'sell',
  price: string,
  size: string
}

export interface ChangeOrder {
  orderId: string,
  newSize?: string,
  oldSize?: string,
  price?: string,
  side?: string
}

export interface Trade {
  id: string,
  price: string,
  size: string,
  sellerId: string,
  buyerId: string,
  created: Date
}
