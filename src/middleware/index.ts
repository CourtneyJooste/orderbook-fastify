import { Reply, Request } from '../types';
import { HookHandlerDoneFunction } from 'fastify';

export const preValidation = (request: Request, reply: Reply, done: HookHandlerDoneFunction) => {
  const token = request.headers['authorization'];
  done(token !== 'token' ? new Error('Auth check failed') : undefined);
}
