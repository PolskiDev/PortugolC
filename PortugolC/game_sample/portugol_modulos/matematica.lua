local Matematica = {}
function Matematica.absoluto(x)
    return math.abs(x)
end
function Matematica.expoente(x)
    return math.exp(x)
end
function Matematica.exponenciar(x,y)
    return math.pow(x,y)
end
function Matematica.arredondar(x)
    return math.floor(x)
end
function Matematica.logaritmo(x)
    return math.log(x)
end
function Matematica.logaritmo10(x)
    return math.log10(x)
end
function Matematica.pi()
    return math.pi
end
function Matematica.anguloParaRadiano(x)
    return math.rad(x)
end
function Matematica.aleatorio(min, max)
    if max then
        return math.random(min,max)
    else
        return math.random(min)
    end
end
function Matematica.raizQuadrada(x)
    return math.sqrt(x)
end
-- Matematica.pi = math.pi




return Matematica