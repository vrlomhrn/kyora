import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, Message } from 'discord.js';

type UrlProp = {
	url: string;
};

type Err = any;

@ApplyOptions<Command.Options>({
	name: 'quote',
	description: 'random quote from ninjas api'
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
		return this.sendQuote(message);
	}

	// Chat Input (slash) command
	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return this.sendQuote(interaction);
	}

	// Context Menu command
	public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		return this.sendQuote(interaction);
	}

	private async getQuote(url: UrlProp['url']) {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': `${process.env.API_KEY_NINJAAPI}`
				}
			});
			const data = await response.json();

			const quote = `"${data[0].quote}"\n\nBy ${data[0].author}`;

			return quote;
		} catch (err: Err) {
			console.log(err.message);
			return err.message;
		}
	}

	private async sendQuote(interactionOrMessage: Message | Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction) {
		const quoteMessage =
			interactionOrMessage instanceof Message
				? await interactionOrMessage.channel.send({ content: 'wait for random quote...' })
				: await interactionOrMessage.reply({ content: 'wait for random quote...', fetchReply: true });

		const content = await this.getQuote('https://api.api-ninjas.com/v1/quotes');

		if (interactionOrMessage instanceof Message) {
			return quoteMessage.edit({ content });
		}

		return await interactionOrMessage.editReply({
			content
		});
	}
}
