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
    if (!dataStr) return null
    const [ano, mes, dia] = dataStr.split('-').map(Number)
    const [hora, min] = horarioStr.split(':').map(Number)
    const data = new Date(ano, mes - 1, dia, hora || 0, min || 0)
    return Number.isNaN(data.getTime()) ? null : data
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
    if (!inicio || !fim || valor <= 0 || fim < inicio) return []

    const unidade = String(unidadeIntervalo).toLowerCase()
    const fator = unidade.startsWith('dia') ? 1440 : unidade.startsWith('min') ? 1 : 60
    const passoMs = valor * fator * MINUTO_MS
    const ocorrencias = []

    for (let t = inicio.getTime(), i = 0; t <= fim.getTime() && i < maxOcorrencias; t += passoMs, i++) {
        const d = new Date(t)
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')
        ocorrencias.push({ id: `oc_${t}_${i}`, data: obterDataHoje(d), horario: `${hh}:${mm}`, status: 'pendente' })
    }
    return ocorrencias
}

export function recalcularOcorrencias(ocorrenciasAtuais = [], novaConfig, agora = new Date()) {
    const hoje = obterDataHoje(agora)
    const tomadas = ocorrenciasAtuais.filter((oc) => oc.status === 'tomado')
    const chavesTomadas = new Set(tomadas.map((oc) => `${oc.data}_${oc.horario}`))

    const inicio = !novaConfig.dataInicio || novaConfig.dataInicio < hoje ? hoje : novaConfig.dataInicio
    const novas = gerarOcorrencias({ ...novaConfig, dataInicio: inicio })
        .filter((oc) => !chavesTomadas.has(`${oc.data}_${oc.horario}`))

    return [...tomadas, ...novas].sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`))
}

export function obterStatusOcorrencia(ocorrencia, agora = new Date(), tolerancia = TOLERANCIA_MINUTOS) {
    if (ocorrencia.status === 'tomado') return 'tomado'
    const dataDose = criarDataLocal(ocorrencia.data, ocorrencia.horario)
    if (!dataDose) return 'pendente'
    return agora.getTime() > dataDose.getTime() + tolerancia * MINUTO_MS ? 'atrasado' : 'pendente'
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

export function listarOcorrenciasDoDia(medicamentos = [], data = obterDataHoje(), agora = new Date()) {
    return (medicamentos || [])
        .flatMap((med) => (med.ocorrencias || [])
            .filter((oc) => oc.data === data)
            .map((oc) => montarItem(med, oc, agora)))
        .sort((a, b) => a.horario.localeCompare(b.horario))
}

export function listarHistorico(medicamentos = [], dataLimite = obterDataHoje(), agora = new Date()) {
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
            medicamentos: grupos[data].sort((a, b) => a.horario.localeCompare(b.horario))
        }))
}

export function contarResumo(itens = []) {
    const lista = itens || []
    const tomados = lista.filter((i) => i.status === 'tomado').length
    const atrasados = lista.filter((i) => i.status === 'atrasado').length
    const pendentes = lista.length - tomados - atrasados
    return { total: lista.length, tomados, pendentes, atrasados, naoTomados: pendentes + atrasados }
}

export function obterProximaOcorrencia(itens = []) {
    return [...(itens || [])]
        .sort((a, b) => a.horario.localeCompare(b.horario))
        .find((i) => i.status !== 'tomado') || null
}