
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    vi
} from 'vitest'

import {
    buscarUsuarioCadastrado,
    buscarUsuarioLogado,
    cadastrarUsuario,
    autenticarUsuario,
    encerrarSessao,
    estaAutenticado
} from './authService'

let armazenamentoLocal
let armazenamentoSessao

function criarStorage(armazenamento) {
    return {
        getItem: vi.fn((chave) => armazenamento[chave] ?? null),

        setItem: vi.fn((chave, valor) => {
            armazenamento[chave] = String(valor)
        }),

        removeItem: vi.fn((chave) => {
            delete armazenamento[chave]
        })
    }
}

describe('authService', () => {
    beforeEach(() => {
        armazenamentoLocal = {}
        armazenamentoSessao = {}

        vi.stubGlobal(
            'localStorage',
            criarStorage(armazenamentoLocal)
        )

        vi.stubGlobal(
            'sessionStorage',
            criarStorage(armazenamentoSessao)
        )
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('deve retornar null quando não houver usuário cadastrado', () => {
        expect(buscarUsuarioCadastrado()).toBeNull()
    })

    it('deve cadastrar usuário normalizando nome e email', () => {
        const resultado = cadastrarUsuario({
            nome: '  João Silva  ',
            email: '  JOAO@EMAIL.COM  ',
            senha: '12345678'
        })

        expect(resultado).toBe(true)

        expect(buscarUsuarioCadastrado()).toEqual({
            nome: 'João Silva',
            email: 'joao@email.com',
            senha: '12345678'
        })
    })

    it('não deve cadastrar usuário com dados inválidos', () => {
        expect(cadastrarUsuario({
            nome: '',
            email: 'joao@email.com',
            senha: '12345678'
        })).toBe(false)

        expect(cadastrarUsuario({
            nome: 'João',
            email: 'email inválido',
            senha: '12345678'
        })).toBe(false)

        expect(cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: ''
        })).toBe(false)
    })

    it('não deve permitir email duplicado', () => {
        cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        expect(cadastrarUsuario({
            nome: 'Outro',
            email: 'JOAO@EMAIL.COM',
            senha: 'abcdefgh'
        })).toBe(false)
    })

    it('deve autenticar com credenciais corretas', () => {
        cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        expect(
            autenticarUsuario('joao@email.com', '12345678')
        ).toBe(true)
    })

    it('deve aceitar email com diferenças de maiúsculas e espaços', () => {
        cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        expect(
            autenticarUsuario('  JOAO@EMAIL.COM  ', '12345678')
        ).toBe(true)
    })

    it('não deve autenticar com senha incorreta', () => {
        cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        expect(
            autenticarUsuario('joao@email.com', 'senhaerrada')
        ).toBe(false)
    })

    it('não deve autenticar email inexistente', () => {
        expect(
            autenticarUsuario('inexistente@email.com', '12345678')
        ).toBe(false)
    })

    it('não deve autenticar com campos vazios', () => {
        expect(autenticarUsuario('', '12345678')).toBe(false)
        expect(autenticarUsuario('joao@email.com', '')).toBe(false)
    })

    it('deve salvar sessão no sessionStorage sem lembrar login', () => {
        cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        autenticarUsuario('joao@email.com', '12345678', false)

        expect(armazenamentoSessao.usuarioLogado).toBeTruthy()
        expect(armazenamentoLocal.usuarioLogado).toBeUndefined()

        const sessao = JSON.parse(
            armazenamentoSessao.usuarioLogado
        )

        expect(sessao).toEqual({
            nome: 'João',
            email: 'joao@email.com'
        })

        expect(sessao.senha).toBeUndefined()
    })

    it('deve salvar sessão no localStorage quando lembrar login', () => {
        cadastrarUsuario({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        autenticarUsuario('joao@email.com', '12345678', true)

        expect(armazenamentoLocal.usuarioLogado).toBeTruthy()
        expect(armazenamentoSessao.usuarioLogado).toBeUndefined()
    })

    it('deve buscar usuário logado', () => {
        armazenamentoSessao.usuarioLogado = JSON.stringify({
            nome: 'João',
            email: 'joao@email.com'
        })

        expect(buscarUsuarioLogado()).toEqual({
            nome: 'João',
            email: 'joao@email.com'
        })
    })

    it('deve remover senha de sessão antiga', () => {
        armazenamentoLocal.usuarioLogado = JSON.stringify({
            nome: 'João',
            email: 'joao@email.com',
            senha: '12345678'
        })

        const resultado = buscarUsuarioLogado()

        expect(resultado).toEqual({
            nome: 'João',
            email: 'joao@email.com'
        })

        expect(
            JSON.parse(armazenamentoLocal.usuarioLogado).senha
        ).toBeUndefined()
    })

    it('deve encerrar sessão removendo os dois armazenamentos', () => {
        armazenamentoLocal.usuarioLogado = JSON.stringify({
            nome: 'João',
            email: 'joao@email.com'
        })

        armazenamentoSessao.usuarioLogado = JSON.stringify({
            nome: 'João',
            email: 'joao@email.com'
        })

        encerrarSessao()

        expect(armazenamentoLocal.usuarioLogado).toBeUndefined()
        expect(armazenamentoSessao.usuarioLogado).toBeUndefined()
    })

    it('deve verificar se o usuário está autenticado', () => {
        expect(estaAutenticado()).toBe(false)

        armazenamentoSessao.usuarioLogado = JSON.stringify({
            nome: 'João',
            email: 'joao@email.com'
        })

        expect(estaAutenticado()).toBe(true)
    })
})
