local Cadeia = {}
function Cadeia.verificarSubcadeia(cadeia, subcadeia)
    return string.find(cadeia, subcadeia)
end
function Cadeia.tamanho(cadeia)
    return string.len(cadeia)
end
function Cadeia.fatiar(cadeia, inicio, fim)
    return string.sub(cadeia, inicio, fim)
end

function Cadeia.minusculas(cadeia)
    return string.lower(cadeia)
end
function Cadeia.maiusculas(cadeia)
    return string.upper(cadeia)
end
function Cadeia.reverso(cadeia)
    return string.reverse(cadeia)
end
function Cadeia.padrao(cadeia, padrao)
    return string.match(cadeia, padrao)
end
function Cadeia.substituir(cadeia, novo)
    return string.gsub(cadeia, novo)
end


return Cadeia