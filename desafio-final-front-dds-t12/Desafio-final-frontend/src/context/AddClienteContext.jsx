import { createContext, useContext, useState } from "react";

const AddClientContext = createContext();

export function useAddClientContext() {
  return useContext(AddClientContext);
}

export function AddClientContextProvider({ children }) {
  const [clients, setClients] = useState([]);

  function openClientAddCharge(id) {
    const client = clients.find((client) => client.id === id);

    setClientDataDetails({ ...clientDataDetails, client: client, id: id });

    handleOpenModalCharges(true);
  }

  return (
    <AddClientContext.Provider
      value={{
        clients,
        setClients,
        openClientAddCharge,
      }}
    >
      {children}
    </AddClientContext.Provider>
  );
}
