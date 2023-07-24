import serveStatic from 'serve-handler';
import {createServer} from 'http';
import { createContext } from './context';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { root } from './routes';
import {hideBin} from 'yargs/helpers'
import yargs from 'yargs';
import {log} from './services/log';
import fs from 'fs-extra';

(async () => {
  const args = await yargs(hideBin(process.argv)).argv;  

  log(`server started with args: ${argsToString(args)}`);

  const trpcHandler = createHTTPHandler({
    router: root,
    createContext,
    onError: ({ctx, req, path, type, error}) => {
      ctx?.log(null, `${type}/${path} – ${error.code}`, 'error');
    }
  })
  
  const server = createServer(async (request, response) => {
    if (request.url?.startsWith('/trpc')) {
      log(`request: ${request.method} : ${request.url}`);
      request.url = request.url.replace('/trpc', '');
      trpcHandler(request, response);
    } else if (args['serve']) {
      log('serve static ' + request.url);
      serveStatic(request, response, {
        public:  <any>args['serve'],
        directoryListing: false,
        symlinks: true,
        rewrites: [{
          source: '/**/*',
          destination: '/index.html'
        }]
      })
    } else {
      log(null, `not found: ${request.url}`, 'error');
      response.write(await fs.readFile(__dirname + '/404.html'));
      response.end();
      
    }
  });
  
  server.listen(3000, () => {
    console.log(`server listening on http://localhost:3000`);
  });

})();


function argsToString(args: ReturnType<typeof yargs>['argv']) {
  return Object.entries(args)
    .filter(v => !['_', '$0'].includes(v[0]))
    .map(v => v.join('='))
    .join('; ');
}

