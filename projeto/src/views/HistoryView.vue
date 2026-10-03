<template>
  <main>
    <h1>Histórico</h1>

    <p>Registros dos medicamentos</p>

    <section v-if="historico.length">

      <article
        v-for="grupo in historico"
        :key="grupo.data"
      >
        <h2>{{ formatarData(grupo.data) }}</h2>

        <div
          v-for="medicamento in grupo.medicamentos"
          :key="medicamento.id"
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
            {{ medicamento.status === 'tomado' ? 'Tomado' : 'Pendente' }}
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

const historico = ref([])

function carregarHistorico() {
    const medicamentos = buscarMedicamentos()

    const grupos = {}

    medicamentos.forEach(medicamento => {
        const data = medicamento.dataInicio

        if (!grupos[data]) {
            grupos[data] = []
        }

        grupos[data].push(medicamento)
    })

    historico.value = Object.keys(grupos)
        .sort((a, b) => b.localeCompare(a))
        .map(data => ({
            data,
            medicamentos: grupos[data]
        }))
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

onMounted(() => {
    carregarHistorico()
})
</script>