import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import type { LaundryResponseDto } from '../../types';

export function useLaundries() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: laundries, isLoading, isError } = useQuery({
    queryKey: ['laundries'],
    queryFn: async () => {
      const res = await api.get<LaundryResponseDto[]>('/laundries');
      return res.data;
    },
  });

  const filtered = laundries?.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                          l.address.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return {
    t,
    navigate,
    search,
    setSearch,
    filtered,
    isLoading,
    isError
  };
}
