import { Component, input, output } from '@angular/core';
import { receitaModel } from '../../core/services/models/receitaModel';

@Component({
  selector: 'app-receita',
  imports: [],
  templateUrl: './receita.html',
  styleUrl: './receita.css',
})
export class Receita {
  data = input.required<receitaModel>();
  selecionar = output<receitaModel>();

  protected imagemSrc(): string {
    const url = String(this.data().imagem_url || '').trim();

    if (/^https?:\/\//i.test(url) || url.startsWith('data:image')) {
      return url;
    }

    return this.imagemPorContexto();
  }

  protected corrigirImagem(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = this.imagemPorContexto();
  }

  private imagemPorContexto(): string {
    const texto = `${this.data().titulo} ${this.data().categoria}`.toLowerCase();

    if (
      texto.includes('carbonara') ||
      texto.includes('spaghetti') ||
      texto.includes('macarr') ||
      texto.includes('massa') ||
      texto.includes('lasanha')
    ) {
      return this.svgReceita('🍝', 'Massa', '#fff3c4', '#f97316');
    }

    if (texto.includes('bolo') || texto.includes('chocolate')) {
      return this.svgReceita('🍫', 'Bolo', '#ffe3d6', '#c8350a');
    }

    if (texto.includes('salada') || texto.includes('mediterr')) {
      return this.svgReceita('🥗', 'Salada', '#dcfce7', '#16a34a');
    }

    if (
      texto.includes('mousse') ||
      texto.includes('sobremesa') ||
      texto.includes('brigadeiro')
    ) {
      return this.svgReceita('🍮', 'Sobremesa', '#fce7f3', '#db2777');
    }

    if (
      texto.includes('frango') ||
      texto.includes('carne') ||
      texto.includes('grelhado')
    ) {
      return this.svgReceita('🍗', 'Prato quente', '#ffedd5', '#ea580c');
    }

    if (texto.includes('sopa') || texto.includes('abóbora') || texto.includes('abobora')) {
      return this.svgReceita('🥣', 'Sopa', '#fef3c7', '#d97706');
    }

    if (texto.includes('burguer') || texto.includes('hamb')) {
      return this.svgReceita('🍔', 'Lanche', '#fee2e2', '#dc2626');
    }

    return this.svgReceita('🍽️', 'Receita', '#fff3c4', '#c8350a');
  }

  private svgReceita(emoji: string, titulo: string, fundo: string, cor: string): string {
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

  protected ingredientesPreview(): string[] {
    return this.data().ingredientes_principais
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  protected dificuldadeClasse(): string {
    const dificuldade = this.data().dificuldade.toLowerCase();

    if (dificuldade.includes('dif')) {
      return 'tag-dificil';
    }

    if (dificuldade.includes('méd') || dificuldade.includes('med')) {
      return 'tag-medio';
    }

    return 'tag-facil';
  }

  protected categoriaClasse(): string {
    const categoria = this.data().categoria.toLowerCase();

    if (categoria.includes('sobremesa')) return 'badge-rosa';
    if (categoria.includes('massa')) return 'badge-amarelo';
    if (categoria.includes('bolo')) return 'badge-laranja';
    if (categoria.includes('salada')) return 'badge-verde';
    if (categoria.includes('sopa')) return 'badge-dourado';

    return 'badge-laranja';
  }
}