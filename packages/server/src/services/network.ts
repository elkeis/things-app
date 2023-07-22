import {request as httpsRequest} from 'https';
import { service } from './service';
import {z} from 'zod';

export const request = service(ctx => 
  async (url: string | URL, options: {
    headers: Record<string,string>,
    method: 'GET' | 'POST',
    json?: any,
    schema: z.Schema
  }) => {
    ctx.log(['server-request:', url, options]);
    try {
      return await new Promise<any>((resolve, reject) => {
  
        const request = httpsRequest({
          ...new URL(url),
          method: options.method,
          headers: options.headers
        }, res => {
          let data = '';
          ctx.log(['server-response:', res.statusCode]);
          
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const parsed = options.schema.parse(JSON.stringify(data));
              resolve(parsed);
            } catch (ex) {
              reject(ex);
            }
          })
          res.on('error', (err) => {
            reject(err);
          })
        });
        if (options.json) {
          request.write(JSON.stringify(options.json));
        }
        request.end(); 
      });
    } catch (ex) {
      ctx.log(ex, 'error');
      throw new Error(`request-error: ${(ex as any).toString()}`);
    }
 } 
);
