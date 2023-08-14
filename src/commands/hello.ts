import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	name: 'hello',
	description: 'reply hello world'
})

export class UserCommand extends Command {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});

		// Register Context Menu command available from any message
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.Message
		});

		// Register Context Menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User
		});
	}

	// Message command
	public async messageRun(message: Message) {
		return this.sendHello(message);
	}

	// Chat Input (slash) command
	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return this.sendHello(interaction);
	}

	// Context Menu command
	public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		return this.sendHello(interaction);
	}

	private async sendHello(interactionOrMessage: Message | Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction) {
		// const pingMessage =
		// 	interactionOrMessage instanceof Message
		// 		? await interactionOrMessage.channel.send({ content: 'Ping?' })
		// 		: await interactionOrMessage.reply({ content: 'Ping?', fetchReply: true });

		const content = `Hello World!`;

		if (interactionOrMessage instanceof Message) {
			return interactionOrMessage.channel.send({ content });
		}

		return interactionOrMessage.reply({
			content: content
		});
	}
}
