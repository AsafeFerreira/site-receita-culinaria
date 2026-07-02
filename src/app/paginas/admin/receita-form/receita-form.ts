import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReceitaServices } from '../../../core/services/receita-services';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-receita-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './receita-form.html',
  styleUrl: './receita-form.css',
})
export class ReceitaForm implements OnInit {

  private receitaService = inject(ReceitaServices);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  selectedFile: File | null = null;
  id: any;
  isEditMode = signal(false);

  readonly categorias = [
    { valor: 'Bolo',      emoji: '🍫' },
    { valor: 'Massa',     emoji: '🍝' },
    { valor: 'Salada',    emoji: '🥗' },
    { valor: 'Sobremesa', emoji: '🍮' },
    { valor: 'Grelhado',  emoji: '🍗' },
    { valor: 'Sopa',      emoji: '🥣' },
    { valor: 'Lanche',    emoji: '🍔' },
  ];

  selecionarCategoria(cat: string): void {
    this.receitaForm.patchValue({ categoria: cat });
  }

  receitaForm = new FormGroup({
    titulo: new FormControl(),
    categoria: new FormControl(),
    descricao: new FormControl(),
    ingredientes_principais: new FormControl(),
    tempo_preparo: new FormControl(),
    dificuldade: new FormControl(),
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)

    if (this.id) {
    this.receitaService.getById(this.id).subscribe({
      next: (res: any) => {
        console.log(res);

        const mapaDesc = JSON.parse(localStorage.getItem('receitas_descricoes') ?? '{}');
        this.receitaForm.patchValue({
          titulo: res.titulo,
          categoria: res.categoria,
          descricao: res.descricao ?? mapaDesc[this.id] ?? '',
          ingredientes_principais: Array.isArray(res.ingredientes_principais)
            ? res.ingredientes_principais.join(', ')
            : res.ingredientes_principais,
          tempo_preparo: res.tempo_preparo,
          dificuldade: res.dificuldade,
        });
      },
    });
  }
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  onSubmit(): void {
    const formData = new FormData();
    const values = this.receitaForm.value;

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'ingredientes_principais') {
        // A API espera um array JSON, não uma string separada por vírgula
        const lista = String(value ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        formData.append(key, JSON.stringify(lista));
      } else {
        formData.append(key, String(value ?? ''));
      }
    });

    if (this.selectedFile) {
      formData.append('imagem', this.selectedFile);
    }

    const descricao = String(values.descricao ?? '').trim();

    if (this.id) {
      this.receitaService.update(formData, this.id).subscribe({
        next: () => {
          this.salvarDescricao(this.id, descricao);
          alert('Receita atualizada com sucesso!');
          this.router.navigate(['/admin']);
        },
        error: () => {
          alert('Erro ao atualizar receita.');
        }
      });
    } else {
      this.receitaService.create(formData).subscribe({
        next: (res: any) => {
          const id = res?.id ?? res?._id ?? String(values.titulo ?? '');
          this.salvarDescricao(id, descricao);
          alert('Receita criada com sucesso!');
          this.router.navigate(['/admin']);
        },
        error: () => {
          alert('Erro ao criar receita.');
        }
      });
    }
  }

  private salvarDescricao(id: string, descricao: string): void {
    if (!descricao) return;
    const mapa = JSON.parse(localStorage.getItem('receitas_descricoes') ?? '{}');
    mapa[id] = descricao;
    localStorage.setItem('receitas_descricoes', JSON.stringify(mapa));
  }
}