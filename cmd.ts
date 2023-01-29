import type {cmdData} from "@/types";
import update, {selfUpdate} from "@/commands/update";
import start, {stop, pull} from "@/commands/docker";
import {isProject} from "@/utils";
import {settings} from "@/settings";
import {helpCmd} from "@/help";
import {createProject} from "@/commands/create";
import process from "process";
import {join} from "path";

export function runCmd(data: cmdData) {
    switch (data.cmd) {
        case "update":
            if (data.target.includes('self')) {
                selfUpdate(data);
                // Update self.
            } else {
                if (isProject()) {
                    // Update project.
                    update(data);
                }

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
                stop(data);
            }
            break;
        case "pull":
            if (isProject()) {
                // Pull data from upstream.
                pull(data);
            }
            break;
        case "init":
            if (isProject(false)) {
                // Create new project.
                if (data.target[0]) {
                    settings.name = data.target[0];
                    settings.path = join(process.cwd(),settings.name);
                    createProject(data);
                } else {
                    helpCmd(data, false);
                }
            }
    }
}