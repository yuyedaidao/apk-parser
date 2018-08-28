const path = require('path')
const extractApk = require('./lib/extract')
const { readXml, readYml } = require('./lib/read')

const apkParse = async(apkPath, iconOutPath) => {
    try {
        const extractedApk = await extractApk(apkPath)
        let doc = {}
        const xml = await readXml(`${extractedApk}/AndroidManifest.xml`)
        const yml = readYml(`${extractedApk}/apktool.yml`)
        doc.version = yml.versionInfo.versionName
        doc.build = yml.versionInfo.versionCode
        doc.gradleVersion = yml.version
        doc.fileName = yml.apkFileName
        doc.sdkInfo = yml.sdkInfo
        const manifest = xml.manifest
        doc.bundleId = manifest['$'].package
        const iconKey = String(manifest.application[0]['$']['android:icon']).substr(1)
        const labelKey = manifest.application[0]['$']['android:label'].split('/')[1]
        const stringXml = await readXml(`${extractedApk}/res/values/strings.xml`)
        for (val of stringXml.resources.string) {
            const label = val['$']['name']
            if (label == labelKey) {
                doc.name = val._
                break
            }
        }
        doc.icon = iconKey
        if (iconOutPath) {
            const ms = ['xxxhdpi', 'xxhdpi', 'xhdpi', 'mdpi', 'hdpi']
            const temp = iconKey.split('/')
            const prefix = temp[0]
            const fileName = temp[1]
            for (m of ms) {
                const iconPath = `${extractedApk}/res/${prefix}-${m}-v4/${fileName}.png`
                if (fs.existsSync(iconPath)) {
                    fs.copyFileSync(iconPath, iconOutPath)
                    break
                }
            }
        }
        return doc
    } catch (error) {
        console.log(error);
    }
    return null
}
module.exports = apkParse