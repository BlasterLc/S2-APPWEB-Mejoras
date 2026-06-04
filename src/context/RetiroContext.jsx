import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

const RetiroContext = createContext();

export function RetiroProvider({ children }) {

  const [retiros, setRetiros] = useState(() => {

    const guardados =
      localStorage.getItem("retiros");

    return guardados
      ? JSON.parse(guardados)
      : [];

  });

  useEffect(() => {

    localStorage.setItem(
      "retiros",
      JSON.stringify(retiros)
    );

  }, [retiros]);

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