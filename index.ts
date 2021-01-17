import { Application } from 'https://deno.land/x/abc/mod.ts';
import 'https://deno.land/x/dotenv/load.ts';
// https://github.com/vlucas/phpdotenv/issues/76#issuecomment-87252126 | Use a service...

import routes from './routes/index.ts';

const app: Application = new Application();

routes(app);

const productionMode: boolean = Boolean(Deno.env.get('production'));

if (productionMode) {
    // ENV
    const port: number = Number(Deno.env.get('SERVER_PORT'));
    const certFile: string = Deno.env.get('SSL_CERT') || '';
    const keyFile: string = Deno.env.get('SSL_KEY') || '';
    const hostname: string = Deno.env.get('SERVER_HOSTNAME') || '';

    app.startTLS({ port, certFile, keyFile, hostname })
} else {
    app.start({ port: 8080 });
}
