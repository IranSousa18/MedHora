
import { describe, it, expect } from 'vitest'
import {
    gerarOcorrencias,
    recalcularOcorrencias
} from './scheduleService'

describe('gerarOcorrencias', () => {
    it('deve gerar doses respeitando o intervalo em horas', () => {
        const resultado = gerarOcorrencias({
            dataInicio: '2026-11-26',
            dataTermino: '2026-11-26',
            horario: '08:00',
            intervalo: 8,
            unidadeIntervalo: 'horas'
        })

        expect(resultado).toHaveLength(2)
        expect(resultado[0].horario).toBe('08:00')
        expect(resultado[1].horario).toBe('16:00')
    })

    it('deve gerar doses respeitando o intervalo em minutos', () => {
        const resultado = gerarOcorrencias({
            dataInicio: '2026-11-26',
            dataTermino: '2026-11-26',
            horario: '08:00',
            intervalo: 30,
            unidadeIntervalo: 'minutos'
        })

        expect(resultado).toHaveLength(32)
        expect(resultado[0].horario).toBe('08:00')
        expect(resultado[1].horario).toBe('08:30')
        expect(resultado[2].horario).toBe('09:00')
    })

    it('deve retornar uma lista vazia quando o intervalo for inválido', () => {
        const resultado = gerarOcorrencias({
            dataInicio: '2026-11-26',
            dataTermino: '2026-11-26',
            horario: '08:00',
            intervalo: 0,
            unidadeIntervalo: 'horas'
        })

        expect(resultado).toEqual([])
    })

    it('deve impedir a geração quando ultrapassar o limite de doses', () => {
        expect(() => {
            gerarOcorrencias({
                dataInicio: '2026-11-26',
                dataTermino: '2026-11-26',
                horario: '08:00',
                intervalo: 4,
                unidadeIntervalo: 'horas',
                maxOcorrencias: 2
            })
        }).toThrow('O tratamento ultrapassou o limite de 2 doses.')
    })
})

describe('recalcularOcorrencias', () => {
    const agora = new Date(2026, 10, 26, 12, 0)

    const novaConfig = {
        dataInicio: '2026-11-26',
        dataTermino: '2026-11-26',
        horario: '08:00',
        intervalo: 2,
        unidadeIntervalo: 'horas'
    }

    it('deve preservar doses já tomadas', () => {
        const atuais = [
            {
                id: 'dose-tomada',
                data: '2026-11-26',
                horario: '09:00',
                status: 'tomado'
            }
        ]

        const resultado = recalcularOcorrencias(
            atuais,
            novaConfig,
            agora
        )

        expect(resultado).toContainEqual(atuais[0])
    })

    it('deve preservar doses passadas independentemente do status', () => {
        const dosePendente = {
            id: 'dose-pendente',
            data: '2026-11-26',
            horario: '08:00',
            status: 'pendente'
        }

        const doseAtrasada = {
            id: 'dose-atrasada',
            data: '2026-11-26',
            horario: '10:00',
            status: 'atrasado'
        }

        const resultado = recalcularOcorrencias(
            [dosePendente, doseAtrasada],
            novaConfig,
            agora
        )

        expect(resultado).toContainEqual(dosePendente)
        expect(resultado).toContainEqual(doseAtrasada)
    })

    it('deve gerar novas doses futuras', () => {
        const resultado = recalcularOcorrencias(
            [],
            novaConfig,
            agora
        )

        expect(
            resultado.some((dose) => dose.horario === '14:00')
        ).toBe(true)

        expect(
            resultado.some((dose) => dose.horario === '16:00')
        ).toBe(true)
    })

    it('não deve duplicar horários de doses futuras existentes', () => {
        const doseExistente = {
            id: 'dose-existente',
            data: '2026-11-26',
            horario: '14:00',
            status: 'pendente'
        }

        const resultado = recalcularOcorrencias(
            [doseExistente],
            novaConfig,
            agora
        )

        const dosesDasQuatorze = resultado.filter(
            (dose) => dose.data === '2026-11-26' &&
                dose.horario === '14:00'
        )

        expect(dosesDasQuatorze).toHaveLength(1)
    })
})
