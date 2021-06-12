import express from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import { Path } from 'victory';

const app = express();

app.use('/mapapi', createProxyMiddleware({ 
  target: 'https://naveropenapi.apigw.ntruss.com', 
  changeOrigin: true }));
app.listen(3000);