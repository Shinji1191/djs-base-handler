const {
  nicerPermissions,
} = require("../../Structures/Functions/nicerPermissions");
const Event = require("../../Structures/Classes/Event");
const { MessageEmbed } = require("discord.js");

module.exports = new Event({
  event: "interactionCreate",
  async run (client, interaction) {
    if (interaction.isCommand()) {
      /**
       * @type {import("../../Structures/Typescript/SlashCommand").SlashCommandType}
       */
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd)
        return interaction.reply({
          content: "An error has occured 😢",
          ephemeral: true,
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

      const { permissions, config } = cmd
  
      if (
        config?.developer &&
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
        config?.guild &&
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
        config?.owner &&
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
        })
  
      if (config?.nsfw && interaction.channel.type === "GUILD_TEXT" && !interaction.channel.nsfw)
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
  
      if (!interaction.memberPermissions.has(permissions?.user || []))
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Missing Permisssion")
              .setDescription(
                "You do not have the required permissions to use this command."
              )
              .addField(
                "Required Permissions",
                `\`\`\`${permissions?.user
                  .map((perm) => nicerPermissions(perm))
                  .join("\n")}\`\`\``
              )
              .setColor("RED"),
          ],
          ephemeral: true,
        });
  
      if (!interaction.guild.me.permissions.has(permissions?.me || []))
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Missing Permisssion")
              .setDescription(
                "I do not have the required permissions to run this command."
              )
              .addField(
                "Required Permissions",
                `\`\`\`${permissions?.me
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

    if (interaction.isAutocomplete()) {
      if (interaction.commandName === "help") {
        const commandOption = interaction.options.getString("command")
        const commands = [...client.slashCommands.values()]

        let responses = []
        commands.forEach(({ name }) => {
          responses.push({
            name: name,
            value: name,
          })
        })

        let filtered = responses.filter((x) => x.name?.includes(commandOption.toLowerCase())).sort()

        interaction.respond(filtered.map((x) => ({ name: x.name, value: x.name })).slice(0, 25))
      }
    }
  }
})