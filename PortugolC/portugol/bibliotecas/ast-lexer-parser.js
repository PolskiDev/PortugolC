#!/usr/local/bin/node



/*
 * WARNING!
 * AST: This program translates sources to AST.
 * Gabriel Margarido - BSD 2-clause license
 */
const fs = require('fs')
const process = require('process')
const util = require('util')
const dump = util.inspect
const token_table = require('./token_table')



/* Generate AST from text source-file */
let var_collection = []
let typedef_colection = []
let func_collection = [ // Put all custom functions here, first!
    'escreval','escreva','entrada','leia'
]


let import_collection = []
let linecounter = 0     // Used for error handling!
let err_handling = false
let err_handling_name


function GenerateAST(input) {
    let regex = /[A-Za-z0-9_$++::\.,@*#?><>=<=>===\{\}:=\[\]]+|"[^"]+"|'[^']+'|\([^)]*\)|\[[^\]]*\]|\/[^)/]*\/|(:)|(=)/g
    let source = fs.readFileSync(input,'utf8')
    let json = []


    source.split(/\r?\n/).forEach(line =>  {
        linecounter = linecounter +1
        let stack = line.match(regex)

        /**
         * @error  stack.lenght
         * @fix    stack?.length
         */
        //console.log("Lines:")
        //console.log(" ->"+stack+" ")

        for (let i = 0; i < stack?.length; i++) {
            //process.stdout.write("Token: ["+stack[i]+"] ~ ")
            if (stack[i] == token_table.tokens.initialize_program) {
                if (stack[i+1] == undefined) {
                    console.log("Erro de sintaxe: O nome do programa nao foi definido - erro na linha:"+linecounter)
                } else {
                    let data = {
                        token: token_table.tokens.initialize_program,
                        name: stack[i+1],
                        type: 'initialize_program'
                    }
                    json.push(data);
                }

            }
            if (stack[i] == token_table.tokens.finalize_program) {
                let data = {
                    token: token_table.tokens.finalize_program,
                    type: 'finalize_program'
                }
                json.push(data);
            }
            if (stack[i] == token_table.tokens.package_definition) {
                if (stack[i+1] == undefined) {
                    console.log("Erro de sintaxe: O nome do pacote nao foi definido - erro na linha:"+linecounter)
                } else {
                    
                    let data = {
                        token: token_table.tokens.package_definition,
                        name: stack[i+1].replace(/principal/g,'main'),
                        type: 'package_definition'
                    }
                    json.push(data);
                }

            }

            // End block
            else if (stack[i] == token_table.tokens.end_block) {
                let data = {
                    token: token_table.tokens.end_block,
                    type: 'end_block'
                }
                json.push(data);
                
            }
            else if (stack[i] == token_table.tokens.open_block) {
                let data = {
                    token: token_table.tokens.open_block,
                    type: 'open_block'
                }
                json.push(data);
            }

            // Comentarios
            else if (stack[i] == token_table.tokens.commentary) {
                let data = {
                    token: token_table.tokens.commentary,
                    type: 'commentary',
                    commentary: line.trim().slice(2)
                }
                json.push(data);
            }
                

            // Declaração de variaveis e vetores
            else if (stack[i] == token_table.tokens.error_decorator) {
                let name = stack[i+1]
                err_handling = true
                err_handling_name = name
            }
            else if (stack[i] == token_table.tokens.variable_assignment) {
                let vartype = stack[i-2]
                let varname = stack[i-1]
                let value = line.slice(line.indexOf('=')+2)
                //let value = stack[i+1]
                value = value.replace(token_table.tokens.typedef_null, null)
                value = value.replace(token_table.tokens.typedef_true, 'true')
                value = value.replace(token_table.tokens.typedef_false, 'false')
                value = value.replace(/entrada|leia/g, 'io.read()')


                // Assignment
                if (vartype) {
                    vartype = vartype.replace(token_table.tokens.typedef_integer, 'int')
                    vartype = vartype.replace(token_table.tokens.typedef_integer8, 'int8')
                    vartype = vartype.replace(token_table.tokens.typedef_integer16, 'int16')
                    vartype = vartype.replace(token_table.tokens.typedef_integer32, 'int32')
                    vartype = vartype.replace(token_table.tokens.typedef_integer64, 'int64')
    
                    vartype = vartype.replace(token_table.tokens.typedef_float, 'float32')
                    vartype = vartype.replace(token_table.tokens.typedef_float64, 'float64')
    
                    vartype = vartype.replace(token_table.tokens.typedef_string, 'string')
                    vartype = vartype.replace(token_table.tokens.typedef_boolean, 'bool')
                    
                    if (var_collection.includes(varname)) {
                        console.log("Erro de semantica: A variavel ou vetor ("+varname+") ja foi declarado - erro na linha:"+linecounter)
                        break
                    } else {
                        // Searching for errors
                        if (vartype == token_table.tokens.typedef_integer && isNaN(value) == true) {
                            console.log("Erro de semantica: A variavel ("+varname+") possui tipos incompativeis (Inteiro para nao-numerico) - erro na linha:"+linecounter)
                            break
                        } else if (vartype == token_table.tokens.typedef_float && isNaN(value) == true) {
                            console.log("Erro de semantica: A variavel ("+varname+") possui tipos incompativeis (Flutuante para nao-numerico) - erro na linha:"+linecounter)
                            break
                        } else if (vartype == token_table.tokens.typedef_string && typeof value != 'string') {
                            console.log("Erro de semantica: A variavel ("+varname+") possui tipos incompativeis (Cadeia para nao-cadeia) - erro na linha:"+linecounter)
                            break
                        
                            // If everything is Ok, then generate AST.
                        } else {
                            if (varname.includes(token_table.tokens.array_symbol)) {
                                /** Variable Declaration */
                                let data = {
                                    token: token_table.tokens.variable_assignment,
                                    type: 'array_assignment',
                                    data: {
                                        vartype: vartype,
                                        varname: varname.slice(0,
                                            varname.indexOf(token_table.tokens.array_symbol.slice(0,1))
                                        ),
                                        sizeof: varname.slice(
                                            varname.indexOf(token_table.tokens.array_symbol.slice(0,1),
                                            varname.indexOf(token_table.tokens.array_symbol.slice(-2,token_table.tokens.array_symbol.length)))
                                        ),
                                        value: value
                                    }
                                }
                                json.push(data);
                                var_collection.push(varname)
                                typedef_colection.push(vartype)
        
        
                            } else {
                                /** Variable Declaration */
                                let data = {
                                    token: token_table.tokens.variable_assignment,
                                    type: 'variable_assignment',
                                    data: {
                                        vartype: vartype,
                                        varname: varname,
                                        value: value,
                                    }
                                }
                                json.push(data);
                                var_collection.push(varname)
                                typedef_colection.push(vartype)
                            }
                        }
                    }

                    
                    
                // Reassignment
                } else {
                    if (var_collection.includes(varname)) {
                        if (varname.includes(token_table.tokens.array_symbol)) {
                            let data = {
                                token: token_table.tokens.variable_assignment,
                                type: 'array_reassignment',
                                data: {
                                    varname: varname.slice(0,
                                        varname.indexOf(token_table.tokens.array_symbol.slice(0,1))
                                    ),
                                    value: value
                                }
                            }
                            json.push(data);
                        } else {
                            value = value.replace(token_table.tokens.typedef_null, null)
                            value = value.replace(token_table.tokens.typedef_true, 'true')
                            value = value.replace(token_table.tokens.typedef_false, 'false')
                            value = value.replace(/entrada|leia/g, 'io.read()')

                            let data = {
                                token: token_table.tokens.variable_assignment,
                                type: 'variable_reassignment',
                                data: {
                                    varname: varname,
                                    value: value
                                }
                            }
                            json.push(data);
                        }
                    } else {
                        console.log("Erro de semantica: Tentando acessar variavel ou vetor ("+varname+") antes de ser declarado - erro na linha:"+linecounter)
                    }
                }
            }

            else if (stack[i] == token_table.tokens.package_importing) {
                let path = stack[i+1]
                let cpath = stack[i+1].slice(1,-1)
                let alias

                // Setting alias
                if (path.includes('/')) {
                    alias = path.slice(path.lastIndexOf('/')+1,-1)
                } else {
                    alias = path.slice(1,-1)
                }

                // Doing the work
                if (import_collection.includes(path)) {
                    console.log("Erro de semantica: O pacote ("+path+") ja foi importado - erro na linha:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.package_importing,
                        type: 'package_importing',
                        data: {
                            path: path,
                            alias: alias,
                            cpath: cpath
                        }
                    }
                    json.push(data);
                    import_collection.push(path)
                }
            }

            else if (stack[i] == token_table.tokens.package_including) {
                let path = stack[i+1].slice(1,-1)

                // Doing the work
                if (import_collection.includes(path)) {
                    console.log("Erro de semantica: O modulo ("+path+") ja foi incluido - erro na linha:"+linecounter)
                    break
                } else {
                    // GLOBAL MODULES - UNSED BEGIN
                    /*if (fs.existsSync(token_table.tokens.power_modules+'/'+path+'.go')) {
                        path = token_table.tokens.power_modules+'/'+path+'.go'
                        let data = {
                            token: token_table.tokens.package_importing,
                            type: 'package_including',
                            data: {
                                path: path
                            }
                        }
                        json.push(data);

                    }*/
                    // GLOBAL MODULES - UNSED END


                    if (fs.existsSync(token_table.tokens.local_modules+'/'+path+'/'+token_table.tokens.init_module)) {
                        path = token_table.tokens.local_modules+'/'+path+'/'+token_table.tokens.init_module
                        let data = {
                            token: token_table.tokens.package_including,
                            type: 'package_including',
                            data: {
                                path: path
                            }
                        }
                        json.push(data);
                        
                    } else if (fs.existsSync(path)) {
                        let data = {
                            token: token_table.tokens.package_including,
                            type: 'package_including',
                            data: {
                                path: path
                            }
                        }
                        json.push(data);

                    } else {
                        console.log("Erro de sintaxe: Arquivo ("+path+") ou ("+token_table.tokens.local_modules+'/'+path+'/'+token_table.tokens.init_module+") nao existe do diretorio atual (./...)")
                        break
                    }
                }
            }

            else if (stack[i] == token_table.tokens.function_definition) {
                let funcname = stack[i+1]
                let args = stack[i+2]
                let opening_block = stack[i+3]

                if (func_collection.includes(funcname)) {
                    console.log("Erro de semantica: A funcao ("+funcname+") ja foi declarada!")
                    break
                } /*else if (functype != "string" || functype != undefined) {
                    console.log("Syntax-Error: Invalid datatype ("+functype+") on line:"+linecounter)
                    break

                }*/ else {
                    args = args.replace(/:/g, '')

                    args = args.replace(token_table.tokens.typedef_integer, '')
                    args = args.replace(token_table.tokens.typedef_integer8, '')
                    args = args.replace(token_table.tokens.typedef_integer16, '')
                    args = args.replace(token_table.tokens.typedef_integer32, '')
                    args = args.replace(token_table.tokens.typedef_integer64, '')
                    args = args.replace(token_table.tokens.typedef_float, '')
                    args = args.replace(token_table.tokens.typedef_float64, '')
                    args = args.replace(token_table.tokens.typedef_string, '')
                    args = args.replace(token_table.tokens.typedef_boolean, '')

                    /* if (functype) {
                        functype = functype.replace(token_table.tokens.typedef_integer, 'int')
                        functype = functype.replace(token_table.tokens.typedef_integer8, 'int8')
                        functype = functype.replace(token_table.tokens.typedef_integer16, 'int16')
                        functype = functype.replace(token_table.tokens.typedef_integer32, 'int32')
                        functype = functype.replace(token_table.tokens.typedef_integer64, 'int64')
                        functype = functype.replace(token_table.tokens.typedef_float, 'float32')
                        functype = functype.replace(token_table.tokens.typedef_float64, 'float64')
                        functype = functype.replace(token_table.tokens.typedef_string, 'string')
                        functype = functype.replace(token_table.tokens.typedef_boolean, 'bool')
                    }*/
                    if (opening_block == token_table.tokens.open_block) {
                        //funcname = funcname.replace(token_table.tokens.func_main, 'main')
                        funcname = funcname.replace(token_table.tokens.func_load2d, 'love.load')
                        funcname = funcname.replace(token_table.tokens.func_update2d, 'love.update')
                        funcname = funcname.replace(token_table.tokens.func_draw2d, 'love.draw')


                        let data = {
                            token: token_table.tokens.function_definition,
                            type: 'function_definition',
                            data: {
                                //functype: functype,
                                funcname: funcname,
                                args: args
                            }
                        }
                        json.push(data);
                        func_collection.push(funcname)
                    } else {
                        console.log("Erro de sintaxe: Abra o bloco de codigo na funcao ("+funcname+") - erro na linha: "+linecounter)
                        break
                    }

                }

            }

            /** Function Return */
            else if (stack[i] == token_table.tokens.return_value) {
                //let value = line.trim().slice(line.indexOf(/\s+/), line.length)
                let value = line.trim().replace(token_table.tokens.return_value,'return')

                if (var_collection.includes(value)
                || func_collection.includes(value)
                || Number(value) || String(value)) {
                    // It's a variable, function, number or string
                    let data = {
                        token: token_table.tokens.return_value,
                        type: 'return_value',
                        data: {
                            value: value
                        }
                    }
                    json.push(data);

                } else {
                    console.log("Erro de semantica: Tentando acessar valor desconhecido ou indefinido ("+value+") erro na linha: "+linecounter)
                    break
                }

            }


            /* Function call based on parenthesis
            <function> <identifier><params>
            != <identifier><params> */
            else if (stack[i].slice(0,1) == '('
            && stack[i-1].match(/[A-Za-z0-9]/)
            && stack[i-2] == undefined
            && stack[i+1] != token_table.tokens.open_block) {
                let funcname = stack[i-1]
                //let args = stack[i]   // Old args

                /**
                 * Now multiple parenthesis are supported!
                 */
                let args = line.trim().slice(stack[i-1].length)
                args = args.replace(token_table.tokens.typedef_true, 'true')
                args = args.replace(token_table.tokens.typedef_false, 'false')
                args = args.replace(token_table.tokens.typedef_null, 'nil')
                
                //if (func_collection.includes(funcname)) {
                    funcname = funcname.replace(/escreval/g, 'print')
                    funcname = funcname.replace(/escreva/g, 'io.write')
                    args = args.replace(/nulo/g, 'nil')

                    let data = {
                        token: '<function_call>',
                        type: 'function_call',
                        data: {
                            funcname: funcname,
                            args: args
                        }
                    }
                    json.push(data);
                /*} else {
                    console.log("Semantic-Error: Trying to access ("+funcname+") before it's declaration at line:"+linecounter)
                    break
                }*/
                
            }


            // Condicionais
            else if (stack[i] == token_table.tokens.conditional_if) {
                let expression = stack[i+1]
                let opening_block = stack[i+2]

                // Novos operadores
                //expression = expression.replace(/ is true/gi,"")

                expression = expression.replace(token_table.tokens.operator_equal," == ")
                expression = expression.replace(token_table.tokens.operator_notequal," ~= ")
                expression = expression.replace(token_table.tokens.operator_and," and ")
                expression = expression.replace(token_table.tokens.operator_or," or ")
                expression = expression.replace(token_table.tokens.operator_not,"not ")

                expression = expression.replace(token_table.tokens.typedef_true, 'true')
                expression = expression.replace(token_table.tokens.typedef_false, 'false')
                expression = expression.replace(token_table.tokens.typedef_null, 'nil')

                if (opening_block == token_table.tokens.open_block) {
                    let data = {
                        token: token_table.tokens.conditional_if,
                        type: 'conditional_if',
                        data: {
                            expression: expression
                        }
                    }
                    json.push(data);
                } else {
                    console.log("Erro de sintaxe: Abra o bloco de codigo na condicional "+expression+" - erro na linha: "+linecounter)
                    break
                }
                
            }

            else if(stack[i] == token_table.tokens.conditional_elsif) {
                let expression = stack[i+1]
                let opening_block = stack[i+2]

                // Novos operadores
                //expression = expression.replace(/ is true/gi,"")

                expression = expression.replace(token_table.tokens.operator_equal," == ")
                expression = expression.replace(token_table.tokens.operator_notequal," ~= ")
                expression = expression.replace(token_table.tokens.operator_and," and ")
                expression = expression.replace(token_table.tokens.operator_or," or ")
                expression = expression.replace(token_table.tokens.operator_not,"not ")

                expression = expression.replace(token_table.tokens.typedef_true, 'true')
                expression = expression.replace(token_table.tokens.typedef_false, 'false')
                expression = expression.replace(token_table.tokens.typedef_null, 'nil')


                if (opening_block == token_table.tokens.open_block) {
                    let data = {
                        token: token_table.tokens.conditional_if,
                        type: 'conditional_elsif',
                        data: {
                            expression: expression
                        }
                    }
                    json.push(data);
                } else {
                    console.log("Erro de sintaxe: Abra o bloco de codigo na condicional "+expression+" - erro na linha: "+linecounter)
                    break
                }
            }
            else if (stack[i] == token_table.tokens.conditional_final) {
                let data = {
                    token: token_table.tokens.conditional_final,
                    type: 'conditional_final'
                }
                json.push(data);

            }
            else if (stack[i] == token_table.tokens.loop_while) {
                let expression = stack[i+1]
                let opening_block = stack[i+2]

                // Novos operadores
                expression = expression.replace(token_table.tokens.operator_equal," == ")
                expression = expression.replace(token_table.tokens.operator_notequal," != ")
                expression = expression.replace(token_table.tokens.operator_and," && ")
                expression = expression.replace(token_table.tokens.operator_or," || ")
                expression = expression.replace(token_table.tokens.operator_not,"!")

                expression = expression.replace(token_table.tokens.typedef_true, 'true')
                expression = expression.replace(token_table.tokens.typedef_false, 'false')
                expression = expression.replace(token_table.tokens.typedef_null, 'nil')


                if (opening_block != token_table.tokens.open_block) {
                    console.log("Erro de sintaxe: Abra o bloco de codigo no laco de repeticao "+expression+" - erro na linha: "+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.loop_while,
                        type: 'loop_while',
                        data: {
                            expression: expression
                        }
                    }
                    json.push(data);
                    
                }
            }
            else if (stack[i] == token_table.tokens.times) {
                let iterator = 'i'
                let Max = stack[i-1]
                let opening_block = stack[i+1]

                if (opening_block != token_table.tokens.open_block) {
                    console.log("Erro de sintaxe: Abra o bloco de codigo no laco de repeticao ( "+Max+"vezes) - erro na linha: "+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.times,
                        type: 'loop_times',
                        data: {
                            iterator: iterator,
                            minimum_value: 0,
                            maximum_value: Max
                        }
                    }
                    json.push(data);
                }
                
            }
            else if (stack[i] == token_table.tokens.loop_for) {
                let iterator = stack[i+1]
                let Min = stack[i+2]
                let Max = stack[i+4]

                if (stack[i+3] != token_table.tokens.to_for) {
                    console.log("Erro de sintaxe: Esperado 'ate' depois de 'para' e antes de '"+Max+"' na linha: "+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.loop_for,
                        type: 'loop_for',
                        data: {
                            iterator: iterator,
                            minimum_value: Min,
                            maximum_value: Max
                        }
                    }
                    json.push(data);
                }
                
            }

            //Interromper ciclos
            else if (stack[i] == token_table.tokens.break_loop) {
                let data = {
                    token: token_table.tokens.break_loop,
                    type: 'break_loop'
                }
                json.push(data);
            }
            else if (stack[i] == token_table.tokens.continue_loop) {
                let data = {
                    token: token_table.tokens.continue_loop,
                    type: 'continue_loop'
                }
                json.push(data);
            }






            /*else {
                // Error handling
                if (stack[i] == /[A-Z][a-z][0-9]/) {
                    if (
                        stack[i-1] != /namespace|if|elsif|while/
                    ) {
                        console.log("1 Error unknown expression: "+stack[i])
                    } else {
                        return json
                    }
                }

            }*/




            
        }
    })
    return json
    //console.log(dump(json, {depth: null}))
    
}

module.exports = { GenerateAST, var_collection, func_collection, import_collection }