import { Document } from "mongoose";

export interface IAccessToken extends Document {
    key: string;
    userId: string;
    permissions: string[];
    lastUsage: string;
    isActive: boolean;
}