<template>
  <div class="painel">

    <!-- BARRA LATERAL -->
    <aside class="barra-lateral">

      <!-- Logo -->
      <div class="cabecalho-barra-lateral">

        <div class="icone-logo">
          <span class="material-icons">medication</span>
        </div>

        <div class="texto-logo">
          <h1>MedHora</h1>
          <p>Sua saúde em dia</p>
        </div>

      </div>


      <!-- Navegação -->
      <nav class="menu-lateral">

        <a href="#" class="item-menu ativo">
          <span class="material-icons">home</span>
          <span>Início</span>
        </a>

        <a href="#" class="item-menu">
          <span class="material-icons">calendar_today</span>
          <span>Hoje</span>
        </a>

        <a href="#" class="item-menu">
          <span class="material-icons">format_list_bulleted</span>
          <span>Medicamentos</span>
        </a>

        <a href="#" class="item-menu">
          <span class="material-icons">history</span>
          <span>Histórico</span>
        </a>

      </nav>


      <!-- Parte inferior da barra lateral -->
      <div class="rodape-barra-lateral">

        <a href="#" class="item-menu">
          <span class="material-icons">settings</span>
          <span>Configurações</span>
        </a>

      </div>

    </aside>


    <!-- CONTEÚDO PRINCIPAL -->
    <main class="inicio">

      <!-- Cabeçalho da Home -->
      <header class="cabecalho-inicio">

        <div class="boas-vindas">
          <h1>Olá!</h1>
          <p>Aqui está um resumo do seu dia.</p>
        </div>

        <div class="data-atual">
          <span class="material-icons">calendar_today</span>
          <p>Terça-feira, 16 de setembro de 2026</p>
        </div>

      </header>


      <!-- RESUMO DO DIA -->
      <section class="resumo-dia">

        <!-- Medicamentos hoje -->
        <article class="cartao-resumo medicamentos-hoje">

          <div class="icone-resumo">
            <span class="material-icons">medication</span>
          </div>

          <h2>3</h2>
          <p>Medicamentos hoje</p>

        </article>


        <!-- Já tomado -->
        <article class="cartao-resumo medicamentos-tomados">

          <div class="icone-resumo">
            <span class="material-icons">check_circle</span>
          </div>

          <h2>1</h2>
          <p>Já tomado</p>

        </article>


        <!-- Pendentes -->
        <article class="cartao-resumo medicamentos-pendentes">

          <div class="icone-resumo">
            <span class="material-icons">schedule</span>
          </div>

          <h2>2</h2>
          <p>Pendentes</p>

        </article>


        <!-- Atrasados -->
        <article class="cartao-resumo medicamentos-atrasados">

          <div class="icone-resumo">
            <span class="material-icons">access_time</span>
          </div>

          <h2>0</h2>
          <p>Atrasados</p>

        </article>

      </section>


      <!-- CONTEÚDO INFERIOR -->
      <section class="conteudo-inicio">

        <!-- Próximo medicamento -->
        <article class="cartao-proximo-medicamento">

          <h2>Próximo medicamento</h2>

          <div class="informacoes-proximo-medicamento">

            <div class="icone-medicamento">
              <span class="material-icons">medication</span>
            </div>

            <div class="detalhes-medicamento">

              <h3>Dipirona</h3>
              <p>1 comprimido</p>

              <div class="tempo-medicamento">
                <span class="material-icons">schedule</span>
                <p>Em 2 horas</p>
              </div>

            </div>

            <div class="horario-medicamento">
              <strong>16:00</strong>
            </div>

          </div>


          <button type="button" class="botao-ver-hoje">
            Ver todos de hoje
            <span class="material-icons">arrow_forward</span>
          </button>

        </article>


        <!-- Mensagem motivacional -->
        <article class="cartao-mensagem-saude">

          <blockquote>
            "Cuidar da sua saúde hoje é investir em um amanhã melhor."
          </blockquote>

          <div class="decoracao-mensagem">
            <span class="material-icons">spa</span>
          </div>

        </article>

      </section>

    </main>

  </div>
</template>


<script setup>
</script>


<style src="../assets/styles/home.css"></style>