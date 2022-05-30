import {
  Message,
  PermissionResolvable,
} from "discord.js";
import ExtendedClient from "../Client";

interface RunOptions {
  client: ExtendedClient;
  message: Message;
  args: string[];
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  /** Name of the command */
  name: string;
  /** Description of the command */
  description: string;
  /** Category of the command */
  category: string;
  /** Aliases for the command */
  aliases?: string[];
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
};
