import { useCallback, useEffect, useRef, useState } from "react";

import { apiFetch } from "../services/api";

function useApi(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const controllerAtual = useRef(null);

  const load = useCallback(async (url = endpoint) => {
    const requestAtual = ++requestId.current;
    controllerAtual.current?.abort();
    const controller = new AbortController();
    controllerAtual.current = controller;

    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados.");
      }

      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error("A resposta da API não contém uma lista.");
      }

      if (requestAtual === requestId.current) {
        setData(json);
      }
    } catch (err) {
      if (requestAtual === requestId.current && !controller.signal.aborted) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os dados.",
        );
        setData([]);
      }
    } finally {
      if (requestAtual === requestId.current) {
        setLoading(false);
      }
    }
  }, [endpoint]);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        load(endpoint);
      }
    });

    return () => {
      active = false;
      requestId.current += 1;
      controllerAtual.current?.abort();
    };
  }, [endpoint, load]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}

export default useApi;
