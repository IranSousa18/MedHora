
<template>
  <div class="painel">
    <AppSidebar />

    <main class="inicio">
      <!-- Cabeçalho -->
      <header class="cabecalho-inicio">
        <div class="boas-vindas">
          <h1>Olá!</h1>
          <p>Aqui está um resumo do seu dia.</p>
        </div>

        <div class="data-atual">
          <span class="material-icons">calendar_today</span>
          <p>{{ dataAtual }}</p>
        </div>
      </header>

      <!-- Resumo do dia -->
      <section class="resumo-dia">
        <article class="cartao-resumo medicamentos-hoje">
          <div class="icone-resumo">
            <span class="material-icons">medication</span>
          </div>

          <h2>{{ medicamentos.length }}</h2>
          <p>Medicamentos cadastrados</p>
        </article>

        <article class="cartao-resumo medicamentos-tomados">
          <div class="icone-resumo">
            <span class="material-icons">check_circle</span>
          </div>

          <h2>{{ resumo.tomados }}</h2>
          <p>Doses tomadas hoje</p>
        </article>

        <article class="cartao-resumo medicamentos-pendentes">
          <div class="icone-resumo">
            <span class="material-icons">schedule</span>
          </div>

          <h2>{{ resumo.pendentes }}</h2>
          <p>Doses pendentes hoje</p>
        </article>

        <article class="cartao-resumo medicamentos-atrasados">
          <div class="icone-resumo">
            <span class="material-icons">access_time</span>
          </div>

          <h2>{{ resumo.atrasados }}</h2>
          <p>Doses atrasadas hoje</p>
        </article>
      </section>

      <!-- Conteúdo inferior -->
      <section class="conteudo-inicio">
        <article class="cartao-proximo-medicamento">
          <h2>Próxima dose de hoje</h2>

          <div
            v-if="proximoMedicamento"
            class="informacoes-proximo-medicamento"
          >
            <div class="icone-medicamento">
              <span class="material-icons">medication</span>
            </div>

            <div class="detalhes-medicamento">
              <h3>{{ proximoMedicamento.nome }}</h3>
              <p>{{ proximoMedicamento.quantidade }}</p>

              <div class="tempo-medicamento">
                <span class="material-icons">schedule</span>
                <p>Pendente</p>
              </div>
            </div>

            <div class="horario-medicamento">
              <strong>{{ proximoMedicamento.horario }}</strong>
            </div>
          </div>

          <p v-else-if="!medicamentos.length">
            Nenhum medicamento cadastrado.
          </p>

          <p v-else-if="!resumo.total">
            Nenhuma dose prevista para hoje.
          </p>

          <p v-else>
            Nenhuma dose pendente para hoje.
          </p>

          <RouterLink to="/hoje" class="botao-ver-hoje">
            Ver todos de hoje
            <span class="material-icons">arrow_forward</span>
          </RouterLink>
        </article>

        <article class="cartao-mensagem-saude">
          <blockquote>
            "Cuidar da sua saúde hoje é investir em um amanhã melhor."
          </blockquote>

          <div class="decoracao-mensagem">
            <span class="material-icons">spa</span>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

import AppSidebar from '../components/shared/AppSidebar.vue'

import { buscarMedicamentos } from '../services/medicineStorage'

import {
  listarOcorrenciasDoDia,
  contarResumo,
  obterProximaOcorrencia,
  obterDataHoje
} from '../services/scheduleService'

const medicamentos = ref([])
const agora = ref(new Date())
let temporizador

const dataAtual = computed(() =>
  agora.value.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
)

const medicamentosDoDia = computed(() =>
  listarOcorrenciasDoDia(
    medicamentos.value,
    obterDataHoje(agora.value),
    agora.value
  )
)

const resumo = computed(() =>
  contarResumo(medicamentosDoDia.value)
)

const proximoMedicamento = computed(() =>
  obterProximaOcorrencia(
    medicamentosDoDia.value.filter(
      dose => dose.status === 'pendente'
    )
  )
)

function atualizarRelogio() {
  agora.value = new Date()
}

onMounted(() => {
  medicamentos.value = buscarMedicamentos()
  atualizarRelogio()
  temporizador = setInterval(atualizarRelogio, 1000)
})

onUnmounted(() => {
  clearInterval(temporizador)
})
</script>

<style src="../assets/styles/home.css"></style>
