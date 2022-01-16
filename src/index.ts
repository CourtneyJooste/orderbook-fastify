import fastify from 'fastify';
import routes from './routes';
import { Options } from './config';
import swagger from 'fastify-swagger';
import dotenv from 'dotenv';
import fastifyQueue from '@autotelic/fastify-queue';

dotenv.config();

const server = fastify();

server.register(fastifyQueue, { concurrency: 1 });

server.register(swagger, Options);

routes.forEach(route => {
  server.route(route);
});

const start = async (): Promise<void> => {
  server.listen(process.env.PORT || 8080, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    server.swagger();
  });
};
start();
