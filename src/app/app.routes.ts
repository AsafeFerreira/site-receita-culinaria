import { Routes } from '@angular/router';

import { Vitrine } from './paginas/vitrine/vitrine';
import { Login } from './paginas/auth/login/login';
import { Cadastro } from './paginas/auth/cadastro/cadastro';
import { Inicio } from './paginas/inicio/inicio';
import { AdminPanel } from './paginas/admin/admin';
import { ReceitaForm } from './paginas/admin/receita-form/receita-form';
import { guardGuard } from './core/guards/guard-guard';

export const routes: Routes = [
  {
    path: '',
    component: Inicio,
  },
  {
    path: 'receitas',
    component: Vitrine,
  },
  {
    path: 'vitrine',
    redirectTo: 'receitas',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'admin',
    canActivate:[guardGuard],
    children: [
      {
        path: '',
        component: AdminPanel,
      },
      {
        path: 'create',
        component: ReceitaForm,
      },
      {
        path: 'edit/:id',
        component: ReceitaForm,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];