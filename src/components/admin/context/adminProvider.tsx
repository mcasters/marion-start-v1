import { createContext, ReactNode, useContext, useState } from "react";
import { PresetColor, Theme } from "~/lib/type";

export interface AdminContextType {
  workTheme: Theme;
  setWorkTheme: React.Dispatch<React.SetStateAction<Theme>>;
  isSaved: boolean;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
  themes: Theme[];
  setThemes: React.Dispatch<React.SetStateAction<Theme[]>>;
  presetColors: PresetColor[];
  setPresetColors: React.Dispatch<React.SetStateAction<PresetColor[]>>;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

interface Props {
  defaultWorkTheme: Theme;
  defaultThemes: Theme[];
  defaultPresetColors: PresetColor[];
  children: ReactNode;
}

export function AdminProvider({
  defaultWorkTheme,
  defaultThemes,
  defaultPresetColors,
  children,
}: Props) {
  const [workTheme, setWorkTheme] = useState<Theme>(defaultWorkTheme);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [presetColors, setPresetColors] =
    useState<PresetColor[]>(defaultPresetColors);

  return (
    <AdminContext.Provider
      value={{
        workTheme,
        setWorkTheme,
        isSaved,
        setIsSaved,
        themes,
        setThemes,
        presetColors,
        setPresetColors,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}
