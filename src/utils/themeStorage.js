// utils/themeStorage.js

export const saveTheme = (themeName) => {
  try {
    localStorage.setItem('userTheme', themeName);
    console.log('Theme saved to localStorage:', themeName);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
};

export const loadTheme = () => {
  try {
    const theme = localStorage.getItem('userTheme');
    console.log('Theme loaded from localStorage:', theme);
    return theme;
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return null;
  }
};