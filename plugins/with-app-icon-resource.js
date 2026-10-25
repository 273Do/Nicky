const { withDangerousMod, withXcodeProject } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * アプリアイコン画像を iOS バンドルリソースに追加する config plugin。
 * SwiftUI Image の uiImage から file:// パスで参照可能になる。
 */
module.exports = function withAppIconResource(config) {
  // Step 1: 画像ファイルを iOS プロジェクトにコピー
  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      const { platformProjectRoot, projectName, projectRoot } = config.modRequest;
      const imageDir = path.join(projectRoot, "assets/images/app-icon");
      const destDir = path.join(platformProjectRoot, projectName);

      const files = fs.readdirSync(imageDir).filter((f) => f.endsWith(".png"));
      for (const file of files) {
        fs.copyFileSync(path.join(imageDir, file), path.join(destDir, file));
      }

      return config;
    },
  ]);

  // Step 2: Xcode プロジェクトにリソースとして登録
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const { projectName, projectRoot } = config.modRequest;
    const imageDir = path.join(projectRoot, "assets/images/app-icon");

    // Resources グループがなければ作成
    if (!xcodeProject.pbxGroupByName("Resources")) {
      const resourcesGroupUuid = xcodeProject.generateUuid();
      const mainGroupKey = xcodeProject.findPBXGroupKey({ name: projectName });

      if (!xcodeProject.hash.project.objects["PBXGroup"]) {
        xcodeProject.hash.project.objects["PBXGroup"] = {};
      }
      xcodeProject.hash.project.objects["PBXGroup"][resourcesGroupUuid] = {
        isa: "PBXGroup",
        children: [],
        name: "Resources",
        sourceTree: '"<group>"',
      };
      xcodeProject.hash.project.objects["PBXGroup"][resourcesGroupUuid + "_comment"] = "Resources";

      if (mainGroupKey) {
        const mainGroup = xcodeProject.getPBXGroupByKey(mainGroupKey);
        if (mainGroup) {
          mainGroup.children.push({ value: resourcesGroupUuid, comment: "Resources" });
        }
      }
    }

    const files = fs.readdirSync(imageDir).filter((f) => f.endsWith(".png"));
    for (const file of files) {
      const filePath = path.join(projectName, file);
      if (!xcodeProject.hasFile(filePath)) {
        xcodeProject.addResourceFile(filePath, {
          target: xcodeProject.getFirstTarget().uuid,
        });
      }
    }

    return config;
  });

  return config;
};
