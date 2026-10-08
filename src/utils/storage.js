const PROFILE_KEY = 'finpilot_profile';

export const saveProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Error saving profile to localStorage", error);
    return false;
  }
};

export const loadProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading profile from localStorage", error);
    return null;
  }
};

export const clearProfile = () => {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing profile", error);
  }
};
