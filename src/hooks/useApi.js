import { useEffect, useState } from "react";

// Custom Hook: useApi - Gerencia fetch de dados da API
// O que faz: Carrega dados de um endpoint, gerencia estados de loading/erro
// Como: Usa fetch com try/catch, retorna dados, loading, error, função reload
// Por que: Centraliza lógica de requisição HTTP, evita repetição de código
function useApi(endpoint) {
  // Estado: Array de dados carregados (ou vazio se erro)
  const [data, setData] = useState([]);

  // Estado: Indicador de carregamento (true enquanto busca dados)
  const [loading, setLoading] = useState(true);

  // Estado: Mensagem de erro (vazio se sucesso)
  const [error, setError] = useState("");

  // Função: Carrega dados de uma URL (padrão é o endpoint passado)
  // O que faz: Faz fetch GET, parseia JSON, armazena em data
  // Como: try/catch com finally para sempre desligar loading
  // Por que: Permite recarregar dados sem refazer o component
  async function load(url = endpoint) {
    try {
      // Ativa indicador de carregamento e limpa erros anteriores
      setLoading(true);
      setError("");

      // Faz requisição GET ao servidor
      const response = await fetch(url);

      // Se resposta não é OK (200-299), lança erro
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados.");
      }

      // Parseia resposta JSON
      const json = await response.json();

      // Se é array, armazena como está; se é objeto, envolve em array
      // Por que: Garante que data sempre é um array para maps no render
      setData(Array.isArray(json) ? json : [json]);
    } catch (err) {
      // Em caso de erro, armazena mensagem e limpa dados
      setError(err.message);
      setData([]);
    } finally {
      // Sempre desliga loading, mesmo com erro
      setLoading(false);
    }
  }

  // Effect: Carrega dados quando endpoint muda
  // Por que: Refaz fetch se o URL do endpoint foi alterado
  useEffect(() => {
    load(endpoint);
  }, [endpoint]);

  // Retorna objeto com dados e funções para componente usar
  return {
    data,
    loading,
    error,
    reload: load,  // Função para recarregar manualmente
  };
}

export default useApi;
