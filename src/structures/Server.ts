/* eslint-disable @typescript-eslint/restrict-plus-operands */
import express from "express";
import { sign } from "tweetnacl";
import { InteractionData } from "../typings";
import { Client } from "./Client";
import { text } from "body-parser";

export class ExpressServer {
    public readonly app = express();
    public constructor(public readonly client: Client) {}

    public start(): void {
        this.app.listen(this.client.config.serverPort, () => {
            this.client.logger.info(`Express server listening to 0.0.0.0:${this.client.config.serverPort}`);
        });
        this.app.use(text({ type: "*/*" }));
        this.app.get("/", (request, response) => {
            response.status(200).json({
                status: 200,
                message: "Hello World!"
            });
        });
        this.app.post("/interactions", (request, response) => {
            const rawBody = request.body;
            const signature = request.headers["x-signature-ed25519"];
            const timestamp = request.headers["x-signature-timestamp"];
            if (!signature || !timestamp) {
                return response.status(401).json({
                    message: "Invalid request signature!",
                    status: 401
                });
            }
            const isVerified = sign.detached.verify(
                Buffer.from(timestamp + rawBody),
                Buffer.from(String(signature), "hex"),
                Buffer.from(this.client.config.publicKey!, "hex")
            );
            if (!isVerified) {
                return response.status(401).json({
                    message: "Invalid request signature!",
                    status: 401
                });
            }
            const body = JSON.parse(rawBody) as InteractionData;
            if (body.type === 1) {
                if (this.client.config.isDev) this.client.logger.info("Received ping from discord!");
                return response.status(200).json({
                    type: 1,
                    status: 200,
                    message: "Success!"
                });
            }
            this.client.logger.warn("Command handler not implemented!");
        });
    }
}
