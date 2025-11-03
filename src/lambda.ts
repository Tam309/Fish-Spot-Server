import serverlessExpress from '@vendia/serverless-express';
import app from './app';
import { connectToDatabase } from './database';

connectToDatabase();
export const handler = serverlessExpress({ app });
