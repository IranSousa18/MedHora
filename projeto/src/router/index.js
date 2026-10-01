import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import CadastroView from '../views/CadastroView.vue'
import MedicinesView from '../views/MedicinesView.vue'
import MedicineCreateView from '../views/MedicineCreateView.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: LoginView
    },
    {
        path: '/cadastro',
        component: CadastroView
    },
    {
        path: '/home',
        component: HomeView
    },
    {
        path: '/historico',
        component: HistoryView
    },
    {
        path: '/medicamentos',
        component: MedicinesView
    },
    {
        path: '/medicamentos/novo',
        component: MedicineCreateView
    },
    {
        path: '/hoje',
        component: TodayView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router