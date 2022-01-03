
import { IAccessToken } from "../interfaces/accessTokenInterface";
import { model, Schema } from "mongoose";

const AccessTokenSchema = new Schema({
    key: { type: String, required: true },
    userId: { type: String, required: true },
    permissions: { type: Array, required: true },
    lastUsage: { type: String, required: true },
    isActive: { type: Boolean, required: true },
});

export const AccessToken = model<IAccessToken>("AccessToken", AccessTokenSchema);