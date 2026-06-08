import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import type { SystemStatsDto, RevenueStatsDto } from '../../../types';

export function useAdminDashboard() {
  const { t } = useTranslation();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get<SystemStatsDto>('/admin/stats');
      return res.data;
    }
  });

  const { data: revenue, isLoading: isLoadingRev } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const res = await api.get<RevenueStatsDto>('/admin/revenue');
      return res.data;
    }
  });

  return {
    t,
    stats,
    isLoadingStats,
    revenue,
    isLoadingRev
  };
}
