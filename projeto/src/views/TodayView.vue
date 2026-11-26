
<template>
  <main>
    <h1>Hoje</h1>
    <p>Medicamentos do dia</p>

    <nav>
      <button
        type="button"
        @click="filtro = 'todos'"
      >
        Todos ({{ medicamentosDoDia.length }})
      </button>

      <button
        type="button"
        @click="filtro = 'pendentes'"
      >
        Pendentes ({{ medicamentosPendentes.length }})
      </button>

      <button
        type="button"
        @click="filtro = 'tomados'"
      >
        Tomados ({{ medicamentosTomados.length }})
      </button>
    </nav>

    <section v-if="medicamentosFiltrados.length">
      <article
        v-for="medicamento in medicamentosFiltrados"
        :key="`${medicamento.medicamentoId}-${medicamento.ocorrenciaId}`"
      >
        <h2>{{ medicamento.nome }}</h2>

        <p>
          {{ medicamento.quantidade }}
        </p>

        <p>
          Horário: {{ medicamento.horario }}
        </p>

        <p v-if="medicamento.observacao">
          Observação: {{ medicamento.observacao }}
        </p>

        <p>
          Status:
          <strong>
            {{ formatarStatus(medicamento.status) }}
          </strong>
        </p>

        <button
          v-if="medicamento.status !== 'tomado'"
          type="button"
          @click="alterarStatus(medicamento, 'tomado')"
        >
          Marcar como tomado
        </button>

        <button
          v-else
          type="button"
          @click="alterarStatus(medicamento, 'pendente')"
        >
          Desfazer confirmação
        </button>
      </article>
    </section>

    <p v-else-if="!medicamentosDoDia.length">
      Nenhuma dose prevista para hoje.
    </p>

    <p v-else>
      Nenhuma dose neste filtro.
    </p>
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
