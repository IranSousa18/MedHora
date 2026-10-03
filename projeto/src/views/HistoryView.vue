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
            {{
              medicamento.status === 'tomado'
                ? 'Tomado'
                : 'Pendente'
            }}
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

function obterDataHoje() {
  const hoje = new Date()

  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function carregarHistorico() {
  const medicamentos = buscarMedicamentos()
  const hoje = obterDataHoje()

  const grupos = {}

  medicamentos.forEach(medicamento => {
    if (!medicamento.ocorrencias) {
      return
    }

    medicamento.ocorrencias.forEach(ocorrencia => {
      // O histórico mostra somente dias anteriores a hoje.
      if (ocorrencia.data >= hoje) {
        return
      }

      if (!grupos[ocorrencia.data]) {
        grupos[ocorrencia.data] = []
      }

      grupos[ocorrencia.data].push({
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

  historico.value = Object.keys(grupos)
    .sort((a, b) => b.localeCompare(a))
    .map(data => ({
      data,
      medicamentos: grupos[data].sort((a, b) => {
        return a.horario.localeCompare(b.horario)
      })
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