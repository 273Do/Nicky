const { withDangerousMod, withXcodeProject } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const ROOT_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>StringsTable</key>
\t<string>Root</string>
\t<key>PreferenceSpecifiers</key>
\t<array/>
</dict>
</plist>`;

/**
 * Settings.bundle を iOS プロジェクトに追加する Expo config plugin。
 * これにより Linking.openSettings() で Settings → Nicky に直接遷移できる。
 */
module.exports = function withSettingsBundle(config) {
  // Step 1: Settings.bundle ディレクトリと Root.plist をファイルシステムに作成
  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      const { platformProjectRoot } = config.modRequest;
      const settingsBundlePath = path.join(platformProjectRoot, "Settings.bundle");

      if (!fs.existsSync(settingsBundlePath)) {
        fs.mkdirSync(settingsBundlePath, { recursive: true });
      }

      const rootPlistPath = path.join(settingsBundlePath, "Root.plist");
      if (!fs.existsSync(rootPlistPath)) {
        fs.writeFileSync(rootPlistPath, ROOT_PLIST);
      }

      return config;
    },
  ]);

  // Step 2: Xcode プロジェクトに Settings.bundle を登録
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;

    if (!xcodeProject.hasFile("Settings.bundle")) {
      const { addResourceFileToGroup } = require("@expo/config-plugins/build/ios/utils/Xcodeproj");
      addResourceFileToGroup({
        filepath: "Settings.bundle",
        groupName: config.modRequest.projectName,
        project: xcodeProject,
      });
    }

    return config;
  });

  return config;
};
