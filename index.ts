import { Application } from "https://deno.land/x/abc@v1.0.3/mod.ts";
import { Database } from 'https://deno.land/x/denodb/mod.ts';

import routes from "./routes/index.ts";
import models from "./models/index.ts";

const app: Application = new Application();

routes(app);

const productionMode: boolean = Boolean(Deno.env.get('production'));

if (productionMode) {
    // ENV
    const port: number = Number(Deno.env.get('port'));
    const certFile: string = Deno.env.get('cert') || '';
    const keyFile: string = Deno.env.get('key') || '';
    const hostname: string = Deno.env.get('hostname') || '';

    const DB_HOST: string = Deno.env.get('DB_HOST') || '';
    const DB_NAME: string = Deno.env.get('DB_NAME') || '';
    const DB_USER: string = Deno.env.get('DB_USER') || '';
    const DB_PORT: number = Number(Deno.env.get('DB_PASS'));
    const DB_PASS: string = Deno.env.get('DB_PORT') || '';

    const db: Database = new Database('postgres', {
        host: DB_HOST,
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        port: DB_PORT
    });

    models(db);
    db.sync({ drop: true });

    app.startTLS({ port, certFile, keyFile, hostname })
} else {
    const db: Database = new Database('postgres', {
        host: 'localhost',
        username: 'dev',
        password: 'dev',
        database: 'cntnt',
    });

    models(db);
    db.sync({ drop: true });

    app.start({ port: 8080 });
}
