import { createLogger } from "../utils/Logger";
import * as config from "../config";
import { ExpressServer } from "./Server";

export class Client {
    public readonly config = config;
    public readonly logger = createLogger();
    public readonly express = new ExpressServer(this);
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-useless-constructor
    public constructor() {}

    public build(): void {
        this.express.start();
    }
}
