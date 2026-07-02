import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Receita } from '../../shared/receita/receita';
import { receitaModel } from '../../core/services/models/receitaModel';
import { ReceitaServices } from '../../core/services/receita-services';

function svgReceita(emoji: string, titulo: string, fundo: string, cor: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${fundo}"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>

      <rect width="900" height="560" rx="36" fill="url(#g)"/>
      <circle cx="760" cy="110" r="95" fill="${cor}" opacity="0.12"/>
      <circle cx="145" cy="430" r="120" fill="${cor}" opacity="0.10"/>

      <text x="50%" y="43%" text-anchor="middle" dominant-baseline="middle"
        font-size="120" font-family="Arial, sans-serif">
        ${emoji}
      </text>

      <text x="50%" y="66%" text-anchor="middle"
        font-size="48" font-weight="700"
        font-family="Georgia, serif"
        fill="${cor}">
        ${titulo}
      </text>

      <text x="50%" y="76%" text-anchor="middle"
        font-size="24"
        font-family="Arial, sans-serif"
        fill="#7c2d12">
        Sabor & Arte
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function imagemPorContexto(receita: Pick<receitaModel, 'titulo' | 'categoria'>): string {
  const texto = `${receita.titulo} ${receita.categoria}`.toLowerCase();

  if (
    texto.includes('carbonara') ||
    texto.includes('spaghetti') ||
    texto.includes('macarr') ||
    texto.includes('massa') ||
    texto.includes('lasanha')
  ) {
    return svgReceita('🍝', 'Massa', '#fff3c4', '#f97316');
  }

  if (texto.includes('bolo') || texto.includes('chocolate')) {
    return svgReceita('🍫', 'Bolo', '#ffe3d6', '#c8350a');
  }

  if (texto.includes('salada') || texto.includes('mediterr')) {
    return svgReceita('🥗', 'Salada', '#dcfce7', '#16a34a');
  }

  if (
    texto.includes('mousse') ||
    texto.includes('sobremesa') ||
    texto.includes('brigadeiro')
  ) {
    return svgReceita('🍮', 'Sobremesa', '#fce7f3', '#db2777');
  }

  if (
    texto.includes('frango') ||
    texto.includes('carne') ||
    texto.includes('grelhado')
  ) {
    return svgReceita('🍗', 'Prato quente', '#ffedd5', '#ea580c');
  }

  if (
    texto.includes('sopa') ||
    texto.includes('abóbora') ||
    texto.includes('abobora')
  ) {
    return svgReceita('🥣', 'Sopa', '#fef3c7', '#d97706');
  }

  if (texto.includes('burguer') || texto.includes('hamb')) {
    return svgReceita('🍔', 'Lanche', '#fee2e2', '#dc2626');
  }

  return svgReceita('🍽️', 'Receita', '#fff3c4', '#c8350a');
}

function gerarDescricao(receita: receitaModel): string {
  const ing = receita.ingredientes_principais;
  const lista: string[] = Array.isArray(ing)
    ? ing
    : String(ing ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const primeiros = lista.slice(0, 3).join(', ');
  const cat = receita.categoria?.toLowerCase() ?? '';

  if (cat === 'bolo')      return `${receita.titulo} feito com ${primeiros}. Perfeito para qualquer ocasião.`;
  if (cat === 'massa')     return `Prato de massa preparado com ${primeiros}. Sabor italiano autêntico.`;
  if (cat === 'salada')    return `Salada fresca e saudável com ${primeiros}. Leve e deliciosa.`;
  if (cat === 'sobremesa') return `Sobremesa irresistível com ${primeiros}. Doce na medida certa.`;
  if (cat === 'grelhado')  return `${receita.titulo} grelhado na perfeição com ${primeiros}.`;
  if (cat === 'sopa')      return `Sopa reconfortante preparada com ${primeiros}. Ideal para dias frios.`;
  if (cat === 'lanche')    return `${receita.titulo} artesanal com ${primeiros}. Prático e saboroso.`;
  return `Receita especial com ${primeiros}.`;
}

function normalizarReceita(receita: receitaModel): receitaModel {
  const url = String(receita.imagem_url || '').trim();

  const imagemValida =
    /^https?:\/\//i.test(url) ||
    url.startsWith('data:image');

  return {
    ...receita,
    descricao: receita.descricao || gerarDescricao(receita),
    imagem_url: imagemValida ? url : imagemPorContexto(receita),
  };
}

const RECEITAS_FALLBACK: receitaModel[] = [
  {
    id: '1',
    titulo: 'Bolo de Chocolate Fudge',
    categoria: 'Bolo',
    ingredientes_principais: 'farinha de trigo, cacau em pó, ovos, leite, chocolate meio amargo, creme de leite',
    tempo_preparo: '60 min',
    dificuldade: 'Médio',
    imagem_url: imagemPorContexto({ titulo: 'Bolo de Chocolate Fudge', categoria: 'Bolo' }),
  },
  {
    id: '2',
    titulo: 'Spaghetti ao Molho Pomodoro',
    categoria: 'Massa',
    ingredientes_principais: 'spaghetti, tomates pelados, alho, manjericão fresco, azeite, parmesão',
    tempo_preparo: '30 min',
    dificuldade: 'Fácil',
    imagem_url: imagemPorContexto({ titulo: 'Spaghetti ao Molho Pomodoro', categoria: 'Massa' }),
  },
  {
    id: '3',
    titulo: 'Salada Mediterrânea Fresca',
    categoria: 'Salada',
    ingredientes_principais: 'pepino, tomate, pimentão vermelho, queijo feta, azeitonas, cebola roxa, limão',
    tempo_preparo: '15 min',
    dificuldade: 'Fácil',
    imagem_url: imagemPorContexto({ titulo: 'Salada Mediterrânea Fresca', categoria: 'Salada' }),
  },
  {
    id: '4',
    titulo: 'Mousse de Maracujá',
    categoria: 'Sobremesa',
    ingredientes_principais: 'polpa de maracujá, leite condensado, creme de leite, gelatina sem sabor, água',
    tempo_preparo: '20 min',
    dificuldade: 'Fácil',
    imagem_url: imagemPorContexto({ titulo: 'Mousse de Maracujá', categoria: 'Sobremesa' }),
  },
  {
    id: '5',
    titulo: 'Frango Grelhado com Ervas',
    categoria: 'Grelhado',
    ingredientes_principais: 'peito de frango, alho, limão, azeite, tomilho, alecrim, páprica defumada',
    tempo_preparo: '35 min',
    dificuldade: 'Médio',
    imagem_url: imagemPorContexto({ titulo: 'Frango Grelhado com Ervas', categoria: 'Grelhado' }),
  },
  {
    id: '6',
    titulo: 'Sopa Creme de Abóbora',
    categoria: 'Sopa',
    ingredientes_principais: 'abóbora, cebola, alho, leite de coco, caldo de legumes, gengibre, curry',
    tempo_preparo: '40 min',
    dificuldade: 'Fácil',
    imagem_url: imagemPorContexto({ titulo: 'Sopa Creme de Abóbora', categoria: 'Sopa' }),
  },
  {
    id: '7',
    titulo: 'Lasanha à Bolonhesa',
    categoria: 'Massa',
    ingredientes_principais: 'massa para lasanha, carne moída, tomates pelados, leite, manteiga, mussarela, parmesão',
    tempo_preparo: '90 min',
    dificuldade: 'Difícil',
    imagem_url: imagemPorContexto({ titulo: 'Lasanha à Bolonhesa', categoria: 'Massa' }),
  },
  {
    id: '8',
    titulo: 'Brigadeiro Gourmet',
    categoria: 'Sobremesa',
    ingredientes_principais: 'leite condensado, chocolate 70%, manteiga sem sal, sal, cacau em pó, granulado',
    tempo_preparo: '25 min',
    dificuldade: 'Fácil',
    imagem_url: imagemPorContexto({ titulo: 'Brigadeiro Gourmet', categoria: 'Sobremesa' }),
  },
  {
    id: '9',
    titulo: 'X-Burguer Artesanal',
    categoria: 'Lanche',
    ingredientes_principais: 'pão brioche, blend de carnes, queijo cheddar, bacon, alface, tomate, cebola roxa',
    tempo_preparo: '25 min',
    dificuldade: 'Médio',
    imagem_url: imagemPorContexto({ titulo: 'X-Burguer Artesanal', categoria: 'Lanche' }),
  },
];

@Component({
  selector: 'app-vitrine',
  imports: [FormsModule, Receita],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css',
})
export class Vitrine implements OnInit {
  private readonly receitaService = inject(ReceitaServices);
  private readonly route = inject(ActivatedRoute);

  protected readonly receitas = signal<receitaModel[]>([]);
  protected readonly busca = signal('');
  protected readonly categoriaAtiva = signal('Todas');
  protected readonly carregando = signal(true);
  protected readonly receitaSelecionada = signal<receitaModel | null>(null);

  protected readonly categorias = computed(() => {
    const categoriasUnicas = new Set(
      this.receitas()
        .map((receita) => receita.categoria)
        .filter(Boolean)
    );

    return ['Todas', ...Array.from(categoriasUnicas)];
  });

  protected readonly receitasFiltradas = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const categoria = this.categoriaAtiva();

    return this.receitas().filter((receita) => {
      const correspondeCategoria =
        categoria === 'Todas' || receita.categoria === categoria;

      const conteudoBusca =
        `${receita.titulo} ${receita.categoria} ${receita.ingredientes_principais}`.toLowerCase();

      const correspondeBusca = !termo || conteudoBusca.includes(termo);

      return correspondeCategoria && correspondeBusca;
    });
  });

  protected readonly tempoMedio = computed(() => {
    const tempos = this.receitas()
      .map((receita) => Number.parseInt(receita.tempo_preparo, 10))
      .filter((tempo) => Number.isFinite(tempo));

    if (!tempos.length) {
      return 0;
    }

    return Math.round(
      tempos.reduce((total, atual) => total + atual, 0) / tempos.length
    );
  });

  ngOnInit(): void {
    const categoria = this.route.snapshot.queryParamMap.get('categoria');
    if (categoria) {
      this.categoriaAtiva.set(categoria);
    }

    this.receitaService.getAll().subscribe({
      next: (res) => {
        if (Array.isArray(res) && res.length) {
          this.receitas.set(res.map(normalizarReceita));
        } else {
          this.receitas.set(RECEITAS_FALLBACK);
        }

        this.carregando.set(false);
      },
      error: () => {
        this.receitas.set(RECEITAS_FALLBACK);
        this.carregando.set(false);
      },
    });
  }

  protected alterarCategoria(categoria: string): void {
    this.categoriaAtiva.set(categoria);
  }

  protected abrirReceita(receita: receitaModel): void {
    this.receitaSelecionada.set(normalizarReceita(receita));
  }

  protected fecharReceita(): void {
    this.receitaSelecionada.set(null);
  }

  protected ingredientesDaReceita(receita: receitaModel): string[] {
    const ing = receita.ingredientes_principais;
    const lista: string[] = Array.isArray(ing) ? ing : String(ing ?? '').split(',');
    return lista.map((ingrediente: string) => ingrediente.trim()).filter(Boolean);
  }

  protected dificuldadeClasse(dificuldade: string): string {
    const valor = dificuldade.toLowerCase();

    if (valor.includes('dif')) return 'tag-dificil';
    if (valor.includes('méd') || valor.includes('med')) return 'tag-medio';

    return 'tag-facil';
  }
}