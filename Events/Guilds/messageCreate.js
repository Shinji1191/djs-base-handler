const { nicerPermissions } = require("../../Structures/Functions/nicerPermissions");
const Command = require("../../Structures/Classes/Command");
const Event = require("../../Structures/Classes/Event");
const { MessageEmbed } = require("discord.js");

module.exports = new Event("messageCreate", async (client, message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(client.config.prefix)
  )
    return;

  const [cmd, ...args] = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);
  
  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.get(client.aliases.get(cmd.toLowerCase()));

  if (!command) return;

  if (command.developerCommand && !client.config.developerIDs?.includes(message.author.id)) return message.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Developer Command")
        .setDescription(`This command is command can only be run by the developer${client.config.developerIDs.length == 0 ? "" : "s"}`)
        .setColor("RED")
    ]
  })

  if (command.guildCommand && !client.config.guildIDs?.includes(message.guild.id)) return message.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Server Only Command")
        .setDescription(`This command is command can only be run in some servers.`)
        .setColor("RED")
    ]
  })

  if (command.guildOwnerCommand && message.guild.ownerId !== message.author.id) return message.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Owner Command")
        .setDescription(`This command is command can only be run by the owner of this server.`)
        .setColor("RED")
    ]
  })

  if (command.adminCommand && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Admin Command")
        .setDescription(`This command is command can only be run by the admin of this server.`)
        .setColor("RED")
    ]
  })

  if (command.nsfwCommand && !message.channel.nsfw)
    return message.reply({
      embeds: [
        new MessageEmbed()
        .setTitle("NSFW Command")
        .setDescription("This command is nsfw you can only use this in an nsfw enabled channel.")
        .setColor("RED")
      ],
    });

  if (!message.member.permissions.has(command.userPermissions || []))
    return message.reply({
      embeds: [
        new MessageEmbed()
        .setTitle("Missing Permisssion")
        .setDescription("You do not have the required permissions to use this command.")
        .addField("Required Permissions", `\`\`\`${command.userPermissions.map((perm) => nicerPermissions(perm)).join("\n")}\`\`\``)
        .setColor("RED")
      ],
    });

  if (!message.guild.me.permissions.has(command.myPermissions || []))
    return message.reply({
      embeds: [
        new MessageEmbed()
        .setTitle("Missing Permisssion")
        .setDescription("I have some required permissions to run this command.")
        .addField("Required Permissions", `\`\`\`${command.myPermissions.map((perm) => nicerPermissions(perm)).join("\n")}\`\`\``)
        .setColor("RED")
      ],
    });

  
  await command.run({ client, message, args });
});
