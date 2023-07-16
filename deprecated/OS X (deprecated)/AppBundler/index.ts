import * as child_process from 'child_process'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
export function AppBundler() {
    let plist: any = yaml.load(fs.readFileSync('info.yaml', 'utf8'))

    let input_dir = plist.MACOSX.input_dir
    let input_icns = plist.MACOSX.input_icns
    let app_name = plist.MACOSX.app_name
    let output_dir = plist.MACOSX.output_dir

    let app_file = plist.PRIVATE.app_file
    child_process.execSync(
        `rm -Rfv dist && mkdir dist && cp -Rfv ./${app_file} ./${output_dir}/${app_name} && cp -Rfv ${input_dir}/* ./${output_dir}/${app_name}/Contents/MacOS/ && cp -Rfv ./${input_icns} ./${output_dir}/${app_name}/Contents/Resources/app.icns`
    )
}

AppBundler()