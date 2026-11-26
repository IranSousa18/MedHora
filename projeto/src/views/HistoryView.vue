
<template>
  <main class="pagina-historico">
    <header class="cabecalho-historico">
      <span class="subtitulo-historico">ACOMPANHAMENTO</span>
      <h1>Histórico</h1>
      <p>Doses programadas para dias anteriores a hoje.</p>
    </header>

    <section
      v-if="historico.length"
      class="lista-historico"
    >
      <article
        v-for="grupo in historico"
        :key="grupo.data"
        class="grupo-historico"
      >
        <header class="cabecalho-dia-historico">
          <div class="icone-dia-historico">
            <span class="material-icons">calendar_month</span>
          </div>

          <div>
            <h2>{{ formatarData(grupo.data) }}</h2>
            <p>
              {{ grupo.medicamentos.length }}
              {{ grupo.medicamentos.length === 1
                ? 'dose registrada'
                : 'doses registradas' }}
            </p>
          </div>
        </header>

        <div class="lista-registros-historico">
          <div
            v-for="medicamento in grupo.medicamentos"
            :key="`${medicamento.medicamentoId}-${medicamento.ocorrenciaId}`"
            class="registro-historico"
          >
            <div class="horario-historico">
              <span class="material-icons">schedule</span>
              <strong>{{ medicamento.horario }}</strong>
            </div>

            <div class="dados-registro-historico">
              <h3>{{ medicamento.nome }}</h3>

              <p class="quantidade-historico">
                {{ medicamento.quantidade }}
              </p>

              <p
                v-if="medicamento.observacao"
                class="observacao-historico"
              >
                <span class="material-icons">notes</span>
                {{ medicamento.observacao }}
              </p>
            </div>

            <span
              class="status-historico"
              :class="`status-historico-${medicamento.status}`"
            >
              {{ formatarStatus(medicamento.status) }}
            </span>
          </div>
        </div>
      </article>
    </section>

    <section
      v-else
      class="estado-vazio-historico"
    >
      <div class="icone-vazio-historico">
        <span class="material-icons">history</span>
      </div>

      <h2>Nenhum registro encontrado</h2>
      <p>As doses de dias anteriores aparecerão aqui.</p>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { buscarMedicamentos } from '../services/medicineStorage'
import { listarHistorico } from '../services/scheduleService'

const historico = ref([])

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
  historico.value = listarHistorico(buscarMedicamentos())
})
</script>

<style src="../assets/styles/history.css"></style>
