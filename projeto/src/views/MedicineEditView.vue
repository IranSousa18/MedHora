
<template>
  <main class="formulario-medicamento">
    <h1>Editar medicamento</h1>

    <p v-if="carregando">Carregando medicamento...</p>

    <form v-else @submit.prevent="salvarEdicao">
      <div>
        <label for="nome">Nome do medicamento *</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          required
        >
      </div>

      <div>
        <label for="quantidade">Quantidade *</label>
        <input
          id="quantidade"
          v-model="quantidade"
          type="text"
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

      <button type="submit">Salvar alterações</button>
      <button type="button" @click="voltar">Cancelar</button>
    </form>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  buscarMedicamentoPorId,
  atualizarMedicamento
} from '../services/medicineStorage'

import {
  gerarOcorrencias,
  recalcularOcorrencias
} from '../services/scheduleService'

const route = useRoute()
const router = useRouter()

const carregando = ref(true)

const nome = ref('')
const quantidade = ref('')
const horario = ref('')
const intervalo = ref(8)
const unidadeIntervalo = ref('horas')
const dataInicio = ref('')
const dataTermino = ref('')
const observacao = ref('')

let medicamentoOriginal = null

onMounted(() => {
  carregarMedicamento()
})

function carregarMedicamento() {
  medicamentoOriginal = buscarMedicamentoPorId(route.params.id)

  if (!medicamentoOriginal) {
    alert('Medicamento não encontrado.')
    router.push('/medicamentos')
    return
  }

  nome.value = medicamentoOriginal.nome || ''
  quantidade.value = medicamentoOriginal.quantidade || ''
  horario.value = medicamentoOriginal.horario || ''
  intervalo.value = medicamentoOriginal.intervalo || 8
  unidadeIntervalo.value = medicamentoOriginal.unidadeIntervalo || 'horas'
  dataInicio.value = medicamentoOriginal.dataInicio || ''
  dataTermino.value = medicamentoOriginal.dataTermino || ''
  observacao.value = medicamentoOriginal.observacao || ''

  carregando.value = false
}

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

function salvarEdicao() {
  if (!medicamentoOriginal || !validarFormulario()) return

  const novaConfiguracao = {
    nome: nome.value.trim(),
    quantidade: quantidade.value.trim(),
    horario: horario.value,
    intervalo: Number(intervalo.value),
    unidadeIntervalo: unidadeIntervalo.value,
    dataInicio: dataInicio.value,
    dataTermino: dataTermino.value,
    observacao: observacao.value.trim()
  }

  // Validar a nova programação antes de alterar os dados existentes.
  let geradas

  try {
    geradas = gerarOcorrencias(novaConfiguracao)
  } catch (erro) {
    alert(
      erro.code === 'LIMITE_OCORRENCIAS'
        ? 'O tratamento ultrapassa o limite de doses permitido.'
        : 'Não foi possível gerar as doses do medicamento.'
    )
    return
  }

  if (!geradas.length) {
    alert(
      'Não foi possível gerar as doses. Verifique as datas e o intervalo informado.'
    )
    return
  }

  let novasOcorrencias

  try {
    novasOcorrencias = recalcularOcorrencias(
      medicamentoOriginal.ocorrencias || [],
      novaConfiguracao
    )
  } catch (erro) {
    alert(
      erro.code === 'LIMITE_OCORRENCIAS'
        ? 'O tratamento ultrapassa o limite de doses permitido.'
        : 'Não foi possível recalcular as doses.'
    )
    return
  }

  const resultado = atualizarMedicamento(
    medicamentoOriginal.id,
    {
      ...novaConfiguracao,
      ocorrencias: novasOcorrencias
    }
  )

  if (!resultado) {
    alert('Não foi possível salvar as alterações.')
    return
  }

  alert('Medicamento atualizado com sucesso!')
  router.push('/medicamentos')
}

function voltar() {
  router.push('/medicamentos')
}
</script>

<style src="../assets/styles/medicines.css"></style>
