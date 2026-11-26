
export const TOLERANCIA_MINUTOS = 0
const MAX_OCORRENCIAS = 500
const MINUTO_MS = 60 * 1000

export function obterDataHoje(data = new Date()) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

function criarDataLocal(dataStr, horarioStr = '00:00') {
    if (
        typeof dataStr !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dataStr) ||
        typeof horarioStr !== 'string' ||
        !/^\d{2}:\d{2}$/.test(horarioStr)
    ) {
        return null
    }

    const [ano, mes, dia] = dataStr.split('-').map(Number)
    const [hora, min] = horarioStr.split(':').map(Number)

    if (
        mes < 1 || mes > 12 ||
        dia < 1 || dia > 31 ||
        hora < 0 || hora > 23 ||
        min < 0 || min > 59
    ) {
        return null
    }

    const data = new Date(ano, mes - 1, dia, hora, min)

    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes - 1 ||
        data.getDate() !== dia ||
        data.getHours() !== hora ||
        data.getMinutes() !== min
    ) {
        return null
    }

    return Number.isNaN(data.getTime()) ? null : data
}

function chaveOcorrencia(oc) {
    return `${oc.data}_${oc.horario}`
}

function obterTimestampOcorrencia(oc) {
    const data = criarDataLocal(oc.data, oc.horario)
    return data ? data.getTime() : null
}

export function gerarOcorrencias({
    dataInicio,
    dataTermino,
    horario,
    intervalo,
    unidadeIntervalo = 'horas',
    maxOcorrencias = MAX_OCORRENCIAS
}) {
    const inicio = criarDataLocal(dataInicio, horario)
    const fim = criarDataLocal(dataTermino || dataInicio, '23:59')
    const valor = Number(intervalo)
    const limite = Number(maxOcorrencias)

    if (
        !inicio ||
        !fim ||
        !Number.isFinite(valor) ||
        valor <= 0 ||
        !Number.isInteger(limite) ||
        limite <= 0 ||
        fim < inicio
    ) {
        return []
    }

    const unidade = String(unidadeIntervalo).toLowerCase()

    const fator = unidade.startsWith('dia')
        ? 1440
        : unidade.startsWith('min')
            ? 1
            : unidade.startsWith('hora')
                ? 60
                : null

    if (!fator) return []

    const passoMs = valor * fator * MINUTO_MS

    if (!Number.isFinite(passoMs) || passoMs <= 0) {
        return []
    }

    const ocorrencias = []

    for (let t = inicio.getTime(); t <= fim.getTime(); t += passoMs) {
        if (ocorrencias.length >= limite) {
            const erro = new Error(
                `O tratamento ultrapassou o limite de ${limite} doses.`
            )
            erro.code = 'LIMITE_OCORRENCIAS'
            throw erro
        }

        const d = new Date(t)

        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')

        ocorrencias.push({
            id: `oc_${t}_${ocorrencias.length}`,
            data: obterDataHoje(d),
            horario: `${hh}:${mm}`,
            status: 'pendente'
        })

        const proximo = t + passoMs

        if (!Number.isFinite(proximo) || proximo <= t) {
            return []
        }
    }

    return ocorrencias
}

export function recalcularOcorrencias(
    ocorrenciasAtuais = [],
    novaConfig,
    agora = new Date()
) {
    const timestampAgora = agora.getTime()

    if (!Number.isFinite(timestampAgora)) {
        return []
    }

    // Preserva todas as doses já tomadas e todas as doses
    // que pertencem ao passado, independentemente do status.
    const preservadas = (ocorrenciasAtuais || []).filter((oc) => {
        if (oc.status === 'tomado') return true

        const timestamp = obterTimestampOcorrencia(oc)

        return timestamp !== null && timestamp <= timestampAgora
    })

    const chavesPreservadas = new Set(
        preservadas.map(chaveOcorrencia)
    )

    // Gera a nova programação com a configuração informada.
    const geradas = gerarOcorrencias(novaConfig)

    // Só incorpora as novas doses futuras que não conflitam
    // com registros já preservados.
    const futuras = geradas.filter((oc) => {
        const timestamp = obterTimestampOcorrencia(oc)

        return (
            timestamp !== null &&
            timestamp > timestampAgora &&
            !chavesPreservadas.has(chaveOcorrencia(oc))
        )
    })

    return [...preservadas, ...futuras].sort(
        (a, b) => `${a.data} ${a.horario}`.localeCompare(
            `${b.data} ${b.horario}`
        )
    )
}

export function obterStatusOcorrencia(
    ocorrencia,
    agora = new Date(),
    tolerancia = TOLERANCIA_MINUTOS
) {
    if (ocorrencia.status === 'tomado') return 'tomado'

    const dataDose = criarDataLocal(ocorrencia.data, ocorrencia.horario)

    if (!dataDose) return 'pendente'

    return agora.getTime() > dataDose.getTime() + tolerancia * MINUTO_MS
        ? 'atrasado'
        : 'pendente'
}

const montarItem = (med, oc, agora) => ({
    medicamentoId: med.id,
    ocorrenciaId: oc.id,
    nome: med.nome,
    quantidade: med.quantidade,
    observacao: med.observacao || '',
    data: oc.data,
    horario: oc.horario,
    status: obterStatusOcorrencia(oc, agora)
})

export function listarOcorrenciasDoDia(
    medicamentos = [],
    data = obterDataHoje(),
    agora = new Date()
) {
    return (medicamentos || [])
        .flatMap((med) => (med.ocorrencias || [])
            .filter((oc) => oc.data === data)
            .map((oc) => montarItem(med, oc, agora)))
        .sort((a, b) => a.horario.localeCompare(b.horario))
}

export function listarHistorico(
    medicamentos = [],
    dataLimite = obterDataHoje(),
    agora = new Date()
) {
    const grupos = {}

    for (const med of medicamentos || []) {
        for (const oc of med.ocorrencias || []) {
            if (oc.data < dataLimite) {
                grupos[oc.data] = grupos[oc.data] || []
                grupos[oc.data].push(montarItem(med, oc, agora))
            }
        }
    }

    return Object.keys(grupos)
        .sort((a, b) => b.localeCompare(a))
        .map((data) => ({
            data,
            medicamentos: grupos[data].sort(
                (a, b) => a.horario.localeCompare(b.horario)
            )
        }))
}

export function contarResumo(itens = []) {
    const lista = itens || []
    const tomados = lista.filter((i) => i.status === 'tomado').length
    const atrasados = lista.filter((i) => i.status === 'atrasado').length
    const pendentes = lista.length - tomados - atrasados

    return {
        total: lista.length,
        tomados,
        pendentes,
        atrasados,
        naoTomados: pendentes + atrasados
    }
}

export function obterProximaOcorrencia(itens = []) {
    return [...(itens || [])]
        .sort((a, b) => a.horario.localeCompare(b.horario))
        .find((i) => i.status !== 'tomado') || null
}