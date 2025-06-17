// client/src/components/ui/tabs.jsx

import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export const Tabs = ({ defaultValue, children }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children }) => (
  <div className="flex border-b border-gray-200 space-x-4 mb-4">{children}</div>
);

export const TabsTrigger = ({ value, children }) => {
  const { value: currentValue, setValue } = useContext(TabsContext);
  const isActive = currentValue === value;

  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-200 ${
        isActive
          ? "bg-white border border-b-transparent shadow text-blue-600"
          : "bg-gray-100 text-gray-500 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }) => {
  const { value: currentValue } = useContext(TabsContext);
  if (currentValue !== value) return null;
  return <div className="bg-white p-4 rounded-b-lg shadow">{children}</div>;
};
