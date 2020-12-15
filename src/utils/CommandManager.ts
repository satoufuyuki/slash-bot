/* eslint-disable no-negated-condition */
import { ApplicationCommand, ApplicationCommandInteractionDataOption, ICategoryMeta, ICommandComponent, InteractionData } from "../typings";
import { promises as fs } from "fs";
import { Client } from "../structures/Client";
import { resolve, parse } from "path";
import { Collection } from "./Collection";

export class CommandManager extends Collection<string, ICommandComponent> {
    public readonly categories: Collection<string, ICategoryMeta> = new Collection();
    public readonly cooldowns: Collection<string, Collection<string, number>> = new Collection();
    public constructor(public client: Client, private readonly path: string) { super(); }

    public async load(): Promise<void> {
        const { body: commands } = await this.client.request.get(`applications/${this.client.config.appID!}/commands`) as unknown as { body: ApplicationCommand[] };
        fs.readdir(resolve(this.path))
            .then(async categories => {
                this.client.logger.info(`Found ${categories.length} categories, registering...`);
                for (const category of categories) {
                    const meta = await import(resolve(this.path, category, "category.meta.json"));
                    this.categories.set(category, meta);
                    this.client.logger.info(`Registering ${category} category...`);
                    await fs.readdir(resolve(this.path, category))
                        .then(files => files.filter(f => f !== "category.meta.json"))
                        .then(async files => {
                            this.client.logger.info(`Found ${files.length} of commands in ${category}, loading...`);
                            for (const file of files) {
                                const path = resolve(this.path, category, file);
                                const command = await this.import(path, this.client, { category, path });
                                if (command === undefined) throw new Error(`File ${file} is not a valid command file`);
                                command.meta = Object.assign(command.meta, { path, category });
                                const cmd = commands.find(x => x.name === command.meta.name);
                                if (!cmd) {
                                    this.client.logger.info(`Registering ${command.meta.name} to discord...`);
                                    await this.client.request.post(`applications/${this.client.config.appID!}/commands`, {
                                        json: {
                                            name: command.meta.name,
                                            description: command.meta.description,
                                            options: command.meta.args
                                        }
                                    }).catch(err => this.client.logger.error("CMD_LOADER_ERR:", err));
                                } else if (cmd.name !== command.meta.name || cmd.description !== command.meta.description || cmd.options !== command.meta.args as any) {
                                    await this.client.request.patch(`applications/${this.client.config.appID!}/commands/${cmd.id}`, {
                                        json: {
                                            name: command.meta.name,
                                            description: command.meta.description,
                                            options: command.meta.args
                                        }
                                    }).catch(err => this.client.logger.error("CMD_LOADER_ERR:", err));
                                }
                                this.set(command.meta.name, command);
                                this.client.logger.info(`Command ${command.meta.name} from ${category} category is now loaded.`);
                            }
                            return { files };
                        })
                        .then(data => {
                            this.categories.set(category, Object.assign(meta, { cmds: this.filter(({ meta }) => meta.category === category) }));
                            this.client.logger.info(`Done loading ${data.files.length} commands in ${category} category.`);
                        })
                        .catch(err => this.client.logger.error("CMD_LOADER_ERR:", err))
                        .finally(() => this.client.logger.info(`Done registering ${category} category.`));
                }
            })
            .catch(err => this.client.logger.error("CMD_LOADER_ERR:", err))
            .finally(() => this.client.logger.info("All categories has been registered."));
    }

    public async handle({ data }: { data: InteractionData["data"] }): Promise<any> {
        const cmd = this.get(data.name);
        return cmd!.execute(data.options as ApplicationCommandInteractionDataOption[]);
    }

    private async import(path: string, ...args: any[]): Promise<ICommandComponent | undefined> {
        const file = (await import(resolve(path)).then(m => m[parse(path).name]));
        return file ? new file(...args) : undefined;
    }
}
