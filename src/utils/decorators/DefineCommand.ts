import { Client } from "../../structures/Client";
import { ICommandComponent } from "../../typings";

export function DefineCommand(meta: ICommandComponent["meta"]): any {
    return function decorate<T extends ICommandComponent>(target: new (...args: any[]) => T): new (client: Client) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, meta)
        });
    };
}
