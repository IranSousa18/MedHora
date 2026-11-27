 // ========================================
 // CONSTANTES DE ARMAZENAMENTO
 // ========================================

const CHAVE_USUARIO = 'usuarioCadastrado'
const CHAVE_SESSAO = 'usuarioLogado'

// ========================================
// VALIDAÇÕES
// ========================================

const REGEX_EMAIL =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/

const REGEX_EMOJI =
    /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u{1F1E6}-\u{1F1FF}]/u

export function emailValido(email) {
    return (
        typeof email === 'string' &&
        REGEX_EMAIL.test(email.trim())
    )
}

export function senhaValida(senha) {
    return (
        typeof senha === 'string' &&
        senha.length >= 8 &&
        !REGEX_EMOJI.test(senha)
    )
}

// ========================================
// BUSCAR USUÁRIO CADASTRADO
// ========================================

export function buscarUsuarioCadastrado() {
    try {
        const dados = localStorage.getItem(CHAVE_USUARIO)

        if (!dados) return null

        const usuario = JSON.parse(dados)

        if (
            !usuario ||
            typeof usuario.nome !== 'string' ||
            typeof usuario.email !== 'string' ||
            typeof usuario.senha !== 'string'
        ) {
            return null
        }

        return usuario
    } catch {
        return null
    }
}

// ========================================
// BUSCAR USUÁRIO LOGADO
// ========================================

export function buscarUsuarioLogado() {
    const armazenamentos = [localStorage, sessionStorage]

    for (const armazenamento of armazenamentos) {
        try {
            const dados = armazenamento.getItem(CHAVE_SESSAO)

            if (!dados) continue

            const usuario = JSON.parse(dados)

            if (
                !usuario ||
                typeof usuario.nome !== 'string' ||
                !usuario.nome.trim() ||
                typeof usuario.email !== 'string' ||
                !usuario.email.trim()
            ) {
                armazenamento.removeItem(CHAVE_SESSAO)
                continue
            }

            const sessao = {
                nome: usuario.nome,
                email: usuario.email
            }

            armazenamento.setItem(
                CHAVE_SESSAO,
                JSON.stringify(sessao)
            )

            return sessao
        } catch {
            continue
        }
    }

    return null
}

// ========================================
// CADASTRAR USUÁRIO
// ========================================

export function cadastrarUsuario(usuario) {
    if (
        typeof usuario?.nome !== 'string' ||
        typeof usuario?.email !== 'string' ||
        typeof usuario?.senha !== 'string'
    ) {
        return false
    }

    const nome = usuario.nome.trim()
    const email = usuario.email.trim().toLowerCase()
    const senha = usuario.senha

    if (
        !nome ||
        !emailValido(email) ||
        !senhaValida(senha)
    ) {
        return false
    }

    const usuarioExistente = buscarUsuarioCadastrado()

    if (
        usuarioExistente &&
        usuarioExistente.email.trim().toLowerCase() === email
    ) {
        return false
    }

    try {
        localStorage.setItem(
            CHAVE_USUARIO,
            JSON.stringify({ nome, email, senha })
        )

        return true
    } catch {
        return false
    }
}

// ========================================
// AUTENTICAR USUÁRIO
// ========================================

export function autenticarUsuario(email, senha, lembrar = false) {
    if (
        typeof email !== 'string' ||
        typeof senha !== 'string' ||
        !emailValido(email) ||
        !senhaValida(senha)
    ) {
        return false
    }

    const usuario = buscarUsuarioCadastrado()

    if (!usuario) return false

    const emailInformado = email.trim().toLowerCase()
    const emailCadastrado = usuario.email.trim().toLowerCase()

    if (
        emailCadastrado !== emailInformado ||
        usuario.senha !== senha
    ) {
        return false
    }

    const sessao = {
        nome: usuario.nome,
        email: usuario.email
    }

    try {
        if (lembrar) {
            localStorage.setItem(
                CHAVE_SESSAO,
                JSON.stringify(sessao)
            )

            sessionStorage.removeItem(CHAVE_SESSAO)
        } else {
            sessionStorage.setItem(
                CHAVE_SESSAO,
                JSON.stringify(sessao)
            )

            localStorage.removeItem(CHAVE_SESSAO)
        }

        return true
    } catch {
        return false
    }
}

// ========================================
// ENCERRAR SESSÃO
// ========================================

export function encerrarSessao() {
    try {
        localStorage.removeItem(CHAVE_SESSAO)
    } catch {
    }

    try {
        sessionStorage.removeItem(CHAVE_SESSAO)
    } catch {
    }
}

// ========================================
// VERIFICAR AUTENTICAÇÃO
// ========================================

export function estaAutenticado() {
    const usuario = buscarUsuarioLogado()

    return Boolean(
        usuario?.nome?.trim() &&
        usuario?.email?.trim()
    )
}
