require("portugol_modulos/paroot")
local Vetores = {}
function Vetores.removerIndice(tabela, posicao)
    table.remove(tabela, posicao)
end

function Vetores.removerValor(tabela, valor)
    local function indexOf(tabela, valor)
        for i, v in ipairs(tabela) do
            if v == valor then
                return i
            end
        end
        return nil
    end
    table.remove(tabela, indexOf(tabela, valor))
end

function Vetores.juntar(tabela1, tabela2)
    return TableConcat(tabela1, tabela2)
end
function Vetores.adicionar(tabela, valor, posicao)
    if posicao then
        return table.insert(tabela, posicao, valor)
    else
        return table.insert(tabela, valor)
    end
end
function Vetores.remover(tabela, posicao)
    if posicao then
        return table.remove(tabela, posicao)
    else
        return table.remove(tabela)
    end
end



return Vetores