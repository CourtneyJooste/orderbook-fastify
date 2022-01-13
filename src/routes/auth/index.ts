import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { RouteGenericInterface } from 'fastify/types/route';

type Reply = FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>;

export const getAuth = async (req: FastifyRequest, reply: Reply): Promise<string> => {
  return 'token\n';
};

export const GetAuthSchema = {
  description: 'Gets auth',
  tags: ['auth'],
  summary: 'Gets auth',
  params: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'Username'
      },
      password: {
        type: 'string',
        description: 'Password'
      }
    }
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'string'
    },
  },
};

const getAuthRoute: RouteOptions = {
  method: 'GET',
  url: '/auth',
  handler: getAuth,
  schema: GetAuthSchema,
};

const routes = [getAuthRoute];

export default routes;
