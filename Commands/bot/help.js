const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const {
  nicerPermissions,
} = require("../../Structures/Functions/nicerPermissions");
const Command = require("../../Structures/Classes/Command");

module.exports = new Command({
  name: "help",
  description: "View all the bots command",
  aliases: ["h", "cmd", "cmds"],
  category: "bot",
  examples: ["[command name]", "[command alias]"],
  permissions: {
    me: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
  },
  run: async ({ client, message, args }) => {
    const prefix = client.config.prefix;
    if (!args.length) {
      const emojis = {
        bot: "🤖",
        information: "❔",
        fun: "🎈",
      }; // Command Directory Emojis

      const ignored = []; //The categories you want to ignore.
      const directories = [
        ...new Set(
          client.commands
            .filter((cmd) => !ignored?.includes(cmd.directory))
            .map((cmd) => cmd.directory)
        ),
      ];

      const formattedString = (string) =>
        `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;

      const categories = directories.map((dir) => {
        const getCommands = client.commands
          .filter((cmd) => cmd.directory === dir)
          .map((cmd) => {
            return {
              name: cmd.name || "No Command Name.",
              description: cmd.description || "No Command Description.",
            };
          });

        return {
          directory: formattedString(dir),
          commands: getCommands,
        };
      });

      const initEmbed = new MessageEmbed()
        .setTitle("Help Command")
        .setDescription("```Please Choose a Command Category Below.```")
        .setColor("RANDOM");

      const homePanel = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("home")
          .setDisabled(true)
          .setEmoji("📄")
          .setLabel("Home")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("all-commands")
          .setDisabled(false)
          .setEmoji("📜")
          .setLabel("All Commands")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      )

      const allCommandsPanel = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("home")
          .setDisabled(false)
          .setEmoji("📄")
          .setLabel("Home")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("all-commands")
          .setDisabled(true)
          .setEmoji("📜")
          .setLabel("All Commands")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      )

      const allEnabledPanel = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("home")
          .setDisabled(false)
          .setEmoji("📄")
          .setLabel("Home")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("all-commands")
          .setDisabled(false)
          .setEmoji("📜")
          .setLabel("All Commands")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("delete")
          .setDisabled(false)
          .setEmoji("🗑️")
          .setLabel("Delete Menu")
          .setStyle("DANGER")
      )

      const selectPanel = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setDisabled(false)
          .setPlaceholder("📬 Choose a category here")
          .setOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands From ${cmd.directory}`,
                emoji: emojis[cmd.directory.toLowerCase()] || null,
              };
            })
          )
      )

      const filter = (interaction) => {
        if (interaction.user.id === message.author.id) return true;
        else
          return void interaction.reply({
            content: "This help menu is not for you.",
            ephemeral: true,
          });
      };

      let initMessage = await message.reply({
        embeds: [initEmbed],
        components: [homePanel, selectPanel],
      });

      const collector = initMessage.createMessageComponentCollector({
        filter,
      });

      collector.on("collect", (interaction) => {
        if (interaction.isSelectMenu()) {
          if (interaction.customId === "help-menu") {
            const [directory] = interaction.values;
            const category = categories.find(
              (x) => x.directory.toLowerCase() === directory
            );

            const updateEmbed = new MessageEmbed()
              .setTitle(`Commands from ${category.directory}`)
              .addFields(
                category.commands.map((cmd) => {
                  return {
                    name: `\`${prefix}${cmd.name}\``,
                    value: `${cmd.description}`,
                    inline: true,
                  };
                })
              )
              .setColor("RANDOM")
              .setTimestamp();

            interaction.update({ embeds: [updateEmbed], components: [allEnabledPanel, selectPanel] });
          }
        }

        if (interaction.isButton()) {
          if (interaction.customId === "delete") {
            message.delete()
            initMessage.delete();
          }

          if (interaction.customId === "all-commands") {
            
            const commands = categories.map((cmd) => {
              const dirEmojis = emojis[cmd.directory.toLowerCase()] || ""
              return {
                name: `${dirEmojis} ${cmd.directory}`,
                value: `${cmd.commands
                  .map((cmd) => `\`${cmd.name}\``)
                  .join(", ")}`,
                inline: false,
              };
            });

            const all = new MessageEmbed()
              .setDescription(
                `Need Help?, use \`${prefix}help\` and select from the dropdown menu, for more command information use \`${prefix}help <command>\``
              )
              .addFields(commands)
              .setColor("RANDOM");
            interaction.update({ embeds: [all], components: [allCommandsPanel, selectPanel] });
          }
        }

        if (interaction.customId === "home") {
          interaction.update({ embeds: [initEmbed], components: [homePanel, selectPanel] });
        }
      });
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.get(client.aliases.get(args[0].toLowerCase()));

      if (!command)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Command")
              .setDescription(
                `That command does not exist, use \`${prefix}help\` to get all the valid commands.`
              )
              .setColor("RED"),
          ],
        });

      const { config, permissions } = command

      const deleteButton = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("delete")
            .setDisabled(false)
            .setEmoji("🗑️")
            .setLabel("Delete Menu")
            .setStyle("DANGER")
      );

      const commandInformation = new MessageEmbed()
        .setTitle(`${command.name.toUpperCase()} INFORMATION`)
        .addFields(
          {
            name: "Command Name:",
            value: `\`\`\`${command.name ? command.name : "No Name"}\`\`\``,
          },
          {
            name: "Command Description:",
            value: `\`\`\`${
              command.description ? command.description : "No Description"
            }\`\`\``,
          },
          {
            name: "Command Category:",
            value: `\`\`\`${
              command.category ? command.category : "No Category"
            }\`\`\``,
          },
          {
            name: "Command Aliases:",
            value: `\`\`\`${
              command.aliases ? command.aliases.join(", ") : "No Aliases"
            }\`\`\``,
          },
          {
            name: "Command Example:",
            value: `\`\`\`${
              command.examples ? command.examples.join(" / ") : "No Examples"
            }\`\`\``,
          },
          {
            name: "Developer Command",
            value: `\`\`\`${config?.developer ? "Yes" : "No"}\`\`\``
          },
          {
            name: "Guild Only Command",
            value: `\`\`\`${config?.guild ? "Yes" : "No"}\`\`\``
          },
          {
            name: "Nsfw Command",
            value: `\`\`\`${config?.nsfw ? "Yes" : "No"}\`\`\``,
          },
          {
            name: "Owner Command",
            value: `\`\`\`${config?.owner ? "Yes" : "No"}\`\`\``,
          },
          {
            name: "Permissions Needed (User)",
            value: `\`\`\`${permissions?.user ? permissions?.user.map((perm) => nicerPermissions(perm.toString())) : "No permissions needed"}\`\`\``,
            inline: true
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: true
          },
          {
            name: "Permissions Needed (Me)",
            value: `\`\`\`${permissions?.me ? permissions?.me.map((perm) => nicerPermissions(perm.toString())) : "No permissions needed"}\`\`\``,
            inline: true
          },
        )
        .setFooter({
          iconURL: client.user.displayAvatarURL(),
          text: `${client.user.username}`,
        });
      const msg = await message.reply({ embeds: [commandInformation], components: [deleteButton] });

      const filter = (i) => {
        if (i.user.id === message.author.id) return true;
        else
          return void i.reply({
            content: "This help menu is not for you.",
            ephemeral: true,
          });
      };
      const collector = msg.createMessageComponentCollector({
        filter,
        componentType: "BUTTON"
      });

      collector.on("collect", (i) => {
        if (i.customId === "delete") {
          message.delete()
          msg.delete();
        }
      })
    }
  },
});
