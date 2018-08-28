const fs = require('fs')
const xml = require('xml2js')
const yaml = require('js-yaml')

const readXml = (path) => {
    return new Promise((resolve, reject) => {
        const parser = new xml.Parser();
        parser.parseString(fs.readFileSync(path), (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        });
    })
}

const readYml = (path) => {
    const ConfigYamlType = new yaml.Type('tag:yaml.org,2002:brut.androlib.meta.MetaInfo', {
        kind: 'mapping',
        construct: function(data) {
            return data;
        }
    });
    const CONFIG_SCHEMA = yaml.Schema.create([ConfigYamlType]);
    const result = yaml.load(fs.readFileSync(path), { schema: CONFIG_SCHEMA });
    return result
}

module.exports = { readXml, readYml }