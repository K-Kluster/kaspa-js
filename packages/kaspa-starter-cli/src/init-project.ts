import { fileURLToPath } from "url";
import path from "path";
import fs from "fs-extra";
import axios from "axios";
import extract from "extract-zip";
import ora from "ora";
import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_API_URL =
  "https://api.github.com/repos/kaspanet/rusty-kaspa/releases/latest";

async function getLatestSdkUrl() {
  const fetchUrlSpinner = ora("Fetching latest SDK URL...").start();
  try {
    const response = await axios.get(GITHUB_API_URL);
    const assets = response.data.assets;
    const sdkAsset = assets.find(
      (asset: any) =>
        asset.name.startsWith("kaspa-wasm32-sdk-v") &&
        asset.name.endsWith(".zip"),
    );

    if (sdkAsset) {
      fetchUrlSpinner.succeed("Latest SDK URL fetched");
      return sdkAsset.browser_download_url;
    } else {
      fetchUrlSpinner.fail("Could not find SDK asset in the latest release.");
      throw new Error("Could not find SDK asset in the latest release.");
    }
  } catch (error) {
    fetchUrlSpinner.fail("Failed to fetch latest SDK URL");
    throw error;
  }
}

export async function initProject({
  projectType,
  projectDir,
  starterKitName,
  dev,
}: {
  projectType: string;
  projectDir: string;
  starterKitName: string;
  dev?: boolean;
}) {
  const projectPath = path.resolve(process.cwd(), projectDir);

  if (dev) {
    const starterKitPath = path.resolve(
      __dirname,
      "../../..",
      "apps",
      starterKitName,
    );
    const copySpinner = ora("Copying starter kit from local path...").start();
    try {
      await fs.copy(starterKitPath, projectPath, {
        filter: (src) =>
          !src.includes("node_modules") && !src.includes(".turbo"),
      });
      copySpinner.succeed("Starter kit copied");
    } catch (error) {
      copySpinner.fail("Failed to copy starter kit");
      console.error(error);
      return;
    }
  } else {
    const repoDownloadSpinner = ora("Downloading starter kit...").start();
    const repoUrl = "https://github.com/K-Kluster/kaspa-js/archive/master.zip";
    const repoTempDir = path.join(process.cwd(), ".tmp-kaspa-starter");
    const repoZipPath = path.join(repoTempDir, "repo.zip");

    try {
      await fs.ensureDir(repoTempDir);
      const response = await axios({
        url: repoUrl,
        method: "GET",
        responseType: "stream",
      });
      const writer = fs.createWriteStream(repoZipPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      repoDownloadSpinner.succeed("Starter kit downloaded");

      const repoExtractSpinner = ora("Extracting starter kit...").start();
      await extract(repoZipPath, { dir: repoTempDir });

      const extractedRepoPath = path.join(repoTempDir, "kaspa-js-master");
      const starterKitPath = path.join(
        extractedRepoPath,
        "apps",
        starterKitName,
      );

      await fs.copy(starterKitPath, projectPath, {
        filter: (src) =>
          !src.includes("node_modules") && !src.includes(".turbo"),
      });
      repoExtractSpinner.succeed("Starter kit extracted");
    } catch (error) {
      repoDownloadSpinner.fail("Failed to download or extract starter kit");
      console.error(error);
    } finally {
      await fs.remove(repoTempDir);
    }
  }

  const tempDir = path.join(projectPath, ".tmp");
  await fs.ensureDir(tempDir);
  const zipPath = path.join(tempDir, "sdk.zip");

  const downloadSpinner = ora("Downloading Kaspa WASM SDK...").start();
  try {
    const sdkUrl = await getLatestSdkUrl();
    const response = await axios({
      url: sdkUrl,
      method: "GET",
      responseType: "stream",
    });
    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    downloadSpinner.succeed("Kaspa WASM SDK downloaded");
  } catch (error) {
    downloadSpinner.fail("Failed to download Kaspa WASM SDK");
    console.error(error);
    return;
  }

  const extractSpinner = ora("Extracting SDK...").start();
  const vendorDir = path.join(projectPath, "vendor", "kluster");
  const platform = projectType === "react" ? "web" : "node";
  const sdkDirName = `kaspa-wasm-${platform}`;
  const sdkVendorPath = path.join(vendorDir, sdkDirName);

  try {
    await extract(zipPath, { dir: tempDir });
    const extractedSdkPath = path.join(
      tempDir,
      "kaspa-wasm32-sdk",
      platform === "node" ? "nodejs" : "web",
      "kaspa",
    );
    await fs.ensureDir(vendorDir);
    await fs.move(extractedSdkPath, sdkVendorPath);
    extractSpinner.succeed("SDK extracted");
  } catch (error) {
    extractSpinner.fail("Failed to extract SDK");
    console.error(error);
    return;
  } finally {
    await fs.remove(tempDir);
  }

  const updateSpinner = ora("Updating package.json...").start();
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);

    const wasmPackageName = `@kluster/kaspa-wasm-${projectType === "react" ? "web" : "node"}`;
    const sdkDirName = `kaspa-wasm-${projectType === "react" ? "web" : "node"}`;
    packageJson.dependencies[wasmPackageName] =
      `file:./vendor/kluster/${sdkDirName}`;

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    updateSpinner.succeed("package.json updated");
  } catch (error) {
    updateSpinner.fail("Failed to update package.json");
    console.error(error);
    return;
  }

  const installSpinner = ora("Installing dependencies...").start();
  try {
    await execa("npm", ["install"], { cwd: projectPath });
    installSpinner.succeed("Dependencies installed");
  } catch (error) {
    installSpinner.fail("Failed to install dependencies");
    console.error(error);
    return;
  }

  console.log(`\nSuccess! Your project is ready at ${projectPath}`);
  console.log("To get started:");
  console.log(`  cd ${projectDir}`);
  console.log("  npm run dev");
}
