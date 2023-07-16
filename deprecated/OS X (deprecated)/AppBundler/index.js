"use strict";
exports.__esModule = true;
exports.AppBundler = void 0;
var child_process = require("child_process");
var yaml = require("js-yaml");
var fs = require("fs");
function AppBundler() {
    var plist = yaml.load(fs.readFileSync('info.yaml', 'utf8'));
    var input_dir = plist.MACOSX.input_dir;
    var input_icns = plist.MACOSX.input_icns;
    var app_name = plist.MACOSX.app_name;
    var output_dir = plist.MACOSX.output_dir;
    var app_file = plist.PRIVATE.app_file;
    child_process.execSync("rm -Rfv dist && mkdir dist && cp -Rfv ./".concat(app_file, " ./").concat(output_dir, "/").concat(app_name, " && cp -Rfv ").concat(input_dir, "/* ./").concat(output_dir, "/").concat(app_name, "/Contents/MacOS/ && cp -Rfv ./").concat(input_icns, " ./").concat(output_dir, "/").concat(app_name, "/Contents/Resources/app.icns"));
}
exports.AppBundler = AppBundler;
AppBundler();
