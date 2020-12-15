import { createLogger } from "../utils/Logger";
import * as config from "../config";

export class Client {
    public readonly config = config;
    public readonly logger = createLogger()
    constructor() {}

    public build() {
        this.logger.warn("Not implemented!");
    }
}