import { createContext, useContext, useState } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import countries from '../data/countries';

const ExplorerContext = createContext(null);

export const ExplorerProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [exploring, setExploring] = useState(null);

  const visitCountry = async (countryCode, countryName) => {
    try {
      const { data } = await API.post('/users/visit-country', { countryCode, countryName });
      updateUser({
        visitedCountries: data.visitedCountries,
        stamps: data.stamps,
        explorerPoints: data.explorerPoints,
        achievements: data.achievements,
      });
      return data;
    } catch (error) {
      console.error('Visit country error:', error);
      throw error;
    }
  };

  const isCountryVisited = (countryCode) => {
    return user?.visitedCountries?.includes(countryCode) || false;
  };

  const getProgress = () => {
    const visited = user?.visitedCountries?.length || 0;
    const total = countries.length;
    return {
      visited,
      total,
      percentage: Math.round((visited / total) * 100),
    };
  };

  const getCountryByCode = (code) => {
    return countries.find(c => c.code === code);
  };

  return (
    <ExplorerContext.Provider value={{
      exploring,
      setExploring,
      visitCountry,
      isCountryVisited,
      getProgress,
      getCountryByCode,
      countries,
    }}>
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error('useExplorer must be used within ExplorerProvider');
  return context;
};

export default ExplorerContext;
