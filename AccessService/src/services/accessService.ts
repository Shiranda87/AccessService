import { IAccessToken } from "../interfaces/accessTokenInterface";
import { AccessToken } from "../models/accessTokenModel";
import { SECRET_KEY } from "../constants/constants";
import { TokenStatus } from "../enums/tokenStatusEnum";
import jwt from "jsonwebtoken";

export class AccessService {

    public create(userId: string, permissions: string): Promise<IAccessToken> {
        const permissionsStr = permissions.replace(/\s/g, ''); //clean white spaces
        const permissionsArr = permissionsStr.split(',');

        const accessToken = {
            key: this.generateAPIKey(),
            userId: userId,
            permissions: permissionsArr,
            lastUsage: new Date().toLocaleString(),
            isActive: true
        }; 

        const newAccessToken = new AccessToken(accessToken);
        return newAccessToken.save();
    }

    public async authenticate(userID: string, key: string) {
        const token = await AccessToken.findOneAndUpdate(
            {  userID: userID, key: key }, 
            { lastUsage: new Date().toLocaleString() } 
        ).exec();

        if (!token) {
            throw new Error(this.getKeyNotFoundErrorMessage(userID, key));
        }

        if (!token.isActive) {
            throw new Error(`Key '${key}' is not active`);
        }
        
        return this.generateJWT(token);
    }

    public async revokeKey(userID: string, key: string): Promise<IAccessToken>  {
        const updatedToken = await AccessToken.findOneAndUpdate(
            { userID: userID, key: key }, 
            { isActive: false } 
        ).exec();

        if (!updatedToken) {
            throw new Error(this.getKeyNotFoundErrorMessage(userID, key));
        }

        return updatedToken;
    }

    public async getAll(userId: string) {
        const apiKeys = [];

        const tokens = await AccessToken.find(
            { userId: userId }
        ).exec();

        for (const token of tokens) {
            const apiKey = {
                key: this.getObstructedKey(token.key),
                lastUsage: token.lastUsage,
                status: token.isActive ? TokenStatus.Active : TokenStatus.Inactive
            }
            apiKeys.push(apiKey);
        }

        return apiKeys;
    }

    private generateAPIKey() {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    }

    private generateJWT(token: IAccessToken)
    {
        const payload = {
            userId: token.userId,
            permissions: token.permissions
        };

        return jwt.sign(payload, SECRET_KEY);
    }

    private getObstructedKey(key: string) {
        return key.replace(/^.{4}/g, '****')
    }

    private getKeyNotFoundErrorMessage(userID: string, key: string) {
        return `Access Token with key '${key}' was not found for user ${userID}`;
    }
}