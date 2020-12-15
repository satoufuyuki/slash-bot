import { createLogger } from "../utils/Logger";
import * as config from "../config";
import { ExpressServer } from "./Server";
import { CommandManager } from "../utils/CommandManager";
import { resolve } from "path";
import { RequestManager } from "../utils/RequestManager";

export class Client {
    public readonly config = config;
    public readonly logger = createLogger();
    public readonly express = new ExpressServer(this);
    public readonly commands = new CommandManager(this, resolve(__dirname, "..", "commands"));
    public readonly request = RequestManager;
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-useless-constructor
    public constructor() {}

    public build(): void {
        this.express.start();
    }
}
