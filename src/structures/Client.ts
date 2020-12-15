import { createLogger } from "../utils/Logger";
import * as config from "../config";

export class Client {
    public readonly config = config;
    public readonly logger = createLogger();
    // eslint-disable-next-line
    constructor() {}

    public build(): void {
        this.logger.warn("Not implemented!");
    }
}
