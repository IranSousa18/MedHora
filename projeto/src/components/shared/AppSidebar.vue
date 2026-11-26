<template>
  <aside class="barra-lateral">
    <div class="cabecalho-barra-lateral">
      <div class="icone-logo">
        <span class="material-icons">medication</span>
      </div>

      <div class="texto-logo">
        <h1>MedHora</h1>
        <p>Sua saúde em dia</p>
      </div>
    </div>

    <nav class="menu-lateral">
      <RouterLink to="/home" class="item-menu">
        <span class="material-icons">home</span>
        <span>Início</span>
      </RouterLink>

      <RouterLink to="/hoje" class="item-menu">
        <span class="material-icons">calendar_today</span>
        <span>Hoje</span>
      </RouterLink>

      <RouterLink to="/medicamentos" class="item-menu">
        <span class="material-icons">format_list_bulleted</span>
        <span>Medicamentos</span>
      </RouterLink>

      <RouterLink to="/historico" class="item-menu">
        <span class="material-icons">history</span>
        <span>Histórico</span>
      </RouterLink>
    </nav>

    <div class="rodape-barra-lateral">
      <button
        type="button"
        class="item-menu botao-sair"
        @click="sair"
      >
        <span class="material-icons">logout</span>
        <span>Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { encerrarSessao } from '../../services/authService'

const router = useRouter()

function sair() {
  encerrarSessao()
  router.push('/login')
}
</script>

<style src="../../assets/styles/home.css"></style>

<style scoped>
.botao-sair {
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
</style>