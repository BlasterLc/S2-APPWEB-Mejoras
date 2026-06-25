import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import {
  listarProductos,
  listarPedidos,
  listarRetiros,
  adaptarRetiroDesdeApi
} from "../services/api";

const RetiroContext = createContext();

export function RetiroProvider({ children }) {

  const [retiros, setRetiros] = useState([]);

  useEffect(() => {

    Promise.all([listarProductos(), listarPedidos(), listarRetiros()])
      .then(([productos, pedidos, retirosApi]) => {

        setRetiros(
          retirosApi.map((retiro) =>
            adaptarRetiroDesdeApi(retiro, pedidos, productos)
          )
        );

      })
      .catch(() => {
        // Si el backend no responde, el dashboard arranca vacío en vez de romper.
        setRetiros([]);
      });

  }, []);

  return (
    <RetiroContext.Provider
      value={{
        retiros,
        setRetiros
      }}
    >
      {children}
    </RetiroContext.Provider>
  );
}

export function useRetiros() {
  return useContext(RetiroContext);
}