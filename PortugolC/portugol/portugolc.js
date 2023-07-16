#!/usr/local/bin/node
const process = require('process')
const args = process.argv.slice(2)
const fs = require('fs')
const fse = require('fs-extra')
const ast_lexer_parser = require('./bibliotecas/ast-lexer-parser')
const codegen = require('./bibliotecas/codegen')
const token_table = require('./bibliotecas/token_table')
const { execSync } = require('child_process')


const luac = (source) => {
    execSync(`luac -o ${source}.luac ${source}.lua`)
}

const new_project = (name) => {
    if (process.platform == 'win32') {
        let srcDir = token_table.tokens.power_sample_win32
        execSync(`xcopy ${srcDir.replace('/', '\\')} ${name.replace('/','\\')} /E /H /C /I`)
    } else {
        let srcDir = token_table.tokens.power_sample
        execSync(`cp -Rfv ${srcDir} ${name}`)
    }
}

const new_game = (name) => {
    if (process.platform == 'win32') {
        let srcDir = token_table.tokens.game_sample_win32
        execSync(`xcopy ${srcDir.replace('/', '\\')} ${name.replace('/','\\')} /E /H /C /I`)
    } else {
        let srcDir = token_table.tokens.game_sample
        execSync(`cp -Rfv ${srcDir} ${name}`)
    }
}


if (args[1] == '-ast') {
    console.log(ast_lexer_parser.GenerateAST(args[0]))

} else if (args[1] == '-c') {
    codegen.CodeGen(args[0], args[2]+'.lua', 'normal')
} else if (args[1] == '-c-ast') {
    codegen.CodeGen(args[0], args[2]+'.lua', 'debugging')


} else if (args[0] == '--construir') {
    codegen.CodeGen(args[1], args[1]+'.lua', 'normal')
    luac(args[1]+'.lua')

} else if (args[1] == '-o') {
    codegen.CodeGen(args[0], args[2]+'.lua', 'normal')
    luac(args[2])

} else if (args[1] == '-o-ast') {
    codegen.CodeGen(args[0], args[2]+'.lua', 'debugging')
    luac(args[2])

} else if (args[0] == '--novo') {
    new_project(args[1])


} else if (args[0] == '--novo-jogo') {
    new_game(args[1])

} else {
    console.log("\n                        PORTUGOLC")
    console.log("------------------------------------------------------")
    console.log("Sintaxe:       portugolc  <opções>")
    console.log("------------------------------------------------------\n\n")

    /*console.log("Plataformas suportadas:")
    console.log("linux               GNU/Linux")
    console.log("windows             Microsoft Windows")
    console.log("darwin              Apple MacOS X")
    console.log("openbsd             OpenBSD")
    console.log("netbsd              NetBSD")
    console.log("dragonfly           DragonflyBSD")
    console.log("solaris             SunOS/Solaris")
    console.log("android             Android")
    console.log("javascript          JS")
    console.log("aix                 AIX")
    console.log("illumos             Illumos")
    console.log("plan9               Plan9\n\n")


    console.log("Arquiteturas de processador suportadas:")
    console.log("386                 x86 (32-bit)")
    console.log("amd64               x86 (64-bit)")
    console.log("arm                 ARM (32-bit)")
    console.log("arm64               ARM (64-bit)\n")


    console.log("ppc                 PowerPC (32-bit)")
    console.log("ppc64               PowerPC (64-bit)")
    console.log("ppc64l3             PowerPC LE (64-bit)\n")


    console.log("sparc               SPARC (32-bit)")
    console.log("sparc64             SPARC (64-bit)\n")


    console.log("riscv               RISC-V (32-bit)")
    console.log("riscv64             RISC-V (64-bit)\n")

    console.log("s390                S390")
    console.log("s390x               S390x\n")

    console.log("sparc               SPARC (32-bit)\n")

    console.log("arm64be             ARM BE(64-bit)\n")

    console.log("loong64             LOONG (64-bit)\n")

    console.log("mips                MIPS (32-bit)")
    console.log("mips64              MIPS (64-bit)")
    console.log("mips64le            MIPS LE (64-bit)")
    console.log("mips64p32           MIPS P32 (64-bit)")
    console.log("mips64p32le         MIPS P32LE (64-bit)")
    console.log("mipsle              MIPS LE\n\n")

    console.log("wasm                WebAssembly\n\n")*/
    

    //console.log("--------------------------------------------------------------------------------\n\n")
    console.log("As opções são:")
    console.log("--novo  <nome_do_projeto>           Cria um novo projeto")
    console.log("--novo-jogo  <nome_do_jogo>         Cria um novo jogo (Love2D)\n\n")

    //console.log("--construir    <arquivo>                       Compila todo o projeto para um único binário\n")

    console.log("<arquivo>.por   -o    <arquivo>                A saída é um bytecode (.luac)\n")

    console.log("<arquivo>.por   -c    <arquivo>                A saída é um arquivo (.lua)\n")
    
    console.log("<arquivo>.por   -ast                       Mostra a Árvore de Sintaxe Abstrata gerada (AST)\n")

    console.log("<arquivo>.por   -o-ast  <arquivo>          Mostra a Árvore de Sintaxe Abstrata gerada (AST)")
    console.log("                                           e a saída é um binário\n\n")
    
    console.log("<arquivo>.por   -c-ast  <arquivo>     Mostra a Árvore de Sintaxe Abstrata gerada (AST)")
    console.log("                                      e a saída é um código transpilado para Golang\n\n")
    console.log("--------------------------------------------------------------------------------\n\n")
}

