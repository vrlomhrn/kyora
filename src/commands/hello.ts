import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	name: 'hello',
	description: 'Introduce the bot'
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
		const username = interactionOrMessage.member;
		const idUser = interactionOrMessage.member?.user.id;
		const avatarUser = interactionOrMessage.member?.user.avatar;

		const beforeMessage =
			interactionOrMessage instanceof Message
				? await interactionOrMessage.channel.send({ content: `replying to ${username}` })
				: await interactionOrMessage.reply({ content: `replying to ${username}`, fetchReply: true });

		const client = interactionOrMessage.client.user.username;

		const clientUsername = username?.user.username;
		const capitalName = (clientUsername?.charAt(0).toUpperCase() as string) + clientUsername?.slice(1);

		const content = `Hi, My name is *${client}*. I was developed by Musenji. I'm currently still on development yet I'm ready to be used. Just send me some commands and I will replying to you :). Nice to meet you, **${capitalName}!**.`;

		const embedContent = new EmbedBuilder()
			.setColor(0x1cfc03)
			.setDescription(content)
			.setFooter({
				text: `request from ${capitalName}`,
				iconURL: `https://cdn.discordapp.com/avatars/${idUser}/${avatarUser}`
			});

		if (interactionOrMessage instanceof Message) return beforeMessage.edit({ content: '', embeds: [embedContent] });

		return interactionOrMessage.editReply({
			content: '',
			embeds: [embedContent]
		});
	}
}
