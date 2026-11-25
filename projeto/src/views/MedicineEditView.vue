
<template>
  <main>
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

function salvarEdicao() {
  if (!medicamentoOriginal) return

  if (dataTermino.value < dataInicio.value) {
    alert('A data de término não pode ser anterior à data de início.')
    return
  }

  if (Number(intervalo.value) <= 0) {
    alert('O intervalo deve ser maior que zero.')
    return
  }

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

  const novasOcorrencias = recalcularOcorrencias(
    medicamentoOriginal.ocorrencias || [],
    novaConfiguracao
  )

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