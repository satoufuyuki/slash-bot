import { BaseCommand } from "../../structures/BaseCommand";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    name: "about",
    description: "About me :D",
    cooldown: 5,
    args: []
})
export class AboutCommand extends BaseCommand {
    public async execute(): Promise<any> {
        return {
            type: 4,
            data: {
                tts: false,
                content: "I'm just a bot. Beep-Boop!"
            }
        };
    }
}
