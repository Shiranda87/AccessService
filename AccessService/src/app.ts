import { Application, NextFunction, Request, Response } from "express";
import { AccessController } from "./controllers/accessController";
import { AccessService } from "./services/accessService";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { MONGO_URL } from "./constants/constants";

declare global {
    namespace Express {
        interface Request {
          userId: string
        }
    }
}

class App {
    public app: Application;

    constructor() {        
        this.app = express();
        this.setConfig();
        this.setMongoConfig();
        this.authenticateRequest();
        this.setControllers();
        this.setErrorHandling();
    }

    private setConfig() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded());
        this.app.use(cors());
    }

    private setControllers() {
        const controller = new AccessController(new AccessService());
        this.app.use("/access", controller.router);
    }

    private authenticateRequest() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            req.userId = "12345"; //authenticated user id
            next();
        });
    }

    private setErrorHandling() {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {            
            res.status(500).json({ message: err.message });
        });
    }

    private setMongoConfig() {
        mongoose.connect(MONGO_URL);        
    }
}

export default new App().app;