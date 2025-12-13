#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import { initProject } from "./init-project.js";

const program = new Command();

program
  .name("kaspa-starter")
  .description("CLI to bootstrap a Kaspa project")
  .option("--dev", "Use local starter kits for development")
  .action(async (options) => {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "projectType",
        message: "Which starter kit would you like to use?",
        choices: ["react", "nodejs"],
      },
    ]);

    const projectType = answers.projectType;
    const projectDir = `./${projectType}-starter`;
    const starterKitName =
      projectType === "nodejs" ? "node-starter-kit" : "react-starter-kit";

    console.log(`Bootstrapping ${projectType} project in ${projectDir}...`);
    await initProject({
      projectType,
      projectDir,
      starterKitName,
      dev: options.dev,
    });
  });

program.parse(process.argv);
