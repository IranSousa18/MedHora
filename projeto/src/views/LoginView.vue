
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  autenticarUsuario
} from '../services/authService'

const router = useRouter()

const email = ref('')
const senha = ref('')
const lembrar = ref(false)

const mostrarSenha = ref(false)

function fazerLogin() {
  if (!email.value.trim() || !senha.value) {
    alert('Preencha o e-mail e a senha.')
    return
  }

  const loginValido = autenticarUsuario(
    email.value,
    senha.value,
    lembrar.value
  )

  if (loginValido) {
    router.push('/home')
  } else {
    alert('E-mail ou senha incorretos.')
  }
}

function alternarSenha() {
  mostrarSenha.value = !mostrarSenha.value
}

function cadastrarUsuario() {
  router.push('/cadastro')
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
                    <h2>
                        Med<span>Hora</span>
                    </h2>

                    <p>
                        Sua saúde em dia
                    </p>
                </div>
            </div>

            <div class="frases">
                <div class="linha"></div>

                <h3>
                    “Pequenos cuidados hoje fazem uma grande diferença amanhã.”
                </h3>
            </div>

            <div class="planta">
                🌿
            </div>

        </section>

        <!-- PAINEL DIREITO -->
        <section class="painel-direita">

            <div class="form-box">

                <h1>
                    Entrar no sistema
                </h1>

                <p class="subtitulo">
                    Informe seus dados para acessar o MedHora.
                </p>

                <!-- E-MAIL -->
                <div class="input-group">

                    <label for="email">
                        E-mail
                    </label>

                    <div class="input-wrapper">

                        <span class="input-icon">
                            ✉
                        </span>

                        <input
                            v-model="email"
                            type="email"
                            id="email"
                            placeholder="Ex: seuemail@dominio.com"
                            autocomplete="email"
                        >

                    </div>

                </div>

                <!-- SENHA -->
                <div class="input-group">

                    <label for="senha">
                        Senha
                    </label>

                    <div class="input-wrapper">

                        <span class="input-icon">
                            🔒
                        </span>

                        <input
                            v-model="senha"
                            :type="mostrarSenha ? 'text' : 'password'"
                            id="senha"
                            placeholder="Sua senha"
                            autocomplete="current-password"
                        >

                        <button
                            type="button"
                            class="btn-mostrar-senha"
                            @click="alternarSenha"
                            aria-label="Mostrar ou esconder senha"
                        >
                            {{ mostrarSenha ? '◉' : '○' }}
                        </button>

                    </div>

                </div>

                <!-- OPÇÕES -->
                <div class="opcoes">

                    <label
                        for="check"
                        class="lembrar"
                    >

                        <input
                            v-model="lembrar"
                            type="checkbox"
                            id="check"
                        >

                        <span>
                            Lembrar de mim
                        </span>

                    </label>

                </div>

                <!-- BOTÃO LOGIN -->
                <button
                    type="button"
                    class="btn-login"
                    @click="fazerLogin"
                >
                    Entrar
                </button>

                <!-- SEPARADOR -->
                <div class="separador">

                    <span>
                        ou
                    </span>

                </div>

                <!-- CRIAR CONTA -->
                <div class="contact-box">

                    <h4>
                        Ainda não tem acesso?
                    </h4>

                    <button
                        type="button"
                        class="btn-criar-conta"
                        @click="cadastrarUsuario"
                    >
                        Criar Conta
                    </button>

                </div>

            </div>

        </section>

    </main>
</template>

<style src="../assets/styles/login.css"></style>
