// Tipos globales de la aplicación
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
