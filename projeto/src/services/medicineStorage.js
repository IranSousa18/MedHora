const CHAVE_MEDICAMENTOS = 'medicamentos'

function buscarMedicamentos() {
    const dados = localStorage.getItem(CHAVE_MEDICAMENTOS)

    if (!dados) {
        return []
    }

    return JSON.parse(dados)
}

function salvarMedicamentos(medicamentos) {
    localStorage.setItem(
        CHAVE_MEDICAMENTOS,
        JSON.stringify(medicamentos)
    )
}

function adicionarMedicamento(medicamento) {
    const medicamentos = buscarMedicamentos()

    const novoMedicamento = {
        id: Date.now(),
        ...medicamento
    }

    medicamentos.push(novoMedicamento)

    salvarMedicamentos(medicamentos)

    return novoMedicamento
}

function atualizarMedicamento(id, dadosAtualizados) {
    const medicamentos = buscarMedicamentos()

    const indice = medicamentos.findIndex(
        medicamento => medicamento.id === id
    )

    if (indice === -1) {
        return null
    }

    medicamentos[indice] = {
        ...medicamentos[indice],
        ...dadosAtualizados
    }

    salvarMedicamentos(medicamentos)

    return medicamentos[indice]
}

function atualizarOcorrencia(
    medicamentoId,
    ocorrenciaId,
    dadosAtualizados
) {
    const medicamentos = buscarMedicamentos()

    const medicamento = medicamentos.find(
        medicamento => medicamento.id === medicamentoId
    )

    if (!medicamento || !medicamento.ocorrencias) {
        return null
    }

    const ocorrencia = medicamento.ocorrencias.find(
        ocorrencia => ocorrencia.id === ocorrenciaId
    )

    if (!ocorrencia) {
        return null
    }

    Object.assign(ocorrencia, dadosAtualizados)

    salvarMedicamentos(medicamentos)

    return ocorrencia
}

function removerMedicamento(id) {
    const medicamentos = buscarMedicamentos()

    const novosMedicamentos = medicamentos.filter(
        medicamento => medicamento.id !== id
    )

    salvarMedicamentos(novosMedicamentos)

    return true
}

export {
    buscarMedicamentos,
    salvarMedicamentos,
    adicionarMedicamento,
    atualizarMedicamento,
    atualizarOcorrencia,
    removerMedicamento
}