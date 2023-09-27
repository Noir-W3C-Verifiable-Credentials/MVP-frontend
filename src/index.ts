import express, { Express } from 'express';
import dotenv from 'dotenv';
import { Service } from './services/index.js';
import { HolderRouter } from './router/holder-router.js';
import { IssuerRouter } from './router/issuer-router.js';
import { VerifierRouter } from './router/verifier-router.js';
import cors from "cors";
import compression from 'compression';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const service = new Service();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(compression());
app.use(cors());

app.use("/holder", new HolderRouter(service).router);
app.use("/issuer", new IssuerRouter(service).router);
app.use("/verifier", new VerifierRouter(service).router);

app.get('/', async (req, res) => {
    try {
        await service.setup();
        res.send("Success")
    } catch (error) {
        res.send(error)
    }

});


app.listen(port, async () => {
    await service.setup();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

