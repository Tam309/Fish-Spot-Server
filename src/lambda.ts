// src/lambda.ts
import serverlessExpress from '@vendia/serverless-express';
import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import app from './app';
import { connectToDatabase } from './database';

// cache the handler (and DB connection) across invocations
let cachedHandler: ReturnType<typeof serverlessExpress> | null = null;

export const handler = async (event: APIGatewayProxyEventV2, context: Context) => {
  // initialize once on cold start
  if (!cachedHandler) {
    // connect DB once and reuse pooled connection in subsequent invocations
    await connectToDatabase();

    // wrap your Express app with the Lambda adapter
    cachedHandler = serverlessExpress({ app });
  }

    // hand off the event to Express — pass a third undefined callback to satisfy the handler signature
    return cachedHandler!(event, context, undefined as any);
  };
