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

function gerarOcorrencias() {
    const ocorrencias = []

    const inicio = new Date(
        `${dataInicio.value}T${horario.value}`
    )

    const fim = new Date(
        `${dataTermino.value}T23:59:59`
    )

    let dataAtual = new Date(inicio)

    let intervaloEmHoras = intervalo.value

    if (unidadeIntervalo.value === 'dias') {
        intervaloEmHoras = intervalo.value * 24
    }

    while (dataAtual <= fim) {
        const ano = dataAtual.getFullYear()
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0')
        const dia = String(dataAtual.getDate()).padStart(2, '0')
        const hora = String(dataAtual.getHours()).padStart(2, '0')
        const minutos = String(dataAtual.getMinutes()).padStart(2, '0')

        ocorrencias.push({
            id: `${Date.now()}-${ocorrencias.length}`,
            data: `${ano}-${mes}-${dia}`,
            horario: `${hora}:${minutos}`,
            status: 'pendente'
        })

        dataAtual.setHours(
            dataAtual.getHours() + intervaloEmHoras
        )
    }

    return ocorrencias
}

function cadastrarMedicamento() {
    if (dataTermino.value < dataInicio.value) {
        alert(
            'A data de término não pode ser anterior à data de início.'
        )

        return
    }

    const ocorrencias = gerarOcorrencias()

    adicionarMedicamento({
        nome: nome.value,
        quantidade: quantidade.value,
        horario: horario.value,
        intervalo: intervalo.value,
        unidadeIntervalo: unidadeIntervalo.value,
        dataInicio: dataInicio.value,
        dataTermino: dataTermino.value,
        observacao: observacao.value,
        ocorrencias
    })

    alert('Medicamento salvo com sucesso!')

    router.push('/hoje')
}
</script>