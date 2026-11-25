
<template>
  <main>
    <h1>Histórico</h1>
    <p>Registro dos medicamentos anteriores</p>

    <section v-if="historico.length">
      <article
        v-for="grupo in historico"
        :key="grupo.data"
      >
        <h2>{{ formatarData(grupo.data) }}</h2>

        <div
          v-for="medicamento in grupo.medicamentos"
          :key="`${medicamento.medicamentoId}-${medicamento.ocorrenciaId}`"
        >
          <p>
            <strong>{{ medicamento.horario }}</strong>
            -
            {{ medicamento.nome }}
            -
            {{ medicamento.quantidade }}
          </p>

          <p v-if="medicamento.observacao">
            Observação: {{ medicamento.observacao }}
          </p>

          <strong>
            {{ formatarStatus(medicamento.status) }}
          </strong>
        </div>
      </article>
    </section>

    <p v-else>
      Nenhum registro encontrado.
    </p>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { buscarMedicamentos } from '../services/medicineStorage'
import { listarHistorico } from '../services/scheduleService'

const historico = ref([])

function carregarHistorico() {
  const medicamentos = buscarMedicamentos()

  historico.value = listarHistorico(medicamentos)
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')

  const dataFormatada = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia)
  )

  return dataFormatada.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatarStatus(status) {
  if (status === 'tomado') return 'Tomado'
  if (status === 'atrasado') return 'Atrasado'
  return 'Pendente'
}

onMounted(() => {
  carregarHistorico()
})
</script>
