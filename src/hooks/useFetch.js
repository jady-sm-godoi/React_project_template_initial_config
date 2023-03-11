import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

//função acessória para garantir a comparação caso a url recebida seja um objeto e não uma string
const isObjectEqual = (objA, objB) => {
  return JSON.stringify(objA) === JSON.stringify(objB);
};

export const useFetch = (url, options) => {
  //variáveis de estado para atualização e retorno da função
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [shouldLoad, setShouldLoad] = useState(false);

  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  useEffect(() => {
    //hook para evitar a re-renderização e o looping pela alteraçao da url ou options
    let changed = false;

    if (!isObjectEqual(url, urlRef.current)) {
      urlRef.current = url;
      changed = true;
    }
    if (!isObjectEqual(options, optionsRef.current)) {
      optionsRef.current = options;
      changed = true;
    }

    if (changed) {
      setShouldLoad((s) => !s);
    }
  }, [url, options]);

  useEffect(() => {
    //variável de controle para evitar setar os estados caso o componente tenha sido desmontado
    let wait = false;
    //variáveis para abortar a fetch caso o componente seja desmontado
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    const fetchData = async () => {
      await new Promise((r) => setTimeout(r, 2000)); //linha para fazer uma espera para não ficar batendo na api direto e dar block
      try {
        //chamada da api com a url recebida como parametro
        const response = await fetch(urlRef.current, { signal, ...optionsRef.current });
        const jsonResult = await response.json();

        if (!wait) {
          setResult(jsonResult);
          setLoading(false);
        }
      } catch (error) {
        if (!wait) {
          setLoading(false);
        }
        //mensagem de erro diferenciada
        console.log(`%c${error.message}`, 'background: green; color: #FFF');
      }
    };

    fetchData();

    //limpeza do useEffect para evitar que a fetch atualize os estados caso a aplicação seja desmontada.
    return () => {
      wait = true;
      controller.abort(); //aborta a requesição (fetch) que está com o signal, e lança um erro do tryCatch
    };
  }, [shouldLoad]);

  return [result, loading];
};
