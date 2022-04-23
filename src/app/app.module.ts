// modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule} from 'primeng/picklist';
import {OrderListModule} from 'primeng/orderlist';
import {ListboxModule} from 'primeng/listbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PaginatorModule} from 'primeng/paginator';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CaptchaModule} from 'primeng/captcha';
import {CheckboxModule} from 'primeng/checkbox';
import {TreeTableModule} from 'primeng/treetable';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ChartModule} from 'primeng/chart';

// components
import { AppComponent } from './app.component';
import { CadastroComponent } from './user/cadastro/cadastro.component';
import { LoginComponent } from './user/login/login.component';
import { EsqueceuSenhaComponent } from './user/esqueceu-senha/esqueceu-senha.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { ToolbarLoginComponent } from './main/toolbar-login/toolbar-login.component';
import { ToolbarMainMenuComponent } from './main/toolbar-main-menu/toolbar-main-menu.component';
import { PerfilComponent } from './user/perfil/perfil.component';
import { VisualizarPadroesComponent } from './catalogue/visualizar-padroes/visualizar-padroes.component';
import { EditarRequisitosComponent } from './catalogue/editar-requisitos/editar-requisitos.component';
import { EditarCasosComponent } from './catalogue/editar-casos/editar-casos.component';
import { ReusarPadroesComponent } from './catalogue/reusar-padroes/reusar-padroes.component';
import { PesquisarCatalogoComponent } from './catalogue/pesquisar-catalogo/pesquisar-catalogo.component';
import { AssociarCatalogoComponent } from './catalogue/associar-catalogo/associar-catalogo.component';
import { ProjetoComponent } from './project/projeto/projeto.component';
import { CadastroProjetoComponent } from './project/cadastro-projeto/cadastro-projeto.component';
import { AtualizarProjetoComponent } from './project/atualizar-projeto/atualizar-projeto.component';
import { MembrosComponent } from './project/membros/membros.component';
import { AdicionarMembrosComponent } from './project/adicionar-membros/adicionar-membros.component';
import { GerenciarPapeisComponent } from './project/gerenciar-papeis/gerenciar-papeis.component';
import { InformacoesProjetoComponent } from './project/informacoes-projeto/informacoes-projeto.component';
import { CadastroCatalogoComponent } from './catalogue/cadastro-catalogo/cadastro-catalogo.component';

// services
import { AuthService } from './interceptors/auth.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {LoginService} from './user/login.service';
import { CookieService} from 'ngx-cookie-service';
import { RelatorioComponent } from './documents/relatorio/relatorio.component';
import {TabViewModule} from 'primeng/tabview';
import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
const i18n_route = environment.production ? './assets/i18n/' : '../assets/i18n/';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, i18n_route, '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    CadastroComponent,
    LoginComponent,
    EsqueceuSenhaComponent,
    DashboardComponent,
    ToolbarLoginComponent,
    ToolbarMainMenuComponent,
    PerfilComponent,
    ProjetoComponent,
    CadastroProjetoComponent,
    AtualizarProjetoComponent,
    MembrosComponent,
    AdicionarMembrosComponent,
    GerenciarPapeisComponent,
    InformacoesProjetoComponent,
    CadastroCatalogoComponent,
    PesquisarCatalogoComponent,
    AssociarCatalogoComponent,
    VisualizarPadroesComponent,
    EditarRequisitosComponent,
    EditarCasosComponent,
    ReusarPadroesComponent,
    RelatorioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [{path: 'main', component: ToolbarLoginComponent},
        {path: '', redirectTo: 'main/login', pathMatch: 'full'},
        {path: '**', redirectTo: 'main/login', pathMatch: 'full'}
      ]
    ),
    ToolbarModule,
    MessageModule,
    PasswordModule,
    ReactiveFormsModule,
    HttpClientModule,
    DialogModule,
    ToastModule,
    FileUploadModule,
    DataViewModule,
    PickListModule,
    OrderListModule,
    ListboxModule,
    InputTextareaModule,
    ConfirmDialogModule,
    PaginatorModule,
    TreeTableModule,
    CaptchaModule,
    CheckboxModule,
    ChartModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'pt'
    }),
    TabViewModule
  ],
  providers: [
    CookieService,
    MessageService,
    DialogService,
    LoginService,
    {  provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    },
    ],
  entryComponents: [PerfilComponent , CadastroProjetoComponent, AtualizarProjetoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
