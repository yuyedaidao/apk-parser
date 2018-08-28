const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

/**
 * 解压apk
 * @param {待解压的apk文件路径} apkPath 
 */
const extract = (apkPath) => {
    return new Promise((resolve, reject) => {
        const apktool = path.join(__dirname, `apktool.jar`)
        try {
            fs.chmodSync(apktool, '777');
        } catch (error) {
            reject(error)
        }
        const outPath = path.normalize(`${__dirname}/../temp/apk`)
        const command = `java -jar ${apktool} d  ${apkPath} -f -o ${outPath} -p ${outPath}/framework`
        console.log('解包apk命令:' + command)
        exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            }
            if (stderr) {
                if (stderr.indexOf('S: Could not decode file, replacing by FALSE value: mipmap-anydpi-') !== -1) {
                    resolve(outPath)
                }
                reject(new Error(stderr))
            }
            resolve(outPath)
        })
    })
}

module.exports = extract