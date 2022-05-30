const Command = require("../../Structures/Classes/Command");
const { version } = require("../../package.json");
const {
  MessageEmbed,
  version: djsversion,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const ms = require("ms");
const os = require("os");

module.exports = new Command({
  name: "statistics",
  description: "Get Developer and Bot statistics",
  category: "Bot",
  aliases: ["stats"],
  permissions: {
    me: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
  },
  run: async ({ client, message }) => {
    const cpu = os.cpus()[0];
    const memory = process.memoryUsage();

    const developerBtnD = new MessageButton()
      .setCustomId("developer")
      .setDisabled(true)
      .setLabel("Developer Statistics")
      .setStyle("PRIMARY");
    const botBtnD = new MessageButton()
      .setCustomId("bot")
      .setDisabled(true)
      .setLabel("My Statistics")
      .setStyle("PRIMARY");
    const homeBtnD = new MessageButton()
      .setCustomId("home")
      .setDisabled(true)
      .setLabel("Home")
      .setStyle("PRIMARY")
      .setEmoji("🏘️");

    const developerBtnE = new MessageButton()
      .setCustomId("developer")
      .setDisabled(false)
      .setLabel("Developer Statistics")
      .setStyle("PRIMARY");
    const botBtnE = new MessageButton()
      .setCustomId("bot")
      .setDisabled(false)
      .setLabel("My Statistics")
      .setStyle("PRIMARY");
    const delBtnE = new MessageButton()
      .setCustomId("delete")
      .setDisabled(false)
      .setLabel("Delete Menu")
      .setStyle("DANGER");
    const homeBtnE = new MessageButton()
      .setCustomId("home")
      .setDisabled(false)
      .setLabel("Home")
      .setStyle("PRIMARY")
      .setEmoji("🏘️");

    const panelRow = new MessageActionRow().addComponents(
      homeBtnD,
      developerBtnE,
      botBtnE,
      delBtnE
    );
    const devPanelRow = new MessageActionRow().addComponents(
      homeBtnE,
      developerBtnD,
      botBtnE,
      delBtnE
    );
    const botPanelRow = new MessageActionRow().addComponents(
      homeBtnE,
      developerBtnE,
      botBtnD,
      delBtnE
    );

    const filter = (interaction) => {
      if (interaction.user.id === message.author.id) return true;
      else return void interaction.reply({ content: "This is not for you" });
    };

    const panel = new MessageEmbed()
      .setTitle("Statistics Panel")
      .setDescription("```Choose a button to get the statistics```")
      .setColor("RANDOM");

    const msg = await message.reply({
      embeds: [panel],
      components: [panelRow],
    });

    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      filter,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "developer") {
        const devStats = new MessageEmbed()
          .setTitle("Developer Statistics")
          .setColor("RANDOM")
          .setThumbnail((await (client.application.fetch())).owner.displayAvatarURL({ dynamic: true }))
          .addFields(
            {
              name: "Versions 📦",
              value: `\
          **Node.js:** ${process.version}
          **Discord.js:** v${djsversion}`,
              inline: true,
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: true,
            },
            {
              name: "Memory Usage 📊",
              value: `\
          **RSS:** ${formatBytes(memory.rss)}
          **Total:** ${formatBytes(memory.heapTotal)}
          **Used:** ${formatBytes(memory.heapUsed)}`,
              inline: true,
            },
            {
              name: "CPU Info 💻",
              value: `\
          **Model:** ${cpu?.model}
          **Speed:** ${
            cpu?.speed && os.cpus().length > 1
              ? cpu?.speed * os.cpus().length
              : cpu?.speed
          } MHz`,
              inline: true,
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: true,
            },
            {
              name: "System Info 📋",
              value: `\
          **Platform:** ${os.platform()}
          **Architecture:** ${os.arch()}
          **Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
              inline: true,
            }
          );

        interaction.update({
          embeds: [devStats],
          components: [devPanelRow],
        });
      }

      if (interaction.customId === "bot") {
        const botStats = new MessageEmbed()
          .setTitle("My Statistics")
          .addFields(
            {
              name: "Client",
              value: `
              **Username:** ${client.user.username}
              **Tag:** ${client.user.tag}
              **ID:** ${client.user.id}
              `,
              inline: true,
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: true,
            },
            {
              name: "Servers & Users",
              value: `
              **Servers:** ${client.guilds.cache.size.toLocaleString()}
              **Users:** ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()}
              
              `,
              inline: true,
            },
            {
              name: "Channels, Categories, Voice Channels",
              value: `
              **Text Channels:** ${client.channels.cache
                .filter((ch) => ch.type === "GUILD_TEXT")
                .size.toLocaleString()}
              **Voice Channels:** ${client.channels.cache
                .filter((ch) => ch.type === "GUILD_VOICE")
                .size.toLocaleString()}
              **Categories:** ${client.channels.cache
                .filter((ch) => ch.type === "GUILD_CATEGORY")
                .size.toLocaleString()}
              `,
              inline: true
            },
            {
              name: "\u200b",
              value: `\u200b`,
              inline: true,
            },
            {
              name: "Misc",
              value: `
              **Websocket Ping:** ${client.ws.ping.toLocaleString()}ms
              **Commands:** ${client.commands.size}
              **Slash Commands:** ${client.slashCommands.size}
              **Version:** ${version}
              `,
              inline: true,
            }
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("RANDOM");
        interaction.update({
          embeds: [botStats],
          components: [botPanelRow],
        });
      }

      if (interaction.customId === "home") {
        interaction.update({ embeds: [panel], components: [panelRow] })
      }

      if (interaction.customId === "delete") {
        message.delete()
        msg.delete()
      }
    });
  },
});

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
