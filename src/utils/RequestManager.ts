import got from "got";
// import { version, name } from "../../package.json";

export const RequestManager = got.extend({
    prefixUrl: "https://discord.com/api/v8/",
    responseType: "json"
    // headers: { // NOTE: I'm trying to find a way to get version and name from package.json without adding package.json to dist folder
    //     "user-agent": ``
    // }
});
