import { AuthService } from './../../../seguranca/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Title } from '@angular/platform-browser';
import { Disciplina } from './../adicionar-professor/adicionar-professor.component';
import { ProfessorFiltro } from './../professor-filtro.model';
import { ProfessorService } from './../../../servicos/professor.service';
import { ProfessorModel } from './../../model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-professor',
  templateUrl: './listar-professor.component.html',
  styleUrls: ['./listar-professor.component.scss']
})
export class ListarProfessorComponent implements OnInit {

  
  mask: any[] = ['(', /[1-9]/, /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  nome: string;
  sobrenome: string;
  nascimento: string;
  disciplina: string;
  email: string;
  telefone: string;
  paraExcluir: any;
  professor = new ProfessorModel();
  disciplinaNoEditar: Disciplina[];
  disciplinaSelecionada: Disciplina;
  professorAtualizar = new ProfessorModel();

  listaDeProfessores = [];

  coluna: any[] = [
    { field: 'imagem', header: '' },
    { field: 'id', header: 'id' },
    { field: 'nome', header: 'Nome' },
    { field: 'sobrenome', header: 'Sobrenome' },
    { field: 'disciplina', header: 'Disciplina' },
    { field: 'nascimento', header: 'Nascimento' },
    { field: 'email', header: 'Email' },
    { field: 'telefone', header: 'Telefone' }
];

  constructor(private professorService: ProfessorService, private title: Title, private messageService: MessageService, private auth: AuthService) {
    this.disciplinaNoEditar = [
      {nome: 'Java'},
      {nome: 'PHP'},
      {nome: 'JavaScript'},
      {nome: 'C++'},
      {nome: 'Angular'},
      {nome: 'Spring'},
      {nome: 'TypeScript'},
      {nome: 'React'},
      {nome: 'MySql'}
  ];
   }

  ngOnInit() {
    this.pesquisar();
    this.title.setTitle("Listar professores");
  }

  pesquisar(){
    let filtro = new ProfessorFiltro(this.nome, this.sobrenome, this.disciplina, this.email, this.telefone);

    this.professorService.pesquisarProfessores(filtro)
      .then( professores => this.listaDeProfessores = professores )
      .catch(erro => {
        this.messageService.add({severity:'error', summary: 'Erro de permissão', detail:'Você não tem permissão para operar esse conteúdo'});
      });
  }

  excluirProfessor(){
    if(this.paraExcluir == null){
      console.log("Sem código");
    }else{
      this.professorService.deletarProfessor(this.paraExcluir)
        .then( () => {this.pesquisar()})
        .catch(erro => {
          this.messageService.add({severity:'error', summary: 'Erro de permissão', detail:'Você não tem permissão para operar esse conteúdo'});
        });
      this.paraExcluir = null;
    }
  }

  editarProfessor1(professor: ProfessorModel){
    this.professorService.pesquisarProfessorPorId(professor.id).then( al => {this.professorAtualizar = al; this.disciplinaSelecionada = al.disciplina; console.log(this.disciplinaSelecionada);});
  }
  editarProfessor2(){
    this.professorAtualizar.disciplina = this.disciplinaSelecionada.nome;
    this.professorService.atualizarProfessor(this.professorAtualizar.id, this.professorAtualizar)
      .then(()=> this.pesquisar())
      .catch(erro => {
        this.messageService.add({severity:'error', summary: 'Erro de permissão', detail:'Você não tem permissão para operar esse conteúdo'});
      });
  }

  acionarExcluir(professor: ProfessorModel){
    this.paraExcluir = professor.id;
  }

  fecharAviso() {
    this.messageService.clear('c');
  }
  
  mostra(permissao: string){
    if(this.auth.jwtPayload != null){
      return this.auth.temPermissao(permissao);
    }
  }

}
