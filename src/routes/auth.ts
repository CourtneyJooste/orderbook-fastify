import { FastifyRequest, RouteOptions } from 'fastify';
import { IncomingMessage, Server } from 'http';
import { RouteGenericInterface } from 'fastify/types/route';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import assert from 'assert';
import { GetAuthSchema } from './docs';
import { IQuerystring, Reply } from '../types';

type Request = FastifyRequest<RouteGenericInterface, Server, IncomingMessage, any>;

export const getAuth = async (req: Request, reply: Reply): Promise<string> => {
  const corrrectUsername = process.env.USERNAME;
  const correctPassword = process.env.PASSWORD;
  const key = process.env.TOKEN_KEY;
  assert(corrrectUsername, 'Please add a username to your .env');
  assert(correctPassword, 'Please add a hashed password to your .env');
  assert(key, 'Please add a token key to your .env');

  const { username, password } = req.query as IQuerystring;

  assert(username === corrrectUsername, 'Incorrect username');
  assert(await bcrypt.compare(password, correctPassword), 'Incorrect Password');

  return jwt.sign(
    { username },
    key,
    {
      expiresIn: '1h',
    }
  );
};

const getAuthRoute: RouteOptions = {
  method: 'GET',
  url: '/auth',
  handler: getAuth,
  schema: GetAuthSchema,
};

const routes = [getAuthRoute];

export default routes;
