import { createLogger } from "../utils/Logger";
import * as config from "../config";

export class Client {
    public readonly config = config;
    public readonly logger = createLogger();
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-useless-constructor
    public constructor() {}

    public build(): void {
        this.logger.warn("Not implemented!");
    }
}
