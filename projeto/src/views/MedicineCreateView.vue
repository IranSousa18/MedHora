<template>
  <main>
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
        <label for="dataTermino">Data de término</label>
        <input
          id="dataTermino"
          v-model="dataTermino"
          type="date"
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
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adicionarMedicamento } from '../services/medicineStorage'

const router = useRouter()

const nome = ref('')
const quantidade = ref('')
const horario = ref('')
const intervalo = ref(8)
const unidadeIntervalo = ref('horas')
const dataInicio = ref('')
const dataTermino = ref('')
const observacao = ref('')

function cadastrarMedicamento() {
    adicionarMedicamento({
        nome: nome.value,
        quantidade: quantidade.value,
        horario: horario.value,
        intervalo: intervalo.value,
        unidadeIntervalo: unidadeIntervalo.value,
        dataInicio: dataInicio.value,
        dataTermino: dataTermino.value,
        observacao: observacao.value,
        status: 'pendente'
    })

    alert('Medicamento salvo com sucesso!')

    router.push('/hoje')
}
</script>