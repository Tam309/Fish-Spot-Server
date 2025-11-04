import serverlessExpress from '@vendia/serverless-express';
import app from './app';
import { connectToDatabase } from './database';

let dbInitPromise: Promise<unknown> | null = null;
async function ensureDatabaseConnected() {
  if (!dbInitPromise) {
  dbInitPromise = connectToDatabase();
  }
  await dbInitPromise;
}

const lambdaHandler = serverlessExpress({ app });

export const handler = async (event: any, context: any, callback: any) => {
  await ensureDatabaseConnected();
  return lambdaHandler(event, context, callback);
};
