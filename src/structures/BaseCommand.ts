import { ApplicationCommandInteractionDataOption, ICommandComponent } from "../typings";
import { Client } from "./Client";

export class BaseCommand implements ICommandComponent {
    public constructor(public client: Client, public meta: ICommandComponent["meta"]) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public execute(args: ApplicationCommandInteractionDataOption[]): any {}
}
