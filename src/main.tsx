import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n'; // Ativa a tradução automática no app
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Criação do cliente do React Query com a estratégia de cache agressivo (Eco-mode para o Supabase)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutos de cache puro sem fazer novos requests ao Supabase
      gcTime: 1000 * 60 * 30,        // Mantém os dados em memória por 30 minutos mesmo não sendo usados
      refetchOnWindowFocus: false,   // Impede chamadas desnecessárias à API ao alternar entre abas do navegador
      refetchOnReconnect: false,     // Impede novas chamadas automáticas ao recuperar sinal de rede
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);