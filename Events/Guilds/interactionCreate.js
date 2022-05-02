const {
  nicerPermissions,
} = require("../../Structures/Functions/nicerPermissions");
const Event = require("../../Structures/Classes/Event");
const { MessageEmbed } = require("discord.js");

module.exports = new Event("interactionCreate", async (client, interaction) => {
  if (interaction.isCommand()) {
    /**
     * @type {import("../../Structures/Typescript/SlashCommand").SlashCommandType}
     */
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        content: "An error has occured 😢",
        ephemeral,
      });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    if (
      cmd.developerCommand &&
      !client.config.developerIDs?.includes(interaction.user.id)
    )
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Developer Command")
            .setDescription(
              `This command is command can only be run by the developer${
                client.config.developerIDs.length == 0 ? "" : "s"
              }`
            )
            .setColor("RED"),
        ],
      });

    if (
      cmd.guildCommand &&
      !client.config.guildIDs?.includes(interaction.guild.id)
    )
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Server Only Command")
            .setDescription(
              `This command is command can only be run in some servers.`
            )
            .setColor("RED"),
        ],
      });

    if (
      cmd.guildOwnerCommand &&
      interaction.guild.ownerId !== interaction.user.id
    )
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Owner Command")
            .setDescription(
              `This command is command can only be run by the owner of this server.`
            )
            .setColor("RED"),
        ],
      });

    if (
      cmd.adminCommand &&
      !interaction.memberPermissions.has("ADMINISTRATOR")
    )
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Admin Command")
            .setDescription(
              `This command is command can only be run by the admin of this server.`
            )
            .setColor("RED"),
        ],
      });

    if (cmd.nsfwCommand && !interaction.channel.nsfw)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("NSFW Command")
            .setDescription(
              "This command is nsfw you can only use this in an nsfw enabled channel."
            )
            .setColor("RED"),
        ],
      });

    if (!interaction.memberPermissions.has(cmd.userPermissions || []))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "You do not have the required permissions to use this command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.userPermissions
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("RED"),
        ],
        ephemeral: true,
      });

    if (!interaction.guild.me.permissions.has(cmd.myPermissions || []))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "I do not have the required permissions to run this command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.myPermissions
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("RED"),
        ],
        ephemeral: true,
      });

    await cmd.run({ client, interaction, args });
  }

  if (interaction.isContextMenu()) {
    const command = client.slashCommands.get(interaction.commandName);

    command.run({ client, interaction });
  }
});
