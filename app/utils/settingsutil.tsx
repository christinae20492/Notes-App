import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    colorScheme: 'light',
    useRichTextEditor: true,
  });

  const toggleColorScheme = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      colorScheme: prevSettings.colorScheme === 'light' ? 'dark' : 'light',
    }));
  };

  const toggleRichTextEditor = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      useRichTextEditor: !prevSettings.useRichTextEditor,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleColorScheme, toggleRichTextEditor }}>
      {children}
    </SettingsContext.Provider>
  );
};
