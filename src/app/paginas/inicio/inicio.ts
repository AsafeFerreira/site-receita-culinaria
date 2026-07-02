import { AfterViewInit, Component, computed, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReceitaServices } from '../../core/services/receita-services';
import { receitaModel } from '../../core/services/models/receitaModel';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, AfterViewInit, OnDestroy {
  private readonly receitaService = inject(ReceitaServices);
  private intervalo: ReturnType<typeof setInterval> | null = null;

  @ViewChild('galeriaSecao') private galeriaSecaoRef?: ElementRef<HTMLElement>;
  @ViewChild('trilho') private trilhoRef?: ElementRef<HTMLElement>;

  protected readonly receitas = signal<receitaModel[]>([]);
  protected readonly indiceAtual = signal(0);
  protected readonly saindo = signal(false);

  protected readonly receitaAtual = computed(() => {
    const lista = this.receitas();
    if (!lista.length) return null;
    return lista[this.indiceAtual() % lista.length];
  });

  protected readonly totalReceitas = computed(() => this.receitas().length);

  protected readonly totalCategorias = computed(() =>
    new Set(this.receitas().map(r => r.categoria).filter(Boolean)).size
  );

  protected readonly tempoMedio = computed(() => {
    const tempos = this.receitas()
      .map(r => parseInt(r.tempo_preparo, 10))
      .filter(t => Number.isFinite(t));
    if (!tempos.length) return 0;
    return Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
  });

  ngOnInit(): void {
    this.receitaService.getAll().subscribe({
      next: (res) => {
        if (Array.isArray(res) && res.length) {
          this.receitas.set(res);
          this.iniciarCarrossel();
          setTimeout(() => this.atualizarGaleria());
        }
      },
    });
  }

  ngAfterViewInit(): void {
    this.atualizarGaleria();
  }

  private iniciarCarrossel(): void {
    this.intervalo = setInterval(() => {
      this.saindo.set(true);
      setTimeout(() => {
        this.indiceAtual.update(i => (i + 1) % this.receitas().length);
        this.saindo.set(false);
      }, 350);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected atualizarGaleria(): void {
    const secao = this.galeriaSecaoRef?.nativeElement;
    const trilho = this.trilhoRef?.nativeElement;
    if (!secao || !trilho) return;

    const distanciaMaxima = trilho.scrollWidth - trilho.clientWidth;
    if (distanciaMaxima <= 0) {
      trilho.style.transform = 'translateX(0)';
      return;
    }

    const alturaRolavel = secao.offsetHeight - window.innerHeight;
    if (alturaRolavel <= 0) return;

    const progresso = Math.min(1, Math.max(0, -secao.getBoundingClientRect().top / alturaRolavel));
    trilho.style.transform = `translateX(-${progresso * distanciaMaxima}px)`;
  }
}
