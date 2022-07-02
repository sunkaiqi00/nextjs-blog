import 'reflect-metadata';
import { Connection, getConnection, createConnection } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from './entity';

const type = process.env.DATABASE_TYPE;
const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

console.log(host, port);


let connectionRedayPromise: Promise<Connection> | null = null;

export const perpareConection = () => {
  if (!connectionRedayPromise) {
    connectionRedayPromise = (async () => {
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        console.error(error);
      }

      const connection = await createConnection({
        type: 'mysql',
        host: 'remotemysql.com',
        port,
        username,
        password,
        database,
        entities: { User, UserAuth, Article, Comment, Tag },
        synchronize: false,
        logging: true
      });
      return connection;
    })();
  }
  return connectionRedayPromise;
};
