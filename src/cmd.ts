import type { cmdData } from "@/types";
import update, { selfUpdate } from "@/commands/update";
import { start, stop, pull, runCommand } from "@/commands/run";
import { isProject } from "@/utils";
import { helpCmd } from "@/help";
import { copyChildTheme, createProject } from "@/commands/create";
import { cloneProject } from "@/commands/clone";
import { set } from "@/commands/set";
import { doctor } from "@/commands/doctor";
import { jcoreSettingsData, writeSettings } from "@/settings";
import { logger } from "@/logger";
import { listChecksums, setChecksum } from "@/commands/checksum";

/**
 * Invokes functions for all the different commands. Sanity checking should be done here,
 * like if the command needs to be in a project to run.
 * @param data
 */
export function runCmd(data: cmdData): void {
  switch (data.cmd) {
    case "checksum":
      if (isProject()) {
        switch (data.target.shift()) {
          case "list":
            listChecksums();
            break;
          case "set":
            setChecksum(data.target);
            break;
          default:
            helpCmd(data, false);
            break;
        }
      }
      break;
    case "child":
      if (isProject()) {
        // Create Child Theme.
        if (data.target[0]) {
          if (copyChildTheme(data.target.join(" "))) {
            // Save settings.
            writeSettings();
            logger.info(`Theme ${jcoreSettingsData.theme} created.`);
          } else {
            logger.error("Theme creation failed!");
          }
        } else {
          helpCmd(data, false);
        }
      }
      break;
    case "clean":
      // TODO Clean
      break;
    case "clone":
      if (isProject(false)) {
        // Clone project.
        if (data.target[0]) {
          cloneProject(data);
        } else {
          helpCmd(data, false);
        }
      }
      break;
    case "doctor":
      doctor();
      break;
    case "init":
      if (isProject(false)) {
        // Create new project.
        if (data.target[0]) {
          createProject(data);
        } else {
          helpCmd(data, false);
        }
      }
      break;
    case "pull":
      if (isProject()) {
        // Pull data from upstream.
        pull(data);
      }
      break;
    case "run":
      if (isProject()) {
        if (data.target.length > 0) {
          // Run command.
          runCommand(data.target.join(" "));
        } else {
          helpCmd(data, false);
        }
      }
      break;
    case "set":
      if (data.target.length > 1) {
        set(data);
      } else {
        helpCmd(data, false);
      }
      break;
    case "shell":
      if (isProject()) {
        // Open a shell.
        runCommand("/bin/bash");
      }
      break;
    case "start":
      if (isProject()) {
        // Start the project.
        start(data);
      }
      break;
    case "stop":
      if (isProject()) {
        // Start the project.
        stop();
      }
      break;
    case "update":
      if (data.target.includes("self")) {
        // Update self.
        selfUpdate();
      } else {
        if (isProject()) {
          // Update project.
          update(data);
        }
      }
      break;
  }
}
