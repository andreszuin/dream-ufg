import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastroComponent} from './user/cadastro/cadastro.component';
import {LoginComponent} from './user/login/login.component';
import {EsqueceuSenhaComponent} from './user/esqueceu-senha/esqueceu-senha.component';
import {DashboardComponent} from './main/dashboard/dashboard.component';
import {ToolbarLoginComponent} from './main/toolbar-login/toolbar-login.component';
import {ToolbarMainMenuComponent} from './main/toolbar-main-menu/toolbar-main-menu.component';
import {ProjetoComponent} from './project/projeto/projeto.component';
import {MembrosComponent} from './project/membros/membros.component';
import {AdicionarMembrosComponent} from './project/adicionar-membros/adicionar-membros.component';
import {GerenciarPapeisComponent} from './project/gerenciar-papeis/gerenciar-papeis.component';
import {InformacoesProjetoComponent} from './project/informacoes-projeto/informacoes-projeto.component';
import {CadastroCatalogoComponent} from './catalogue/cadastro-catalogo/cadastro-catalogo.component';
import {PesquisarCatalogoComponent} from './catalogue/pesquisar-catalogo/pesquisar-catalogo.component';
import {AssociarCatalogoComponent} from './catalogue/associar-catalogo/associar-catalogo.component';
import {VisualizarPadroesComponent} from './catalogue/visualizar-padroes/visualizar-padroes.component';
import {EditarCasosComponent} from './catalogue/editar-casos/editar-casos.component';
import {EditarRequisitosComponent} from './catalogue/editar-requisitos/editar-requisitos.component';
import {ReusarPadroesComponent} from './catalogue/reusar-padroes/reusar-padroes.component';
import {RelatorioComponent} from './documents/relatorio/relatorio.component';


const routes: Routes = [
  {path: 'main', component: ToolbarLoginComponent, children: [
    {path: 'cadastro', component: CadastroComponent},
      {path: 'login', component: LoginComponent},
      {path: 'recuperarSenha', component: EsqueceuSenhaComponent}]},
  {path: 'app', component: ToolbarMainMenuComponent, children: [
      {path: 'cadastro-catalogo', component: CadastroCatalogoComponent},
      {path: 'pesquisar-catalogo', component: PesquisarCatalogoComponent},
      {path: 'relatorio', component: RelatorioComponent},
      {path: 'dashboard', component: DashboardComponent},
        {path: 'projeto', component: ProjetoComponent, children: [
            {path: 'informacoes', component: InformacoesProjetoComponent},
            {path: 'reusar', component: ReusarPadroesComponent},
            {path: 'membros', component: MembrosComponent},
            {path: 'adicionar-membros', component: AdicionarMembrosComponent},
            {path: 'gerenciar-papeis', component: GerenciarPapeisComponent},
            {path: 'associar-catalogos', component: AssociarCatalogoComponent},
            {path: 'visualizar-padroes', component: VisualizarPadroesComponent},
            {path: 'editar-casos', component: EditarCasosComponent},
            {path: 'editar-requisitos', component: EditarRequisitosComponent}
          ]}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
