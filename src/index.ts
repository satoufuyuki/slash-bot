/* eslint-disable @typescript-eslint/no-floating-promises */
import { Client } from "./structures/Client";

const client = new Client();
client.build();
client.commands.load();
