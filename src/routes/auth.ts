import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { RouteGenericInterface } from 'fastify/types/route';
import { GetAuthSchema } from './docs';

type Reply = FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>;

export const getAuth = async (req: FastifyRequest, reply: Reply): Promise<string> => {
  return 'token\n';
};

const getAuthRoute: RouteOptions = {
  method: 'GET',
  url: '/auth',
  handler: getAuth,
  schema: GetAuthSchema,
};

const routes = [getAuthRoute];

export default routes;
