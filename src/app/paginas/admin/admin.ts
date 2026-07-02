import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ReceitaServices } from '../../core/services/receita-services';

type AdminTab = 'recipes' | 'profile' | 'settings';

interface AdminUser {
  name: string;
  email: string;
}

interface AdminRecipe {
  id: string;
  name: string;
  category: string;
  prepTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  image: string;
  description: string;
  ingredients: string[];
  views: number;
  likes: number;
  rating: string;
}

interface ToggleSetting {
  label: string;
  desc: string;
  on: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  imports: [RouterLink]
})
export class AdminPanel implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly receitaService = inject(ReceitaServices);

  protected readonly user: AdminUser = {
    name: localStorage.getItem('user_name') ?? 'Usuário',
    email: localStorage.getItem('user_email') ?? '',
  };

  protected readonly tab = signal<AdminTab>('recipes');
  protected readonly sidebarOpen = signal(true);
  protected readonly deleteId = signal<string | null>(null);
  protected readonly selectedRecipe = signal<AdminRecipe | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly localRecipes = signal<AdminRecipe[]>([]);
  protected readonly carregando = signal(true);

  protected readonly navItems = [
    { id: 'recipes' as AdminTab, icon: '📖', label: 'Minhas Receitas' },
    { id: 'profile' as AdminTab, icon: '♙', label: 'Perfil' },
    { id: 'settings' as AdminTab, icon: '⚙', label: 'Configurações' },
  ];

  protected readonly activity = [
    { icon: '♡', color: '#ef4444', text: 'Ana Clara curtiu sua receita', time: '2min atrás' },
    { icon: '◉', color: '#3b82f6', text: '12 pessoas viram seu Bolo de Chocolate', time: '15min atrás' },
    { icon: '☆', color: '#f59e0b', text: 'Você recebeu uma avaliação 5 estrelas', time: '1h atrás' },
    { icon: '♨', color: '#c8350a', text: 'Sua receita foi destaque hoje!', time: '3h atrás' },
    { icon: '♡', color: '#ef4444', text: 'Bruno Lima curtiu sua receita', time: '5h atrás' },
  ];

  protected readonly settingsSections: { section: string; items: ToggleSetting[] }[] = [
    {
      section: 'Notificações',
      items: [
        { label: 'Curtidas nas minhas receitas', desc: 'Receba quando alguém curtir', on: true },
        { label: 'Comentários', desc: 'Novos comentários nas receitas', on: true },
        { label: 'Novidades do site', desc: 'Newsletter e atualizações', on: false },
      ],
    },
    {
      section: 'Privacidade',
      items: [
        { label: 'Perfil público', desc: 'Outros usuários podem ver seu perfil', on: true },
        { label: 'Mostrar receitas', desc: 'Exibir suas receitas para todos', on: true },
        { label: 'Mostrar avaliação', desc: 'Exibir sua nota média no perfil', on: false },
      ],
    },
  ];

  protected readonly stats = computed(() => [
    { label: 'Receitas Publicadas', value: this.localRecipes().length, icon: '📖', color: '#c8350a', bg: '#fff7ed', trend: '+2 este mês' },
    { label: 'Visualizações', value: '1.2k', icon: '◉', color: '#3b82f6', bg: '#eff6ff', trend: '+18% esta semana' },
    { label: 'Curtidas Recebidas', value: 84, icon: '♡', color: '#ef4444', bg: '#fef2f2', trend: '+12 hoje' },
    { label: 'Avaliação Média', value: '4.8', icon: '☆', color: '#f59e0b', bg: '#fffbeb', trend: 'Excelente!' },
  ]);

  protected readonly filteredRecipes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.localRecipes();
    return this.localRecipes().filter((recipe) => {
      const content = `${recipe.name} ${recipe.category} ${recipe.difficulty} ${recipe.ingredients.join(' ')}`.toLowerCase();
      return content.includes(term);
    });
  });

  ngOnInit(): void {
    this.receitaService.getAll().subscribe({
      next: (receitas) => {
        const mapped = receitas.map(r => ({
          id: r.id,
          name: r.titulo,
          category: r.categoria,
          prepTime: parseInt(r.tempo_preparo) || 0,
          difficulty: r.dificuldade as 'Fácil' | 'Médio' | 'Difícil',
          image: r.imagem_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=900',
          description: '',
          ingredients: Array.isArray(r.ingredientes_principais)
            ? r.ingredientes_principais
            : r.ingredientes_principais.split(',').map(i => i.trim()),
          views: 0,
          likes: 0,
          rating: '0',
        }));
        this.localRecipes.set(mapped);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        alert('Erro ao carregar receitas.');
      }
    });
  }

  protected setTab(tab: AdminTab): void {
    this.tab.set(tab);
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  protected askDelete(id: string): void {
    this.deleteId.set(id);
  }

  protected cancelDelete(): void {
    this.deleteId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.deleteId();
    if (!id) return;

    this.receitaService.delete(id).subscribe({
      next: () => {
        this.localRecipes.update(recipes => recipes.filter(r => r.id !== id));
        this.deleteId.set(null);
      },
      error: () => {
        alert('Erro ao excluir receita.');
        this.deleteId.set(null);
      }
    });
  }

  protected openRecipe(recipe: AdminRecipe): void {
    this.selectedRecipe.set(recipe);
  }

  protected closeRecipe(): void {
    this.selectedRecipe.set(null);
  }

  protected goHome(): void {
    this.router.navigateByUrl('/');
  }

  protected publishRecipe(): void {
    this.router.navigateByUrl('/admin/create');
  }

  protected logout(): void {
    this.authService.logout();
  }

  protected toggleSetting(item: ToggleSetting): void {
    item.on = !item.on;
  }

  protected difficultyClass(difficulty: AdminRecipe['difficulty']): string {
    return `difficulty-${difficulty.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i')}`;
  }
}