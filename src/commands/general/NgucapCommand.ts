
import { BaseCommand } from "../../structures/BaseCommand";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    name: "ngucap",
    description: "Mengucap astagfirullah",
    cooldown: 5,
    args: []
})
export class NgucapCommand extends BaseCommand {
    public async execute(): Promise<any> {
        return {
            type: 4,
            data: {
                tts: false,
                content: "Astagfirullah"
            }
        };
    }
}
