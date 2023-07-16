let tokens = {
    initialize_program: "programa",
    finalize_program: "fimprograma",
    package_definition: "pacote",
    open_block: "{",
    end_block: "}",
    commentary: "//",
    variable_assignment: "=",
    array_symbol: "[]",
    builtin_library_require: "usando",
    package_importing: "importar",
    package_including: "incluir",
    function_definition: "funcao",
    return_value: "retorne",
    conditional_if: "se",
    conditional_elsif: "senaose",
    conditional_final: "senao",
    loop_while: "enquanto",
    loop_for: "para",
    to_for: "ate",
    times: "vezes",
    break_loop: "parar",
    continue_loop: "continuar",
    error_decorator: "@erro",

    typedef_integer: /inteiro/g,
    typedef_integer8: /inteiro8/g,
    typedef_integer16: /inteiro16/g,
    typedef_integer32: /inteiro32/g,
    typedef_integer64: /inteiro64/g,

    typedef_float: /flutuante/g,
    typedef_float64: /flutuante64/g,

    typedef_string: /cadeia/g,
    typedef_boolean: /logico/g,

    typedef_void: /vazio/g,
    typedef_complex64: /complexo64/g,
    typedef_complex128: /complex128/g,

    typedef_true: /verdadeiro/g,
    typedef_false: /falso/g,
    typedef_null: /nulo/g,


    operator_and: / e /g,
    operator_or: / or /g,
    operator_not: /nao /g,
    operator_equal: / igual /g,
    operator_notequal: / diferente /g,


    func_main: /inicio/g,
    func_load2d: /carregar/g,
    func_update2d: /atualizar/g,
    func_draw2d: /desenhar/g,

    file_main: 'inicio.por',
    game_main: 'jogo.por',


    power_sample: "/usr/local/exemplo-portugol",
    power_sample_win32: "portugol_sample",

    game_sample: "/usr/local/jogo-portugol",
    game_sample_win32: "portugol_sample",

    local_modules: "portugol_modulos",
    init_module: "init.go"
}


module.exports = { tokens }