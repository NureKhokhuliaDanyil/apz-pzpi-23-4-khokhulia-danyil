import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { UpdateUserDto, UserResponseDto } from '../../types';

export function useProfile() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { theme, lang, setTheme, setLang } = useSettingsStore();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: async () => {
      const res = await api.get<UserResponseDto>(`/users/${user?.userId}`);
      return res.data;
    },
    enabled: !!user?.userId,
  });

  return {
    t,
    theme, lang, setTheme, setLang,
    userData, isUserLoading
  };
}
