```vue
<template>
  <div class="painel">
    <AppSidebar />

    <main class="inicio">
      <div class="medicamentos-container">
        <header class="medicamentos-header">
          <div>
            <h1>Meus medicamentos</h1>
            <p>Gerencie seus medicamentos cadastrados.</p>
          </div>

          <button
            type="button"
            class="btn-novo"
            @click="irParaCadastro"
          >
            + Novo medicamento
          </button>
        </header>

        <div class="barra-busca">
          <input
            v-model="busca"
            type="search"
            placeholder="Buscar medicamento pelo nome..."
            aria-label="Buscar medicamento"
          />
        </div>

        <p class="contador">
          {{ medicamentosFiltrados.length }}
          {{ medicamentosFiltrados.length === 1
            ? 'medicamento encontrado'
            : 'medicamentos encontrados' }}
        </p>

        <section
          v-if="medicamentosFiltrados.length"
          class="lista-medicamentos"
        >
          <article
            v-for="medicamento in medicamentosFiltrados"
            :key="medicamento.id"
            class="cartao-medicamento"
          >
            <div class="cartao-topo">
              <div>
                <h2>{{ medicamento.nome }}</h2>

                <p class="quantidade">
                  {{ medicamento.quantidade }}
                </p>
              </div>

              <div class="acoes-medicamento">
                <button
                  type="button"
                  class="btn-editar"
                  @click="editarMedicamento(medicamento.id)"
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="btn-excluir"
                  @click="excluirMedicamento(medicamento)"
                >
                  Excluir
                </button>
              </div>
            </div>

            <div class="detalhes">
              <p>
                <strong>Primeiro horário:</strong>
                {{ medicamento.horario || '--:--' }}
              </p>

              <p>
                <strong>Intervalo:</strong>
                {{ medicamento.intervalo }}
                {{ medicamento.unidadeIntervalo || 'horas' }}
              </p>

              <p>
                <strong>Período:</strong>
                {{ formatarData(medicamento.dataInicio) }}
                até
                {{ formatarData(medicamento.dataTermino) }}
              </p>

              <p v-if="medicamento.observacao">
                <strong>Observação:</strong>
                {{ medicamento.observacao }}
              </p>
            </div>

            <div class="cartao-rodape">
              <span class="badge-doses">
                {{ (medicamento.ocorrencias || []).length }}
                doses programadas
              </span>
            </div>
          </article>
        </section>

        <section
          v-else-if="medicamentos.length === 0"
          class="estado-vazio"
        >
          <h2>Nenhum medicamento cadastrado</h2>
          <p>Cadastre seu primeiro medicamento para começar.</p>
        </section>

        <section
          v-else
          class="estado-vazio"
        >
          <h2>Nenhum resultado encontrado</h2>
          <p>Não encontramos medicamentos com esse nome.</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppSidebar from '../components/shared/AppSidebar.vue'

import {
  buscarMedicamentos,
  removerMedicamento
} from '../services/medicineStorage'

const router = useRouter()

const medicamentos = ref([])
const busca = ref('')

const medicamentosFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()

  if (!termo) {
    return medicamentos.value
  }

  return medicamentos.value.filter(medicamento =>
    String(medicamento.nome || '')
      .toLowerCase()
      .includes(termo)
  )
})

function carregarMedicamentos() {
  medicamentos.value = buscarMedicamentos()
}

function irParaCadastro() {
  router.push('/medicamentos/novo')
}

function editarMedicamento(id) {
  router.push(`/medicamentos/${id}/editar`)
}

function excluirMedicamento(medicamento) {
  const confirmar = window.confirm(
    `Tem certeza de que deseja excluir "${medicamento.nome}"?\n\n` +
    'Todas as doses e os registros de histórico desse medicamento também serão apagados.\n\n' +
    'Essa ação não pode ser desfeita.'
  )

  if (!confirmar) {
    return
  }

  const sucesso = removerMedicamento(medicamento.id)

  if (!sucesso) {
    alert(
      'Não foi possível excluir o medicamento. Atualize a página e tente novamente.'
    )
    return
  }

  carregarMedicamentos()
}

function formatarData(data) {
  if (!data) return '--/--/----'

  const [ano, mes, dia] = data.split('-')

  if (!ano || !mes || !dia) return data

  return `${dia}/${mes}/${ano}`
}

onMounted(() => {
  carregarMedicamentos()
})
</script>

<style src="../assets/styles/medicines.css"></style>

<style scoped>
.acoes-medicamento {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-excluir {
  padding: 9px 16px;
  background: #fff1f1;
  color: #c03939;
  border: 1px solid #f0caca;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-excluir:hover {
  background: #fce0e0;
}

@media (max-width: 600px) {
  .acoes-medicamento {
    width: 100%;
  }

  .acoes-medicamento button {
    flex: 1;
  }
}
</style>
```