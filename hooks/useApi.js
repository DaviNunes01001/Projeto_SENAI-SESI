import { useEffect, useState } from "react";

function useApi(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(url = endpoint) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados.");
      }

      const json = await response.json();
      setData(Array.isArray(json) ? json : [json]);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(endpoint);
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}

export default useApi;
