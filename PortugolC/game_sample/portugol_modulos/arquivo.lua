local Arquivo = {}
function Arquivo.leia(arquivo)
    local f = assert(io.open(arquivo, "rb"))
    local content = f:read("*all")
    f:close()
    return content
end

function Arquivo.escreval(arquivo, texto)
    local file = io.open(arquivo, 'w')
    file:write(texto+'\n')
    file:flush()
    file:close()
end
function Arquivo.escreva(arquivo, texto)
    local file = io.open(arquivo, 'w')
    file:write(texto)
    file:flush()
    file:close()
end


function Arquivo.adicionar(arquivo, texto)
    local f = Arquivo.leia(arquivo)
    f = f..texto
    Arquivo.escreval(arquivo, f)
end

return Arquivo