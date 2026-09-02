const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * InfoPlist.strings を en / ja の lproj に生成する Expo config plugin。
 * Info.plist の許可メッセージなどをローカライズする。
 */

const STRINGS = {
  en: {
    NSPhotoLibraryUsageDescription: "Used to attach images to journal entries.",
  },
  ja: {
    NSPhotoLibraryUsageDescription: "ジャーナルに画像を添付するために使用します。",
  },
};

function buildStringsFile(entries) {
  return Object.entries(entries)
    .map(([key, value]) => `"${key}" = "${value}";`)
    .join("\n");
}

module.exports = function withInfoPlistStrings(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const { projectName, platformProjectRoot } = config.modRequest;
      const projectDir = path.join(platformProjectRoot, projectName);

      for (const [locale, entries] of Object.entries(STRINGS)) {
        const lprojDir = path.join(projectDir, `${locale}.lproj`);
        fs.mkdirSync(lprojDir, { recursive: true });

        const filePath = path.join(lprojDir, "InfoPlist.strings");
        fs.writeFileSync(filePath, buildStringsFile(entries));
      }

      return config;
    },
  ]);
};
