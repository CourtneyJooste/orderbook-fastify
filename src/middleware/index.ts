import { Reply, Request } from '../types';
import { HookHandlerDoneFunction } from 'fastify';
import assert from 'assert';
import jwt from 'jsonwebtoken';

export const preValidation = (request: Request, reply: Reply, done: HookHandlerDoneFunction) => {
  const key = process.env.TOKEN_KEY;
  assert(key, 'Please add a token key to your .env');
  const token = request.headers['authorization'];
  assert(token, 'Please provide an authentication token');

  const parts = token.split(' ');
  assert(parts.length === 2, 'Format is Authorization: Bearer [token]');
  const scheme = parts[0];
  const credentials = parts[1];
  assert(/^Bearer$/i.test(scheme), 'Format is Authorization: Bearer [token]');
  assert(jwt.verify(credentials, key), 'Invalid token');

  done();
}
