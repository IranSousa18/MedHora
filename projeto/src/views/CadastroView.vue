<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')

const mostrarSenha = ref(false)
const mostrarConfirmacao = ref(false)

function cadastrarUsuario() {

    // Verifica se todos os campos estão preenchidos
    if (
        !nome.value ||
        !email.value ||
        !senha.value ||
        !confirmarSenha.value
    ) {
        alert('Preencha todos os campos.')
        return
    }
    
    // Verifica de a confirmar senha é igual senha
    if (senha.value !== confirmarSenha.value) {
        alert('As senhas não coincidem.')
        return
    }
    
    const usuario = {
        nome: nome.value,
        email: email.value,
        senha: senha.value
    }

// Quando todas as informações são inseridas cria e
// guarda o usuário em um local storage
localStorage.setItem(
    'usuarioCadastrado',
    JSON.stringify(usuario)
)

    alert('Cadastro realizado com sucesso!')

    router.push('/')
}

// Mostra ou esconde a senha
function alternarSenha() {
    mostrarSenha.value = !mostrarSenha.value
}

function alternarConfirmacao() {
    mostrarConfirmacao.value = !mostrarConfirmacao.value
}

// Volta para a página de login
function voltarLogin() {
    router.push('/')
}
</script>

<template>
    <main class="login-container">

    <!-- PAINEL ESQUERDO -->
    <section class="painel-esquerdo">

    <div class="logo">
        <div class="icone-logo">
            💊
        </div>

        <div class="logo-texto">
            <h2>Med<span>Hora</span></h2>
            <p>Sua saúde em dia</p>
        </div>
    </div>

        <div class="frases">
        <div class="linha"></div>

        <h3>
            "Organize seus medicamentos e cuide melhor da sua saúde."
        </h3>
        </div>

    <div class="planta">
        🌿
    </div>

    </section>

    <!-- PAINEL DIREITO -->
    <section class="painel-direita">

        <div class="form-box">

        <h1>Criar Conta</h1>

        <p class="subtitulo">
            Preencha os dados abaixo para se cadastrar.
        </p>

        <!-- NOME -->
        <div class="input-group">
            <label for="nome">Nome Completo</label>

        <div class="input-wrapper">
            <span class="input-icon">👤</span>

            <input
            v-model="nome"
            type="text"
            id="nome"
            placeholder="Seu nome"
            >
            </div>
        </div>

        <!-- EMAIL -->
        <div class="input-group">
            <label for="email">E-mail</label>

        <div class="input-wrapper">
            <span class="input-icon">✉</span>

            <input
                v-model="email"
                type="email"
                id="email"
                placeholder="Ex: seuemail@dominio.com"
            >
            </div>
        </div>

        <!-- SENHA -->
        <div class="input-group">
            <label for="senha">Senha</label>

        <div class="input-wrapper">
            <span class="input-icon">🔒</span>

            <input
            v-model="senha"
            :type="mostrarSenha ? 'text' : 'password'"
            id="senha"
            placeholder="Crie uma senha"
            >

            <button
                type="button"
                class="btn-mostrar-senha"
                @click="alternarSenha"
            >
                {{ mostrarSenha ? '◉' : '◌' }}
            </button>
            </div>
        </div>

        <!-- CONFIRMAR SENHA -->
        <div class="input-group">
            <label for="confirmarSenha">
            Confirmar Senha
        </label>

        <div class="input-wrapper">
            <span class="input-icon">🔐</span>

            <input
                v-model="confirmarSenha"
                :type="mostrarConfirmacao ? 'text' : 'password'"
                id="confirmarSenha"
                placeholder="Repita a senha"
            >

            <button
                type="button"
                class="btn-mostrar-senha"
                @click="alternarConfirmacao"
            >
                {{ mostrarConfirmacao ? '◉' : '◌' }}
            </button>
            </div>
        </div>

        <!-- BOTÃO CADASTRAR -->
        <button
            type="button"
            class="btn-login"
            @click="cadastrarUsuario"
        >
        Criar Conta
        </button>

        <!-- VOLTAR -->
        <div class="contact-box">
            <h4>Já possui uma conta?</h4>

        <button
            type="button"
            class="btn-criar-conta"
            @click="voltarLogin"
        >
            Voltar para Login
            </button>
        </div>

        </div>

    </section>

    </main>
</template>

<style scoped>
</style>