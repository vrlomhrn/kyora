import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, Message, EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
	name: 'rndompict',
	description: 'random picture from unsplash'
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
		return this.sendRandomPict(message);
	}

	// Chat Input (slash) command
	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return this.sendRandomPict(interaction);
	}

	// Context Menu command
	public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		return this.sendRandomPict(interaction);
	}

	private async sendRandomPict(interactionOrMessage: Message | Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction) {
		const randomPictMessage =
			interactionOrMessage instanceof Message
				? await interactionOrMessage.channel.send({ content: 'Sending a random picture...' })
				: await interactionOrMessage.reply({ content: 'Sending random picture...', fetchReply: true });

		const EmbedMessage = new EmbedBuilder().setColor(0x1cfc03).setImage(`https://random.imagecdn.app/500/150`);

		if (interactionOrMessage instanceof Message) {
			return randomPictMessage.edit({ content: '', embeds: [EmbedMessage] });
		}

		return interactionOrMessage.editReply({
			content: '',
			embeds: [EmbedMessage]
		});
	}
}
