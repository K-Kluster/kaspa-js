#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import { initProject } from "./init-project.js";

const program = new Command();

program
  .name("kaspa-starter")
  .description("CLI to bootstrap a Kaspa project")
  .option("--dev", "Use local starter kits for development")
  .option("-t, --type <type>", "Project type (react, nodejs, svelte)")
  .action(async (options) => {
    let projectType = options.type;

    if (!projectType) {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "projectType",
          message: "Which starter kit would you like to use?",
          choices: ["react", "nodejs", "svelte"],
        },
      ]);
      projectType = answers.projectType;
    }
    let starterKitName = "";
    if (projectType === "react") starterKitName = "react-starter-kit";
    if (projectType === "nodejs") starterKitName = "node-starter-kit";
    if (projectType === "svelte") starterKitName = "svelte-starter-kit";

    const projectDir = `./${projectType}-starter`;

    console.log(`Bootstrapping ${projectType} project in ${projectDir}...`);
    await initProject({
      projectType,
      projectDir,
      starterKitName,
      dev: options.dev,
    });
  });

program.parse(process.argv);
