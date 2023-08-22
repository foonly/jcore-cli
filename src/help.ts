import { cmdData } from "@/types";
import { jcoreSettingsData } from "@/settings";
import { commands, flags } from "@/constants";
import { logger } from "@/logger";
import { getFlagValue } from "@/utils";

export function help(cmd: cmdData) {
  logger.info(`Usage: ${jcoreSettingsData.exec} <command> [options] <target>`);

  if (getFlagValue(cmd, "help")) {
    const padding = 16;
    logger.info("\nPossible commands:");
    for (const cmd of commands) {
      logger.info(cmd.cmd.padEnd(padding) + " - " + cmd.text);
    }

    logger.info("\nPossible options:");
    for (const flag of flags) {
      logger.info(("--" + flag.name + " / -" + flag.flag).padEnd(padding) + " - " + flag.text);
    }
  } else {
    logger.info("Use flag --help for more info.");
  }
}

export function helpCmd(cmd: cmdData, text = true, usage = true) {
  const padding = 16;
  for (const command of commands) {
    if (cmd.cmd === command.cmd) {
      logger.info("");
      if (text) {
        logger.info(command.text);
      }
      if (usage) {
        logger.info("Usage:");
        for (const use of command.usage) {
          const part = use.split("-");
          let useText = part[0].trim().padEnd(padding);
          if (part.length > 1) {
            useText += " - " + part[1].trim();
          }
          logger.info(usageText(command.cmd, useText));
        }
      }
    }
  }
}

export function usageText(cmd: string, text: string) {
  return jcoreSettingsData.exec + " " + cmd + " " + text;
}
