
<template>
  <main class="pagina-hoje">
    <header class="cabecalho-hoje">
      <div>
        <span class="subtitulo-hoje">ROTINA DE MEDICAÇÃO</span>
        <h1>Hoje</h1>
        <p>Confira seus medicamentos e acompanhe suas doses diárias.</p>
      </div>
    </header>

    <nav class="filtros-hoje">
      <button
        type="button"
        :class="{ ativo: filtro === 'todos' }"
        @click="filtro = 'todos'"
      >
        Todos
        <span class="numero-filtro">{{ medicamentosDoDia.length }}</span>
      </button>

      <button
        type="button"
        :class="{ ativo: filtro === 'pendentes' }"
        @click="filtro = 'pendentes'"
      >
        Pendentes
        <span class="numero-filtro">{{ medicamentosPendentes.length }}</span>
      </button>

      <button
        type="button"
        :class="{ ativo: filtro === 'tomados' }"
        @click="filtro = 'tomados'"
      >
        Tomados
        <span class="numero-filtro">{{ medicamentosTomados.length }}</span>
      </button>
    </nav>

    <section
      v-if="medicamentosFiltrados.length"
      class="lista-doses-hoje"
    >
      <article
        v-for="medicamento in medicamentosFiltrados"
        :key="`${medicamento.medicamentoId}-${medicamento.ocorrenciaId}`"
        class="cartao-dose"
        :class="`status-${medicamento.status}`"
      >
        <div class="cartao-dose-topo">
          <div class="identificacao-dose">
            <div class="icone-dose">
              <span class="material-icons">medication</span>
            </div>

            <div>
              <h2>{{ medicamento.nome }}</h2>
              <p class="dose-quantidade">
                {{ medicamento.quantidade }}
              </p>
            </div>
          </div>

          <span
            class="etiqueta-status"
            :class="`etiqueta-${medicamento.status}`"
          >
            {{ formatarStatus(medicamento.status) }}
          </span>
        </div>

        <div class="informacoes-dose">
          <div class="informacao-dose">
            <span class="material-icons">schedule</span>
            <div>
              <span class="rotulo-informacao">Horário</span>
              <strong>{{ medicamento.horario }}</strong>
            </div>
          </div>

          <div
            v-if="medicamento.observacao"
            class="informacao-dose"
          >
            <span class="material-icons">notes</span>
            <div>
              <span class="rotulo-informacao">Observação</span>
              <strong>{{ medicamento.observacao }}</strong>
            </div>
          </div>
        </div>

        <div class="acoes-dose">
          <button
            v-if="medicamento.status !== 'tomado'"
            type="button"
            class="botao-confirmar-dose"
            @click="alterarStatus(medicamento, 'tomado')"
          >
            <span class="material-icons">check_circle</span>
            Marcar como tomado
          </button>

          <button
            v-else
            type="button"
            class="botao-desfazer-dose"
            @click="alterarStatus(medicamento, 'pendente')"
          >
            <span class="material-icons">undo</span>
            Desfazer confirmação
          </button>
        </div>
      </article>
    </section>

    <section
      v-else-if="!medicamentosDoDia.length"
      class="estado-vazio-hoje"
    >
      <div class="icone-vazio-hoje">
        <span class="material-icons">event_available</span>
      </div>

      <h2>Nenhuma dose prevista</h2>
      <p>Você não possui medicamentos programados para hoje.</p>
    </section>

    <section
      v-else
      class="estado-vazio-hoje"
    >
      <div class="icone-vazio-hoje">
        <span class="material-icons">filter_list</span>
      </div>

      <h2>Nenhuma dose neste filtro</h2>
      <p>Não há medicamentos correspondentes à categoria selecionada.</p>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import {
  buscarMedicamentos,
  atualizarStatusOcorrencia
} from '../services/medicineStorage'

import {
  listarOcorrenciasDoDia,
  obterDataHoje
} from '../services/scheduleService'

const medicamentos = ref([])
const filtro = ref('todos')
const agora = ref(new Date())
let temporizador

const medicamentosDoDia = computed(() => {
  return listarOcorrenciasDoDia(
    medicamentos.value,
    obterDataHoje(agora.value),
    agora.value
  )
})

const medicamentosPendentes = computed(() => {
  return medicamentosDoDia.value.filter(
    medicamento =>
      medicamento.status === 'pendente' ||
      medicamento.status === 'atrasado'
  )
})

const medicamentosTomados = computed(() => {
  return medicamentosDoDia.value.filter(
    medicamento => medicamento.status === 'tomado'
  )
})

const medicamentosFiltrados = computed(() => {
  if (filtro.value === 'pendentes') {
    return medicamentosPendentes.value
  }

  if (filtro.value === 'tomados') {
    return medicamentosTomados.value
  }

  return medicamentosDoDia.value
})

function carregarMedicamentos() {
  medicamentos.value = buscarMedicamentos()
  atualizarRelogio()
}

function atualizarRelogio() {
  agora.value = new Date()
}

function alterarStatus(medicamento, status) {
  const resultado = atualizarStatusOcorrencia(
    medicamento.medicamentoId,
    medicamento.ocorrenciaId,
    status
  )

  if (!resultado) {
    alert('Não foi possível atualizar o status da dose.')
    return
  }

  carregarMedicamentos()
}

function formatarStatus(status) {
  if (status === 'tomado') {
    return 'Tomado'
  }

  if (status === 'atrasado') {
    return 'Atrasado'
  }

  return 'Pendente'
}

onMounted(() => {
  carregarMedicamentos()
  temporizador = setInterval(atualizarRelogio, 1000)
})

onUnmounted(() => {
  clearInterval(temporizador)
})
</script>

<style src="../assets/styles/today.css"></style>
