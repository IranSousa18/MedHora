
import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import CadastroView from '../views/CadastroView.vue'
import MedicinesView from '../views/MedicinesView.vue'
import MedicineCreateView from '../views/MedicineCreateView.vue'
import MedicineEditView from '../views/MedicineEditView.vue'
import TodayView from '../views/TodayView.vue'

import { estaAutenticado } from '../services/authService'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: LoginView,
        meta: { publico: true }
    },
    {
        path: '/cadastro',
        component: CadastroView,
        meta: { publico: true }
    },
    {
        path: '/home',
        component: HomeView,
        meta: { protegido: true }
    },
    {
        path: '/historico',
        component: HistoryView,
        meta: { protegido: true }
    },
    {
        path: '/medicamentos',
        component: MedicinesView,
        meta: { protegido: true }
    },
    {
        path: '/medicamentos/novo',
        component: MedicineCreateView,
        meta: { protegido: true }
    },
    {
        path: '/medicamentos/:id/editar',
        component: MedicineEditView,
        meta: { protegido: true }
    },
    {
        path: '/hoje',
        component: TodayView,
        meta: { protegido: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const autenticado = estaAutenticado()

    if (to.meta.protegido && !autenticado) {
        return '/login'
    }

    if (to.meta.publico && autenticado) {
        return '/home'
    }
})

export default router
