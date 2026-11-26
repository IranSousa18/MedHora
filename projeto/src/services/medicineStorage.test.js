
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    vi
} from 'vitest'

import {
    buscarMedicamentos,
    salvarMedicamentos,
    buscarMedicamentoPorId,
    adicionarMedicamento,
    atualizarMedicamento,
    removerMedicamento,
    buscarOcorrencias,
    buscarOcorrencia,
    atualizarOcorrencia,
    atualizarStatusOcorrencia
} from './medicineStorage'

let armazenamento

describe('medicineStorage', () => {
    beforeEach(() => {
        armazenamento = {}

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((chave) => armazenamento[chave] ?? null),

            setItem: vi.fn((chave, valor) => {
                armazenamento[chave] = String(valor)
            })
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('deve retornar uma lista vazia quando não houver medicamentos', () => {
        expect(buscarMedicamentos()).toEqual([])
    })

    it('deve retornar uma lista vazia quando o JSON estiver inválido', () => {
        armazenamento.medicamentos = '{json inválido'

        expect(buscarMedicamentos()).toEqual([])
    })

    it('deve salvar e buscar medicamentos', () => {
        const medicamentos = [
            { id: 'med-1', nome: 'Paracetamol' }
        ]

        expect(salvarMedicamentos(medicamentos)).toBe(true)
        expect(buscarMedicamentos()).toEqual(medicamentos)
    })

    it('deve adicionar medicamento com ID e normalizar ocorrências', () => {
        const novo = adicionarMedicamento({
            nome: 'Dipirona',
            ocorrencias: [
                {
                    id: 'dose-1',
                    data: '2026-11-26',
                    horario: '08:00',
                    status: 'invalido'
                }
            ]
        })

        expect(novo).not.toBeNull()
        expect(novo.id).toBeTruthy()
        expect(novo.ocorrencias).toHaveLength(1)
        expect(novo.ocorrencias[0].id).toBe('dose-1')
        expect(novo.ocorrencias[0].status).toBe('pendente')
    })

    it('deve buscar medicamento pelo ID', () => {
        salvarMedicamentos([
            { id: 'med-1', nome: 'Paracetamol' }
        ])

        expect(buscarMedicamentoPorId('med-1').nome)
            .toBe('Paracetamol')

        expect(buscarMedicamentoPorId('inexistente')).toBeNull()
    })

    it('deve atualizar medicamento preservando seu ID', () => {
        salvarMedicamentos([
            { id: 'med-1', nome: 'Paracetamol', quantidade: 1 }
        ])

        const atualizado = atualizarMedicamento('med-1', {
            nome: 'Paracetamol atualizado',
            quantidade: 2
        })

        expect(atualizado.id).toBe('med-1')
        expect(atualizado.nome).toBe('Paracetamol atualizado')
        expect(atualizado.quantidade).toBe(2)
    })

    it('deve retornar null ao atualizar medicamento inexistente', () => {
        expect(atualizarMedicamento('inexistente', {
            nome: 'Teste'
        })).toBeNull()
    })

    it('deve remover medicamento e suas ocorrências', () => {
        salvarMedicamentos([
            {
                id: 'med-1',
                nome: 'Paracetamol',
                ocorrencias: [{ id: 'dose-1' }]
            },
            { id: 'med-2', nome: 'Dipirona' }
        ])

        expect(removerMedicamento('med-1')).toBe(true)
        expect(buscarMedicamentos()).toEqual([
            { id: 'med-2', nome: 'Dipirona' }
        ])
    })

    it('deve retornar false ao remover medicamento inexistente', () => {
        salvarMedicamentos([
            { id: 'med-1', nome: 'Paracetamol' }
        ])

        expect(removerMedicamento('inexistente')).toBe(false)
    })

    it('deve buscar ocorrências de um medicamento', () => {
        salvarMedicamentos([
            {
                id: 'med-1',
                ocorrencias: [
                    { id: 'dose-1', horario: '08:00' }
                ]
            }
        ])

        expect(buscarOcorrencias('med-1')).toHaveLength(1)
        expect(buscarOcorrencias('inexistente')).toEqual([])
    })

    it('deve buscar uma ocorrência pelo ID', () => {
        salvarMedicamentos([
            {
                id: 'med-1',
                ocorrencias: [
                    { id: 'dose-1', horario: '08:00' }
                ]
            }
        ])

        expect(buscarOcorrencia('med-1', 'dose-1').horario)
            .toBe('08:00')

        expect(buscarOcorrencia('med-1', 'inexistente')).toBeNull()
    })

    it('deve atualizar ocorrência existente', () => {
        salvarMedicamentos([
            {
                id: 'med-1',
                ocorrencias: [
                    {
                        id: 'dose-1',
                        data: '2020-01-01',
                        horario: '08:00',
                        status: 'pendente'
                    }
                ]
            }
        ])

        const resultado = atualizarOcorrencia(
            'med-1',
            'dose-1',
            { status: 'tomado' }
        )

        expect(resultado.status).toBe('tomado')
        expect(resultado.id).toBe('dose-1')
    })

    it('não deve permitir marcar uma dose futura como tomada', () => {
        salvarMedicamentos([
            {
                id: 'med-1',
                ocorrencias: [
                    {
                        id: 'dose-futura',
                        data: '2999-01-01',
                        horario: '08:00',
                        status: 'pendente'
                    }
                ]
            }
        ])

        const resultado = atualizarStatusOcorrencia(
            'med-1',
            'dose-futura',
            'tomado'
        )

        expect(resultado).toBeNull()
        expect(
            buscarOcorrencia('med-1', 'dose-futura').status
        ).toBe('pendente')
    })

    it('não deve aceitar status inválido', () => {
        salvarMedicamentos([
            {
                id: 'med-1',
                ocorrencias: [
                    {
                        id: 'dose-1',
                        data: '2020-01-01',
                        horario: '08:00',
                        status: 'pendente'
                    }
                ]
            }
        ])

        const resultado = atualizarStatusOcorrencia(
            'med-1',
            'dose-1',
            'atrasado'
        )

        expect(resultado).toBeNull()
        expect(
            buscarOcorrencia('med-1', 'dose-1').status
        ).toBe('pendente')
    })
})
