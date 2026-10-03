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
            {{
              medicamento.status === 'tomado'
                ? 'Tomado'
                : 'Pendente'
            }}
          </strong>
        </p>

        <button
          v-if="medicamento.status === 'pendente'"
          type="button"
          @click="marcarComoTomado(medicamento)"
        >
          Marcar como tomado
        </button>

        <button
          v-else
          type="button"
          @click="marcarComoPendente(medicamento)"
        >
          Marcar como pendente
        </button>
      </article>
    </section>

    <p v-else>
      Nenhum medicamento encontrado para hoje.
    </p>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  buscarMedicamentos,
  atualizarOcorrencia
} from '../services/medicineStorage'

const medicamentos = ref([])
const filtro = ref('todos')

function obterDataHoje() {
  const hoje = new Date()

  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

const hoje = obterDataHoje()

const medicamentosDoDia = computed(() => {
  const ocorrenciasDoDia = []

  medicamentos.value.forEach(medicamento => {
    if (!medicamento.ocorrencias) {
      return
    }

    medicamento.ocorrencias.forEach(ocorrencia => {
      if (ocorrencia.data !== hoje) {
        return
      }

      ocorrenciasDoDia.push({
        medicamentoId: medicamento.id,
        ocorrenciaId: ocorrencia.id,
        nome: medicamento.nome,
        quantidade: medicamento.quantidade,
        horario: ocorrencia.horario,
        observacao: medicamento.observacao,
        status: ocorrencia.status
      })
    })
  })

  return ocorrenciasDoDia.sort((a, b) => {
    return a.horario.localeCompare(b.horario)
  })
})

const medicamentosPendentes = computed(() => {
  return medicamentosDoDia.value.filter(
    medicamento => medicamento.status === 'pendente'
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
}

function marcarComoTomado(medicamento) {
  atualizarOcorrencia(
    medicamento.medicamentoId,
    medicamento.ocorrenciaId,
    {
      status: 'tomado'
    }
  )

  carregarMedicamentos()
}

function marcarComoPendente(medicamento) {
  atualizarOcorrencia(
    medicamento.medicamentoId,
    medicamento.ocorrenciaId,
    {
      status: 'pendente'
    }
  )

  carregarMedicamentos()
}

onMounted(() => {
  carregarMedicamentos()
})
</script>