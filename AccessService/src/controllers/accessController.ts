import { Request, Response, NextFunction, Router } from "express";
import { AccessService } from "../services/accessService";

export class AccessController {
    public router = Router();
  
    constructor(private accessService: AccessService) {
        this.setRoutes();
    }

    private setRoutes() {
        this.router.route("/").get(this.getAll).post(this.create);
        this.router.route("/authenticate").post(this.authenticate);
        this.router.route("/:id").delete(this.revoke);
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId; 
        const permissions = req.body.permissions;
        
        try {
            const accessToken = await this.accessService.create(userId, permissions);
            res.send(accessToken);
        }
        catch (err) {
            return next(err);
        }
    };

    private authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId; 
        const key = req.body.apiKey;
        
        try {
            const jwtToken = await this.accessService.authenticate(userId, key);
            res.send(jwtToken);
        }
        catch (err) {
            return next(err);
        }
    };

    private revoke = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const key = req.params.id;
    
        try {
            const accessToken = await this.accessService.revokeKey(userId, key);
            res.send(`Key ${accessToken.key} was revoked`);
        }
        catch (err) {
            return next(err);
        }
    };

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId; 

        try {
            const userKeys = await this.accessService.getAll(userId)
            return res.send(userKeys);
        }
        catch (err) {
            return next(err);
        }
    };
}