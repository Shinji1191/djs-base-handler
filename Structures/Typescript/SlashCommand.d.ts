import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
import ExtendedClient from "../Client";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type SlashCommandType = {
  userPermissions?: PermissionResolvable[];
  myPermissions?: PermissionResolvable[];
  developerCommand?: boolean
  adminCommand?: boolean
  guildCommand?: boolean
  nsfwCommand?: boolean
  guildOwnerCommand?: boolean
  category: string
  run: RunFunction;
} & ChatInputApplicationCommandData;
