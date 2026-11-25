
const CHAVE_USUARIO = 'usuarioCadastrado'
const CHAVE_SESSAO = 'usuarioLogado'

export function buscarUsuarioCadastrado() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIO)) || null
    } catch {
        return null
    }
}

export function buscarUsuarioLogado() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_SESSAO)) || null
    } catch {
        return null
    }
}

export function cadastrarUsuario(usuario) {
    if (!usuario?.nome || !usuario?.email || !usuario?.senha) {
        return false
    }

    try {
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
        return true
    } catch {
        return false
    }
}

export function autenticarUsuario(email, senha) {
    const usuario = buscarUsuarioCadastrado()

    if (!usuario) return false

    if (usuario.email !== email || usuario.senha !== senha) {
        return false
    }

    try {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario))
        return true
    } catch {
        return false
    }
}

export function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO)
}

export function estaAutenticado() {
    return buscarUsuarioLogado() !== null
}
