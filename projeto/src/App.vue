<script setup>
import { ref, computed } from 'vue'

const activePage = ref('inicio')

const pages = [
  { id: 'inicio', label: 'Início' },
  { id: 'hoje', label: 'Hoje' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'historico', label: 'Histórico' },
  { id: 'configuracoes', label: 'Configurações' }
]

const pageTitles = {
  inicio: 'Início',
  hoje: 'Hoje',
  medicamentos: 'Medicamentos',
  historico: 'Histórico',
  configuracoes: 'Configurações'
}

function navigateTo(page) {
  activePage.value = page
}

/*
  Os dados começam vazios.
  Posteriormente, serão conectados ao armazenamento
  e às funcionalidades desenvolvidas pelo grupo.
*/

const medicamentos = ref([])
const doses = ref([])
const historico = ref([])

const resumo = computed(() => ({
  medicamentos: medicamentos.value.length,
  tomados: doses.value.filter(dose => dose.status === 'Tomado').length,
  pendentes: doses.value.filter(dose => dose.status === 'Pendente').length,
  atrasados: doses.value.filter(dose => dose.status === 'Atrasado').length
}))
</script>

<template>
  <div class="app-layout">

    <!-- MENU LATERAL -->
    <aside class="sidebar">

      <div class="sidebar-brand">
        MEDHORA
      </div>

      <nav class="sidebar-nav" aria-label="Menu principal">

        <button
          v-for="page in pages"
          :key="page.id"
          type="button"
          class="sidebar-link"
          :class="{ active: activePage === page.id }"
          :aria-current="activePage === page.id ? 'page' : undefined"
          @click="navigateTo(page.id)"
        >
          {{ page.label }}
        </button>

      </nav>

    </aside>

    <!-- ÁREA PRINCIPAL -->
    <div class="main-area">

      <!-- CABEÇALHO -->
      <header class="topbar">
        <span class="topbar-description">
          Organização da rotina medicamentosa
        </span>
      </header>

      <!-- CONTEÚDO DAS PÁGINAS -->
      <main class="page-content">

        <!-- =================================
             PÁGINA INICIAL
        ================================== -->
        <section v-if="activePage === 'inicio'">

          <div class="page-header">
            <h1>Início</h1>
            <p>
              Acompanhe sua rotina de medicamentos.
            </p>
          </div>

          <!-- INDICADORES -->
          <div class="summary-grid">

            <article class="summary-card">
              <div class="summary-card-header">
                <span class="summary-label">Medicamentos</span>
                <span class="summary-indicator indicator-info"></span>
              </div>

              <strong class="summary-value">
                {{ resumo.medicamentos }}
              </strong>

              <p>Medicamentos cadastrados</p>
            </article>

            <article class="summary-card">
              <div class="summary-card-header">
                <span class="summary-label">Tomados</span>
                <span class="summary-indicator indicator-success"></span>
              </div>

              <strong class="summary-value">
                {{ resumo.tomados }}
              </strong>

              <p>Doses confirmadas</p>
            </article>

            <article class="summary-card">
              <div class="summary-card-header">
                <span class="summary-label">Pendentes</span>
                <span class="summary-indicator indicator-warning"></span>
              </div>

              <strong class="summary-value">
                {{ resumo.pendentes }}
              </strong>

              <p>Doses aguardando confirmação</p>
            </article>

            <article class="summary-card">
              <div class="summary-card-header">
                <span class="summary-label">Atrasados</span>
                <span class="summary-indicator indicator-danger"></span>
              </div>

              <strong class="summary-value">
                {{ resumo.atrasados }}
              </strong>

              <p>Doses atrasadas</p>
            </article>

          </div>

          <!-- PRÓXIMO HORÁRIO -->
          <section class="card dashboard-section">

            <div class="section-heading">
              <div>
                <h2 class="card-title">Próximo horário</h2>
                <p class="card-description">
                  Consulte o próximo medicamento da sua rotina.
                </p>
              </div>
            </div>

            <div v-if="medicamentos.length === 0" class="empty-state">
              <h3>Nenhum medicamento cadastrado</h3>

              <p>
                Cadastre seus medicamentos para organizar
                os horários da sua rotina.
              </p>

              <button
                type="button"
                class="btn btn-primary"
                @click="navigateTo('medicamentos')"
              >
                Ir para medicamentos
              </button>
            </div>

            <div v-else class="empty-state">
              <p>
                A organização dos próximos horários será exibida
                aqui quando a programação das doses estiver integrada.
              </p>
            </div>

          </section>

          <!-- RESUMO DO DIA -->
          <section class="card dashboard-section">

            <div class="section-heading">
              <div>
                <h2 class="card-title">Resumo do dia</h2>
                <p class="card-description">
                  Acompanhe as doses previstas para hoje.
                </p>
              </div>

              <button
                type="button"
                class="btn btn-secondary"
                @click="navigateTo('hoje')"
              >
                Consultar rotina
              </button>
            </div>

            <div v-if="doses.length === 0" class="empty-state">
              <h3>Nenhuma dose disponível</h3>

              <p>
                As doses programadas e suas situações
                aparecerão nesta área.
              </p>
            </div>

          </section>

        </section>

        <!-- =================================
             PÁGINA HOJE
        ================================== -->
        <section v-else-if="activePage === 'hoje'">

          <div class="page-header">
            <h1>Hoje</h1>

            <p>
              Consulte e acompanhe as doses programadas para o dia.
            </p>
          </div>

          <section class="card">

            <div class="section-heading">
              <div>
                <h2 class="card-title">Doses do dia</h2>

                <p class="card-description">
                  Visualize os medicamentos, horários e situações.
                </p>
              </div>
            </div>

            <!-- SITUAÇÕES -->
            <div class="status-legend">
              <span class="status status-taken">Tomado</span>
              <span class="status status-pending">Pendente</span>
              <span class="status status-late">Atrasado</span>
            </div>

            <!-- LISTA DE DOSES -->
            <div v-if="doses.length === 0" class="empty-state">
              <h3>Nenhuma dose programada</h3>

              <p>
                Quando existirem doses cadastradas,
                elas serão apresentadas aqui.
              </p>

              <button
                type="button"
                class="btn btn-primary"
                @click="navigateTo('medicamentos')"
              >
                Consultar medicamentos
              </button>
            </div>

          </section>

        </section>

        <!-- =================================
             PÁGINA MEDICAMENTOS
        ================================== -->
        <section v-else-if="activePage === 'medicamentos'">

          <div class="page-header">
            <h1>Medicamentos</h1>

            <p>
              Consulte e gerencie os medicamentos da sua rotina.
            </p>
          </div>

          <section class="card">

            <div class="section-heading">
              <div>
                <h2 class="card-title">Meus medicamentos</h2>

                <p class="card-description">
                  Cadastro e gerenciamento dos medicamentos.
                </p>
              </div>
            </div>

            <div v-if="medicamentos.length === 0" class="empty-state">
              <h3>Nenhum medicamento cadastrado</h3>

              <p>
                Os medicamentos adicionados à sua rotina
                serão apresentados nesta área.
              </p>
            </div>

          </section>

        </section>

        <!-- =================================
             PÁGINA HISTÓRICO
        ================================== -->
        <section v-else-if="activePage === 'historico'">

          <div class="page-header">
            <h1>Histórico</h1>

            <p>
              Consulte os registros anteriores da sua rotina.
            </p>
          </div>

          <section class="card">

            <div class="section-heading">
              <div>
                <h2 class="card-title">Histórico de doses</h2>

                <p class="card-description">
                  Consulte as doses registradas e suas situações.
                </p>
              </div>
            </div>

            <div v-if="historico.length === 0" class="empty-state">
              <h3>Nenhum registro disponível</h3>

              <p>
                Os registros das doses aparecerão aqui
                conforme forem realizados.
              </p>
            </div>

          </section>

        </section>

        <!-- =================================
             PÁGINA CONFIGURAÇÕES
        ================================== -->
        <section v-else-if="activePage === 'configuracoes'">

          <div class="page-header">
            <h1>Configurações</h1>

            <p>
              Gerencie os dados da conta e as preferências.
            </p>
          </div>

          <section class="card">

            <div class="section-heading">
              <div>
                <h2 class="card-title">Conta e preferências</h2>

                <p class="card-description">
                  Área destinada às configurações do usuário.
                </p>
              </div>
            </div>

            <div class="empty-state">
              <h3>Configurações em desenvolvimento</h3>

              <p>
                Os campos desta área serão definidos após
                a confirmação das informações da conta.
              </p>
            </div>

          </section>

        </section>

      </main>

    </div>

  </div>
</template>
