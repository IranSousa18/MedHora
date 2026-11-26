
const CHAVE_USUARIO = 'usuarioCadastrado'
const CHAVE_SESSAO = 'usuarioLogado'

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

            // Mantém somente os dados necessários na sessão.
            const sessao = {
                nome: usuario.nome,
                email: usuario.email
            }

            // Atualiza sessões antigas que armazenavam a senha.
            armazenamento.setItem(CHAVE_SESSAO, JSON.stringify(sessao))

            return sessao
        } catch {
            continue
        }
    }

    return null
}

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

    if (!nome || !email || !email.includes('@') || !senha) {
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
        const novoUsuario = {
            nome,
            email,
            senha
        }

        localStorage.setItem(
            CHAVE_USUARIO,
            JSON.stringify(novoUsuario)
        )

        return true
    } catch {
        return false
    }
}

export function autenticarUsuario(email, senha, lembrar = false) {
    if (
        typeof email !== 'string' ||
        typeof senha !== 'string' ||
        !email.trim() ||
        !senha
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

export function encerrarSessao() {
    try {
        localStorage.removeItem(CHAVE_SESSAO)
    } catch {
        // Evita interromper o encerramento da sessão.
    }

    try {
        sessionStorage.removeItem(CHAVE_SESSAO)
    } catch {
        // Evita interromper o encerramento da sessão.
    }
}

export function estaAutenticado() {
    const usuario = buscarUsuarioLogado()

    return Boolean(
        usuario?.nome?.trim() &&
        usuario?.email?.trim()
    )
}
