import { ContextMenuInteraction, MessageApplicationCommandData, UserApplicationCommandData } from "discord.js"
import ExtendedClient from "../Client"

interface RunOptions {
  client: ExtendedClient,
  interaction: ContextMenuInteraction
}

type Run = (options: RunOptions) => any

export type contextType = {
  category: string
  run: Run
} & UserApplicationCommandData | MessageApplicationCommandData