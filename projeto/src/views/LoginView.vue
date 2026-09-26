<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dados do formulário
const email = ref('')
const senha = ref('')
const lembrar = ref(false)

// Controle da senha
const mostrarSenha = ref(false)

// Realiza o login
function fazerLogin() {

    if (!email.value || !senha.value) {
        alert('Preencha o e-mail e a senha.')
        return
    }

    const usuarioSalvo = JSON.parse(
        localStorage.getItem('usuarioCadastrado')
    )

    if (!usuarioSalvo) {
        alert('Nenhum usuário cadastrado.')
        return
    }

    if (
        email.value === usuarioSalvo.email &&
        senha.value === usuarioSalvo.senha
    ) {

        localStorage.setItem(
            'usuarioLogado',
            JSON.stringify(usuarioSalvo)
        )

        router.push('/home')

    } else {

        alert('E-mail ou senha incorretos.')

    }
}
// Mostra ou esconde a senha
function alternarSenha() {
    mostrarSenha.value = !mostrarSenha.value
}

// Redireciona para a página de cadastro
function cadastrarUsuario () {
    router.push('cadastro')
}
</script>


<template>

    <main class="login-container">

        <!--PAINEL ESQUERDO -->

        <section class="painel-esquerdo">

            <!-- Logo -->

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


            <!-- Frase -->

            <div class="frases">

                <div class="linha"></div>

                <h3>
                    “Pequenos cuidados hoje fazem uma grande diferença amanhã.”
                </h3>

            </div>


            <!-- Planta -->

            <div class="planta">
                🌿
            </div>

        </section>


        <!-- PAINEL DIREITO -->

        <section class="painel-direita">

            <div class="form-box">

                <!-- Título -->

                <h1>
                    Entrar no sistema
                </h1>

                <p class="subtitulo">
                    Informe seus dados para acessar o MedHora.
                </p>


                <!--E-MAIL -->

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
                        >

                    </div>

                </div>


                <!--SENHA -->

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
                            minlength="8"
                        >

                        <button
                            type="button"
                            class="btn-mostrar-senha"
                            @click="alternarSenha"
                            aria-label="Mostrar ou esconder senha"
                        >
                            {{ mostrarSenha ? '◉' : '◌' }}
                        </button>

                    </div>

                </div>


                <!--OPÇÕES -->

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


                    <a href="#">
                        Esqueceu sua senha?
                    </a>

                </div>


                <!--BOTÃO LOGIN-->

                <button
                    type="button"
                    class="btn-login"
                    @click="fazerLogin"
                >
                    Entrar
                </button>


                <!--SEPARADOR -->

                <div class="separador">

                    <span>
                        ou
                    </span>

                </div>


                <!--Criar Conta -->

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


<style scoped>

</style>