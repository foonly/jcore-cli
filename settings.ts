import {access, readFile} from 'fs/promises';
import * as process from "process";
import type {JcoreSettings} from "@/types";
import {join, parse} from "path";
import {homedir} from "os";
import {fileExists} from "@/utils";

export async function readSettings(): Promise<JcoreSettings> {
    const globalConfig = join(homedir(), '.config/jcore/config');

    // Default settings.
    const settings = {
        path: process.cwd(),
        mode: 'foreground',
        debug: 0
    } as JcoreSettings;

    // Find the project base path.
    while (settings.path.length > 1 && !await fileExists(join(settings.path, "config.sh"))) {
        // Go up one level and try again.
        settings.path = parse(settings.path).dir;
    }
    // Check if we are in a project.
    settings.inProject = settings.path.length > 1;

    if (await fileExists(globalConfig)) {
        // Read global settings if they exist.
        await readFile(globalConfig, 'utf8').then(data => {
            for (let [key, value] of parseSettings(data)) {
                setSetting(settings, key, value);
            }
        });
    }

    if (settings.inProject) {
        // Read project settings if in project.
        await readFile(join(settings.path, '/config.sh'), 'utf8').then(data => {
            for (let [key, value] of parseSettings(data)) {
                setSetting(settings, key, value);
            }
        });
    }

    if (!settings.name) {
        // If name is not set, use folder name.
        settings.name = parse(settings.path).base;
    }

    return settings;
}

function parseSettings(data: string): Map<string, string> {
    // Create new HashMap for values.
    const values = new Map();
    // Look for all BASH variable assignments. TODO handle BASH arrays.
    for (let match of data.matchAll(/^([A-Z_]+)=(.+)$/gm)) {
        // Remove wrapping double quotes.
        let value = match[2].replace(/^"|"$/gm, '');
        // Look for all references to BASH variables.
        for (let varMatch of value.matchAll(/\$([A-Z_]+)/gm)) {
            const key = varMatch[1].toLowerCase();
            if (values.has(key)) {
                // If variable exists in map, substitute variable for value.
                value = value.replace(varMatch[0], values.get(key));
            }
        }
        // Assign value to map.
        values.set(match[1].toLowerCase(), value);
    }
    return values;
}

function setSetting(settings: JcoreSettings, key: string, value: string) {
    switch (key) {
        case 'path':
            settings.path = value;
            break;
        case 'mode':
            settings.mode = value;
            break;
        case 'debug':
            settings.debug = Number(value);
            break;
        case 'name':
            settings.name = value;
            break;
        case 'theme':
            settings.theme = value;
            break;
        case 'branch':
            settings.branch = value;
            break;
        case 'plugin_install':
            settings.plugins = value;
            break;
    }
}