
<template>
  <div class="painel">
    <AppSidebar />

    <main class="inicio">
      <div class="pagina-historico">
        <header class="cabecalho-historico">
          <span class="subtitulo-historico">ACOMPANHAMENTO</span>
          <h1>Histórico</h1>
          <p>Doses programadas para dias anteriores a hoje.</p>
        </header>

        <!-- FILTROS -->
        <section class="filtros-historico">
          <div class="campo-filtro">
            <label for="filtroMedicamento">Medicamento</label>

            <select
              id="filtroMedicamento"
              v-model="filtroMedicamento"
            >
              <option value="">Todos os medicamentos</option>

              <option
                v-for="medicamento in medicamentos"
                :key="medicamento.id"
                :value="String(medicamento.id)"
              >
                {{ medicamento.nome }}
              </option>
            </select>
          </div>

          <div class="campo-filtro">
            <label for="filtroStatus">Situação</label>

            <select
              id="filtroStatus"
              v-model="filtroStatus"
            >
              <option value="">Todas as situações</option>
              <option value="tomado">Tomado</option>
              <option value="atrasado">Atrasado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>

          <div class="campo-filtro">
            <label for="dataInicial">Data inicial</label>

            <input
              id="dataInicial"
              v-model="dataInicial"
              type="date"
              :max="hoje"
            />
          </div>

          <div class="campo-filtro">
            <label for="dataFinal">Data final</label>

            <input
              id="dataFinal"
              v-model="dataFinal"
              type="date"
              :max="hoje"
            />
          </div>

          <button
            type="button"
            class="btn-limpar-filtros"
            @click="limparFiltros"
          >
            Limpar filtros
          </button>
        </section>

        <p
          v-if="periodoInvalido"
          class="aviso-filtro"
        >
          A data inicial não pode ser posterior à data final.
        </p>

        <p
          v-else
          class="contador-historico"
        >
          {{ quantidadeRegistros }}
          {{ quantidadeRegistros === 1
            ? 'registro encontrado'
            : 'registros encontrados' }}
        </p>

        <!-- HISTÓRICO -->
        <section
          v-if="historicoFiltrado.length"
          class="lista-historico"
        >
          <article
            v-for="grupo in historicoFiltrado"
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

        <!-- ESTADO VAZIO -->
        <section
          v-else
          class="estado-vazio-historico"
        >
          <div class="icone-vazio-historico">
            <span class="material-icons">history</span>
          </div>

          <h2>
            {{ historico.length
              ? 'Nenhum resultado encontrado'
              : 'Nenhum registro encontrado' }}
          </h2>

          <p>
            {{ historico.length
              ? 'Tente alterar ou limpar os filtros.'
              : 'As doses de dias anteriores aparecerão aqui.' }}
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import AppSidebar from '../components/shared/AppSidebar.vue'

import { buscarMedicamentos } from '../services/medicineStorage'
import {
  listarHistorico,
  obterDataHoje
} from '../services/scheduleService'

const medicamentos = ref([])
const historico = ref([])

const filtroMedicamento = ref('')
const filtroStatus = ref('')
const dataInicial = ref('')
const dataFinal = ref('')

const hoje = obterDataHoje()

const registrosFiltrados = computed(() => {
  if (periodoInvalido.value) {
    return []
  }

  return historico.value.flatMap(grupo => {
    return grupo.medicamentos.filter(registro => {
      const medicamentoCorresponde =
        !filtroMedicamento.value ||
        String(registro.medicamentoId) === filtroMedicamento.value

      const statusCorresponde =
        !filtroStatus.value ||
        registro.status === filtroStatus.value

      const dataCorresponde =
        (!dataInicial.value || registro.data >= dataInicial.value) &&
        (!dataFinal.value || registro.data <= dataFinal.value)

      return (
        medicamentoCorresponde &&
        statusCorresponde &&
        dataCorresponde
      )
    })
  })
})

const periodoInvalido = computed(() => {
  return Boolean(
    dataInicial.value &&
    dataFinal.value &&
    dataInicial.value > dataFinal.value
  )
})

const quantidadeRegistros = computed(() => {
  return registrosFiltrados.value.length
})

const historicoFiltrado = computed(() => {
  const grupos = {}

  for (const registro of registrosFiltrados.value) {
    if (!grupos[registro.data]) {
      grupos[registro.data] = []
    }

    grupos[registro.data].push(registro)
  }

  return Object.keys(grupos)
    .sort((a, b) => b.localeCompare(a))
    .map(data => ({
      data,
      medicamentos: grupos[data].sort(
        (a, b) => a.horario.localeCompare(b.horario)
      )
    }))
})

function carregarHistorico() {
  medicamentos.value = buscarMedicamentos()

  historico.value = listarHistorico(medicamentos.value)
}

function limparFiltros() {
  filtroMedicamento.value = ''
  filtroStatus.value = ''
  dataInicial.value = ''
  dataFinal.value = ''
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

<style src="../assets/styles/history.css"></style>

<style scoped>
.filtros-historico {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  background: #ffffff;
  border: 1px solid #e2e8e5;
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 18px;
  box-shadow: 0 4px 14px rgba(15, 45, 30, 0.04);
}

.campo-filtro {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.campo-filtro label {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 600;
}

.campo-filtro input,
.campo-filtro select {
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid #dce5df;
  border-radius: 10px;
  background: #ffffff;
  color: #334155;
  outline: none;
  font: inherit;
}

.campo-filtro input:focus,
.campo-filtro select:focus {
  border-color: #20835a;
  box-shadow: 0 0 0 3px rgba(32, 131, 90, 0.12);
}

.btn-limpar-filtros {
  grid-column: 1 / -1;
  justify-self: start;
  padding: 10px 18px;
  background: #f1f5f3;
  color: #334155;
  border: 1px solid #dce5df;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-limpar-filtros:hover {
  background: #e4ece7;
}

.contador-historico {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 22px;
}

.aviso-filtro {
  color: #bd4238;
  font-size: 0.9rem;
  margin-bottom: 22px;
}

@media (max-width: 600px) {
  .filtros-historico {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .btn-limpar-filtros {
    width: 100%;
  }
}
</style>
