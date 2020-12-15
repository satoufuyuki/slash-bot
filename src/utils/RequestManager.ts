import got from "got";
import { readFileSync } from "fs";
import { resolve } from "path";

const { version, name } = JSON.parse(readFileSync(resolve(process.cwd(), "package.json")).toString());

export const RequestManager = got.extend({
    prefixUrl: "https://discord.com/api/v8/",
    responseType: "json",
    headers: {
        "user-agent": `${name}/${version}`
    }
});
