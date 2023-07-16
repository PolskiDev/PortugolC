require("portugol_modulos/paroot")
local Sistema = {}

function Sistema.executarComando(comando)
    os.execute(comando)
end

function Sistema.obterProcessador()
    return getEnvironmentArch()
end

function Sistema.obterSistema()
    return getEnvironmentOS()
end

function Sistema.renomear(arquivo, novo)
    os.rename(arquivo, novo)
end
function Sistema.remover(arquivo)
    os.remove(arquivo)
end

return Sistema