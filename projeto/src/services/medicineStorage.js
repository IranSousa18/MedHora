const STORAGE_KEY = 'medicamentos'
const STATUS_VALIDOS = ['pendente', 'tomado']

function gerarId(prefixo) {
    const timestamp = Date.now()
    const aleatorio = Math.random().toString(36).slice(2, 6)
    return `${prefixo}_${timestamp}_${aleatorio}`
}

function normalizarOcorrencia(oc, indice = 0) {
    return {
        ...oc,
        id: oc.id ? String(oc.id) : gerarId(`oc_${indice}`),
        status: STATUS_VALIDOS.includes(oc.status) ? oc.status : 'pendente'
    }
}

export function buscarMedicamentos() {
    try {
        const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        return Array.isArray(dados) ? dados : []
    } catch {
        return []
    }
}

export function salvarMedicamentos(medicamentos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(medicamentos))
        return true
    } catch {
        return false
    }
}

export function buscarMedicamentoPorId(id) {
    const lista = buscarMedicamentos()
    return lista.find((med) => String(med.id) === String(id)) || null
}

export function adicionarMedicamento(medicamento) {
    const lista = buscarMedicamentos()
    const ocorrencias = (medicamento.ocorrencias || []).map(normalizarOcorrencia)

    const novo = {
        ...medicamento,
        id: gerarId('med'),
        ocorrencias
    }

    return salvarMedicamentos([...lista, novo]) ? novo : null
}

export function atualizarMedicamento(id, dados) {
    const lista = buscarMedicamentos()
    const index = lista.findIndex((med) => String(med.id) === String(id))

    if (index === -1) {
        return null
    }

    const dadosLimpos = Array.isArray(dados.ocorrencias)
        ? { ...dados, ocorrencias: dados.ocorrencias.map(normalizarOcorrencia) }
        : dados

    lista[index] = {
        ...lista[index],
        ...dadosLimpos,
        id: lista[index].id
    }

    return salvarMedicamentos(lista) ? lista[index] : null
}

export function removerMedicamento(id) {
    const lista = buscarMedicamentos()
    const filtrada = lista.filter((med) => String(med.id) !== String(id))

    if (filtrada.length === lista.length) {
        return false
    }

    return salvarMedicamentos(filtrada)
}

export function buscarOcorrencias(medicamentoId) {
    const medicamento = buscarMedicamentoPorId(medicamentoId)
    return medicamento?.ocorrencias || []
}

export function buscarOcorrencia(medicamentoId, ocorrenciaId) {
    const ocorrencias = buscarOcorrencias(medicamentoId)
    return ocorrencias.find((oc) => String(oc.id) === String(ocorrenciaId)) || null
}

export function atualizarOcorrencia(medicamentoId, ocorrenciaId, dados) {
    if (dados.status !== undefined && !STATUS_VALIDOS.includes(dados.status)) {
        return null
    }

    const lista = buscarMedicamentos()
    const med = lista.find((m) => String(m.id) === String(medicamentoId))
    const oc = med?.ocorrencias?.find((o) => String(o.id) === String(ocorrenciaId))

    if (!oc) {
        return null
    }

    Object.assign(oc, dados, { id: oc.id })
    return salvarMedicamentos(lista) ? oc : null
}

export function atualizarStatusOcorrencia(medicamentoId, ocorrenciaId, status) {
    if (!STATUS_VALIDOS.includes(status)) {
        return null
    }

    return atualizarOcorrencia(medicamentoId, ocorrenciaId, { status })
}