"use client";
import { createContext, useContext, useState } from "react";

const BoxesContext = createContext();

export function BoxesProvider({ children }) {
  const [boxes, setBoxes] = useState([]);

  function addNewBox(newBox) {
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
  }

  return (
    <BoxesContext.Provider value={{ boxes, addNewBox }}>
      {children}
    </BoxesContext.Provider>
  );
}

export function useBoxes() {
  return useContext(BoxesContext);
}
