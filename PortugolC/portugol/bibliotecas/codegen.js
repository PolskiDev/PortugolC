const process = require('process')
const args = process.argv.slice(2)
const util = require('util')
const dump = util.inspect
const fs = require('fs')
const lexer = require('./ast-lexer-parser')
const { tokens } = require('./token_table')


function CodeGen(input, output, mode='normal') {
    let codegen = lexer.GenerateAST(input)
    for (var i = 0; i < codegen?.length; i++) {
        if (codegen[i].type == 'initialize_program') {
            fs.writeFileSync(output, '')
        }
        else if (codegen[i].type == 'finalize_program') {
            if (input == tokens.file_main) {
                fs.appendFileSync(output, 'inicio()\n')
            }
            if (input == tokens.game_main) {
                output = 'main'
            }
            console.log("Bytecode: "+input)
        }

        else if (codegen[i].type == 'package_definition') {
            fs.appendFileSync(output, '-- PACOTE: '+codegen[i].name+'\n')
        }
        else if (codegen[i].type == 'open_block') {
            fs.appendFileSync(output, '')
        }
        else if (codegen[i].type == 'end_block') {
            fs.appendFileSync(output, 'end\n')
        }


        else if (codegen[i].type == 'variable_assignment') {
            if (codegen[i].data.vartype == '') {
                if (codegen[i].data.value == 'null') {
                    fs.appendFileSync(output,'/* '+codegen[i].data.varname+' = '+codegen[i].data.value+' */\n')
                } else {
                    fs.appendFileSync(output,'local '+codegen[i].data.varname+' = '+codegen[i].data.value+'\n')
                    //if (codegen[i].data.error_name != undefined) {
                        //fs.appendFileSync(output, `if ${codegen[i].data.error_name} != nil { log.Fatal(${codegen[i].data.error_name}) }\n`)
                    //}

                }
            } else {
                if (codegen[i].data.value == 'null') {
                    fs.appendFileSync(output, 'local '+codegen[i].data.varname+'\n')
                } else {
                    fs.appendFileSync(output, 'local '+codegen[i].data.varname+' = '+codegen[i].data.value+'\n')
                }
            }
            
        }
        else if (codegen[i].type == 'variable_reassignment') {
            fs.appendFileSync(output, codegen[i].data.varname+' = '+codegen[i].data.value+'\n')
        }


        else if (codegen[i].type == 'array_assignment') {
            fs.appendFileSync(output, 'local '+codegen[i].data.varname+' = '+codegen[i].data.sizeof+codegen[i].data.vartype+'{'+codegen[i].data.value.slice(1,-1)+'}\n')
        }
        else if (codegen[i].type == 'array_reassignment') {
            fs.appendFileSync(output, 'local '+codegen[i].data.varname+' = '+codegen[i].data.sizeof+codegen[i].data.vartype+'{'+codegen[i].data.value.slice(1,-1)+'}\n')
        }


        else if (codegen[i].type == 'package_importing') {
            fs.appendFileSync(output, `local ${codegen[i].data.alias} = require(${codegen[i].data.path})\n`)
        }
        else if (codegen[i].type == 'package_including') {
            fs.appendFileSync(output, fs.readFileSync(codegen[i].data.path, 'utf8'))
        }


        else if (codegen[i].type == 'function_definition') {
            if (codegen[i].data.functype == undefined) {
                codegen[i].data.functype = ''
            }
            fs.appendFileSync(output, 'function '+codegen[i].data.funcname+codegen[i].data.args+'\n')
        }
        else if (codegen[i].type == 'function_call') {
            //codegen[i].data.args = codegen[i].data.args.replace(/let /g,'')
            fs.appendFileSync(output, codegen[i].data.funcname+codegen[i].data.args+'\n')
        }
        else if (codegen[i].type == 'return_value') {
            fs.appendFileSync(output, codegen[i].data.value+';\n')
        }


        else if (codegen[i].type == 'conditional_if') {
            fs.appendFileSync(output, 'if '+codegen[i].data.expression.slice(1,-1))
        }
        else if (codegen[i].type == 'conditional_elsif') {
            fs.appendFileSync(output, 'elseif '+codegen[i].data.expression.slice(1,-1))
        }
        else if (codegen[i].type == 'conditional_final') {
            fs.appendFileSync(output, 'else')
        }


        else if (codegen[i].type == 'loop_while') {
            fs.appendFileSync(output, 'while '+codegen[i].data.expression.slice(1,-1))
        }
        else if (codegen[i].type == 'loop_for') {
            fs.appendFileSync(output, `for ${codegen[i].data.iterator}=${codegen[i].data.minimum_value}, ${codegen[i].data.maximum_value} do\n`)
        }
        else if (codegen[i].type == 'loop_times') {
            fs.appendFileSync(output, `for ${codegen[i].data.iterator}=${codegen[i].data.minimum_value}, ${codegen[i].data.maximum_value} do\n`)
        }


        else if (codegen[i].type == 'break_loop') {
            fs.appendFileSync(output, 'break'+'\n')
        }
        else if (codegen[i].type == 'continue_loop') {
            fs.appendFileSync(output, 'continue'+'\n')
        }

        //console.log("DEBUGGING: "+dump(codegen[i]))
    }
    if (mode == 'debugging') {
        console.log(codegen)
    }
    
    
}

module.exports = { CodeGen }
