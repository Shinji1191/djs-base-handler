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
  /** Category of the command */
  category: string;
  /** Examples for the command */
  examples?: string[];
  /** Permissions for the command */
  permissions?: {
    /** Checks if I have this permission(s) */
    me?: PermissionResolvable[]
    /** Checks if the user have this permission(s) */
    user?: PermissionResolvable[]
  }
  /** Configuration For The Command */
  config?: {
    /** Checks if the person who ran this command is the developer */
    developer?: boolean
    /** Checks if the person who ran this command is the owner of the server */
    owner?: boolean
    /** Checks if the channel is NSFW enabled */
    nsfw?: boolean
    /** Checks if the command is a guild only */
    guild?: boolean
  }
  /** Running The Command */
  run: RunFunction;
} & ChatInputApplicationCommandData;
