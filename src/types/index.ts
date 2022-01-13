import { FastifyReply, FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';

export type Request = FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>;

export type Reply = FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>;

export interface IQuerystring {
  username: string;
  password: string;
}

export interface IHeaders {
  'authorization': string;
}
