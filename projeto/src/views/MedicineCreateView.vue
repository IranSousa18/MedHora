
<template>
  <div class="painel">
    <AppSidebar />

    <main class="inicio">
      <div class="formulario-medicamento">
        <h1>Cadastrar medicamento</h1>

        <form @submit.prevent="cadastrarMedicamento">
          <div>
            <label for="nome">Nome do medicamento *</label>
            <input
              id="nome"
              v-model="nome"
              type="text"
              placeholder="Ex: Dipirona"
              required
            >
          </div>

          <div>
            <label for="quantidade">Quantidade *</label>
            <input
              id="quantidade"
              v-model="quantidade"
              type="text"
              placeholder="Ex: 1 comprimido"
              required
            >
          </div>

          <div>
            <label for="horario">Primeiro horário *</label>
            <input
              id="horario"
              v-model="horario"
              type="time"
              required
            >
          </div>

          <div>
            <label for="intervalo">Tomar a cada *</label>

            <input
              id="intervalo"
              v-model.number="intervalo"
              type="number"
              min="1"
              required
            >

            <select v-model="unidadeIntervalo">
              <option value="horas">horas</option>
              <option value="dias">dias</option>
            </select>
          </div>

          <div>
            <label for="dataInicio">Data de início *</label>
            <input
              id="dataInicio"
              v-model="dataInicio"
              type="date"
              required
            >
          </div>

          <div>
            <label for="dataTermino">Data de término *</label>
            <input
              id="dataTermino"
              v-model="dataTermino"
              type="date"
              required
            >
          </div>

          <div>
            <label for="observacao">Observação</label>
            <textarea
              id="observacao"
              v-model="observacao"
              placeholder="Ex: Após alimentação"
            ></textarea>
          </div>

          <button type="submit">
            Salvar medicamento
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppSidebar from '../components/shared/AppSidebar.vue'
import { adicionarMedicamento } from '../services/medicineStorage'
import { gerarOcorrencias } from '../services/scheduleService'

const router = useRouter()

const nome = ref('')
const quantidade = ref('')
const horario = ref('')
const intervalo = ref(8)
const unidadeIntervalo = ref('horas')
const dataInicio = ref('')
const dataTermino = ref('')
const observacao = ref('')

function validarFormulario() {
  if (!nome.value.trim() || !quantidade.value.trim()) {
    alert('Nome e quantidade são obrigatórios.')
    return false
  }

  if (!horario.value || !dataInicio.value || !dataTermino.value) {
    alert('Preencha todos os campos obrigatórios.')
    return false
  }

  if (dataTermino.value < dataInicio.value) {
    alert('A data de término não pode ser anterior à data de início.')
    return false
  }

  if (
    !Number.isFinite(Number(intervalo.value)) ||
    Number(intervalo.value) <= 0
  ) {
    alert('O intervalo deve ser um número válido maior que zero.')
    return false
  }

  if (!['horas', 'dias'].includes(unidadeIntervalo.value)) {
    alert('Selecione uma unidade de intervalo válida.')
    return false
  }

  return true
}

function cadastrarMedicamento() {
  if (!validarFormulario()) return

  let ocorrencias

  try {
    ocorrencias = gerarOcorrencias({
      dataInicio: dataInicio.value,
      dataTermino: dataTermino.value,
      horario: horario.value,
      intervalo: Number(intervalo.value),
      unidadeIntervalo: unidadeIntervalo.value
    })
  } catch (erro) {
    alert(
      erro.code === 'LIMITE_OCORRENCIAS'
        ? 'O tratamento ultrapassa o limite de doses permitido.'
        : 'Não foi possível gerar as doses do medicamento.'
    )
    return
  }

  if (!ocorrencias.length) {
    alert(
      'Não foi possível gerar as doses. Verifique as datas e o intervalo informado.'
    )
    return
  }

  const resultado = adicionarMedicamento({
    nome: nome.value.trim(),
    quantidade: quantidade.value.trim(),
    horario: horario.value,
    intervalo: Number(intervalo.value),
    unidadeIntervalo: unidadeIntervalo.value,
    dataInicio: dataInicio.value,
    dataTermino: dataTermino.value,
    observacao: observacao.value.trim(),
    ocorrencias
  })

  if (!resultado) {
    alert('Não foi possível salvar o medicamento.')
    return
  }

  alert('Medicamento salvo com sucesso!')

  router.push('/hoje')
}
</script>

<style src="../assets/styles/medicines.css"></style>
