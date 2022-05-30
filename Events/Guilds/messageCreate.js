const { nicerPermissions } = require("../../Structures/Functions/nicerPermissions");
const Command = require("../../Structures/Classes/Command");
const Event = require("../../Structures/Classes/Event");
const { MessageEmbed } = require("discord.js");

module.exports = new Event({
  event: "messageCreate",
  async run(client, message) {
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
      
    const { permissions, config } = command

    if (config?.developer && !client.config.developerIDs?.includes(message.author.id)) return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Developer Command")
          .setDescription(`This command is command can only be run by the developer${client.config.developerIDs.length == 0 ? "" : "s"}`)
          .setColor("RED")
      ]
    })
  
    if (config?.guild && !client.config.guildIDs?.includes(message.guild.id)) return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Server Only Command")
          .setDescription(`This command is command can only be run in some servers.`)
          .setColor("RED")
      ]
    })
  
    if (config?.owner && message.guild.ownerId !== message.author.id) return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Owner Command")
          .setDescription(`This command is command can only be run by the owner of this server.`)
          .setColor("RED")
      ]
    })
    
    if (config?.nsfw && message.channel.type === "GUILD_TEXT" && !message.channel.nsfw)
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setTitle("NSFW Command")
          .setDescription("This command is nsfw you can only use this in an nsfw enabled channel.")
          .setColor("RED")
        ],
      });
  
    if (!message.member.permissions.has(permissions?.user || []))
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setTitle("Missing Permisssion")
          .setDescription("You do not have the required permissions to use this command.")
          .addField("Required Permissions", `\`\`\`${permissions?.user.map((perm) => nicerPermissions(perm)).join("\n")}\`\`\``)
          .setColor("RED")
        ],
      });
  
    if (!message.guild.me.permissions.has(permissions?.me || []))
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setTitle("Missing Permisssion")
          .setDescription("I have some required permissions to run this command.")
          .addField("Required Permissions", `\`\`\`${permissions?.me.map((perm) => nicerPermissions(perm)).join("\n")}\`\`\``)
          .setColor("RED")
        ],
      });
  
    
    await command.run({ client, message, args });
  }
});
