"use client"

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface adminContextType {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  optionIndex:string[]
}

// Create the context with a default value of undefined
const AdminContext = createContext<adminContextType | undefined>(undefined);

// Define the type for the provider props
interface adminContextProviderProps {
  children: ReactNode;
}

// Create a provider component
export function AdminContextProvider({ children }: adminContextProviderProps) {
  const [refresh,setRefresh] = useState<boolean>(false);
  const optionIndex = ["A","B","C","D"]

  return (
    <AdminContext.Provider value={{  refresh, setRefresh,optionIndex }}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext;
