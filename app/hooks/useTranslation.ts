
'use client';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

// Cache for loaded translations
const translationCache: Record<string, Record<string, string>> = {};

export const useTranslation = () => {
  const { language } = useUser();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      // Check if translations are already cached
      if (translationCache[language]) {
        setTranslations(translationCache[language]);
        setIsLoading(false);
        return;
      }

      try {
        // Dynamic import of the JSON file
        const translationModule = await import(`../../locales/${language}.json`);
        translationCache[language] = translationModule.default || translationModule;
        setTranslations(translationCache[language]);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        
        // Fallback to English if the requested language fails
        if (language !== 'en') {
          try {
            const fallbackModule = await import('../../locales/en.json');
            translationCache[language] = fallbackModule.default || fallbackModule;
            setTranslations(translationCache[language]);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
            setTranslations({});
          }
        } else {
          setTranslations({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (isLoading) return key; // Return key while loading
    
    let translation = translations[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  return { t, language, isLoading };
};

// Helper function for server components (if needed)
export const getServerTranslations = async (language: string) => {
  try {
    // This would work differently in server components
    // For client components, we use dynamic imports as above
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'locales', `${language}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Failed to load server translations for ${language}:`, error);
    return {};
  }
};