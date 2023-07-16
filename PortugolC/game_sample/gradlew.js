const { exec, execSync } = require('child_process');
const { platform } = require('os');
var path = require('path'),
fs = require('fs');
const { argv } = require('process');


function deleteFromDir(startPath, filter) {
    //console.log('Starting from dir '+startPath+'/');
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.endsWith(filter)) {
            console.log('-- found: ', filename);
            // DELETE ALL LUA FILES
        };
    };
};

function searchFromDir(startPath, filter) {
    //console.log('Starting from dir '+startPath+'/');
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            searchFromDir(filename, filter); //recurse
        } else if (filename.endsWith(filter)) {
            console.log('-- found: ', filename);
            
            if (platform == 'win32') {
                execSync(`portugolc ${filename} -c ${filename.replace('.por','')} && rename jogo.lua main.lua && powershell Compress-Archive . jogo.love`)
            } else {
                execSync(`portugolc ${filename} -c ${filename.replace('.por','')} && mv jogo.lua main.lua && zip -r jogo.love .`)
            }
        };
    };
};



let args = argv.slice(2)

if (args[0] == 'build') {
    searchFromDir('.', '.por')

} else if (args[0] == 'run') {
    searchFromDir('.', '.por');
    if (platform == 'win32') {
        execSync(`start love2d\\win32\\love.exe jogo.love`)
    } else if (platform == 'linux') {
        execSync(`./love2d/linux64/love jogo.love`)
    }
} else {
    console.log("Build:  gradlew build")
    console.log("Run:    gradlew run")
}

