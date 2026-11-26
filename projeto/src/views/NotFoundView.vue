<template>
  <main class="pagina-404">
    <div class="conteudo-404">
      <span class="material-icons icone-404">error_outline</span>

      <h1>404</h1>

      <h2>Página não encontrada</h2>

      <p>
        A página que você tentou acessar não existe
        ou foi movida.
      </p>

      <button
        type="button"
        class="botao-404"
        @click="voltarInicio"
      >
        Voltar ao início
      </button>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function voltarInicio() {
  router.push('/home')
}
</script>

<style scoped>
.pagina-404 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f8f7;
}

.conteudo-404 {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e2e8e5;
  border-radius: 20px;
  box-shadow: 0 4px 18px rgba(30, 70, 50, 0.06);
}

.icone-404 {
  color: #198754;
  font-size: 60px;
  margin-bottom: 10px;
}

.conteudo-404 h1 {
  color: #198754;
  font-size: 64px;
  margin-bottom: 8px;
}

.conteudo-404 h2 {
  font-size: 22px;
  margin-bottom: 12px;
}

.conteudo-404 p {
  color: #718096;
  margin-bottom: 25px;
}

.botao-404 {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #198754;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.botao-404:hover {
  background: #146c43;
}
</style>