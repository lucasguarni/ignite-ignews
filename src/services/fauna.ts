import { Client } from 'faunadb';

export const faun = new Client({
  secret: process.env.FAUNADB_KEY
});