export interface receitaModel {
  id: string;
  categoria: string;
  titulo: string;
  descricao?: string;
  ingredientes_principais: string | string[];
  tempo_preparo: string;
  dificuldade: string;
  imagem_url: string;
}
