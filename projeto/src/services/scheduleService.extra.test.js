
import { describe, it, expect } from 'vitest'

import {
    obterStatusOcorrencia,
    listarOcorrenciasDoDia,
    listarHistorico,
    contarResumo,
    obterProximaOcorrencia
} from './scheduleService'

describe('obterStatusOcorrencia', () => {
    const agora = new Date(2026, 10, 26, 12, 0)

    it('deve manter status tomado', () => {
        const resultado = obterStatusOcorrencia({
            data: '2026-11-26',
            horario: '08:00',
            status: 'tomado'
        }, agora)

        expect(resultado).toBe('tomado')
    })

    it('deve identificar dose passada como atrasada', () => {
        const resultado = obterStatusOcorrencia({
            data: '2026-11-26',
            horario: '08:00',
            status: 'pendente'
        }, agora)

        expect(resultado).toBe('atrasado')
    })

    it('deve identificar dose futura como pendente', () => {
        const resultado = obterStatusOcorrencia({
            data: '2026-11-26',
            horario: '14:00',
            status: 'pendente'
        }, agora)

        expect(resultado).toBe('pendente')
    })
})

describe('listarOcorrenciasDoDia', () => {
    it('deve listar somente doses da data informada', () => {
        const medicamentos = [
            {
                id: 'med-1',
                nome: 'Paracetamol',
                quantidade: '1 comprimido',
                ocorrencias: [
                    {
                        id: 'dose-1',
                        data: '2026-11-26',
                        horario: '08:00',
                        status: 'tomado'
                    },
                    {
                        id: 'dose-2',
                        data: '2026-11-27',
                        horario: '08:00',
                        status: 'pendente'
                    }
                ]
            }
        ]

        const resultado = listarOcorrenciasDoDia(
            medicamentos,
            '2026-11-26',
            new Date(2026, 10, 26, 12, 0)
        )

        expect(resultado).toHaveLength(1)
        expect(resultado[0].ocorrenciaId).toBe('dose-1')
        expect(resultado[0].nome).toBe('Paracetamol')
    })

    it('deve ordenar doses do dia pelo horário', () => {
        const medicamentos = [
            {
                id: 'med-1',
                nome: 'Medicamento',
                ocorrencias: [
                    {
                        id: 'dose-2',
                        data: '2026-11-26',
                        horario: '16:00',
                        status: 'pendente'
                    },
                    {
                        id: 'dose-1',
                        data: '2026-11-26',
                        horario: '08:00',
                        status: 'tomado'
                    }
                ]
            }
        ]

        const resultado = listarOcorrenciasDoDia(
            medicamentos,
            '2026-11-26',
            new Date(2026, 10, 26, 12, 0)
        )

        expect(resultado[0].horario).toBe('08:00')
        expect(resultado[1].horario).toBe('16:00')
    })
})

describe('listarHistorico', () => {
    it('deve listar somente datas anteriores ao limite', () => {
        const medicamentos = [
            {
                id: 'med-1',
                nome: 'Medicamento',
                ocorrencias: [
                    {
                        id: 'dose-1',
                        data: '2026-11-25',
                        horario: '08:00',
                        status: 'tomado'
                    },
                    {
                        id: 'dose-2',
                        data: '2026-11-26',
                        horario: '08:00',
                        status: 'pendente'
                    }
                ]
            }
        ]

        const resultado = listarHistorico(
            medicamentos,
            '2026-11-26',
            new Date(2026, 10, 26, 12, 0)
        )

        expect(resultado).toHaveLength(1)
        expect(resultado[0].data).toBe('2026-11-25')
    })

    it('deve organizar datas do histórico em ordem decrescente', () => {
        const medicamentos = [
            {
                id: 'med-1',
                nome: 'Medicamento',
                ocorrencias: [
                    {
                        id: 'dose-1',
                        data: '2026-11-23',
                        horario: '08:00',
                        status: 'tomado'
                    },
                    {
                        id: 'dose-2',
                        data: '2026-11-25',
                        horario: '08:00',
                        status: 'tomado'
                    },
                    {
                        id: 'dose-3',
                        data: '2026-11-24',
                        horario: '08:00',
                        status: 'tomado'
                    }
                ]
            }
        ]

        const resultado = listarHistorico(
            medicamentos,
            '2026-11-26',
            new Date(2026, 10, 26, 12, 0)
        )

        expect(resultado.map((grupo) => grupo.data)).toEqual([
            '2026-11-25',
            '2026-11-24',
            '2026-11-23'
        ])
    })
})

describe('contarResumo', () => {
    it('deve contabilizar doses tomadas, pendentes e atrasadas', () => {
        const resultado = contarResumo([
            { status: 'tomado' },
            { status: 'tomado' },
            { status: 'pendente' },
            { status: 'atrasado' }
        ])

        expect(resultado).toEqual({
            total: 4,
            tomados: 2,
            pendentes: 1,
            atrasados: 1,
            naoTomados: 2
        })
    })
})

describe('obterProximaOcorrencia', () => {
    it('deve retornar a próxima dose não tomada', () => {
        const resultado = obterProximaOcorrencia([
            { horario: '16:00', status: 'pendente' },
            { horario: '08:00', status: 'tomado' },
            { horario: '14:00', status: 'pendente' }
        ])

        expect(resultado.horario).toBe('14:00')
    })

    it('deve retornar null quando todas as doses foram tomadas', () => {
        const resultado = obterProximaOcorrencia([
            { horario: '08:00', status: 'tomado' },
            { horario: '14:00', status: 'tomado' }
        ])

        expect(resultado).toBeNull()
    })
})
