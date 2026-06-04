import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { UserRole } from '../../../types';
import type { UserResponseDto } from '../../../types';

export function useAdminUsers() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get<UserResponseDto[]>('/users');
      return res.data;
    }
  });

  const blockMutation = useMutation({
    mutationFn: async (userId: number) => {
      await api.post(`/admin/block-user/${userId}`);
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('admin.user_mgmt.user_blocked') });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('admin.user_mgmt.user_deleted') });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const filtered = users?.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toString() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return {
    t,
    search, setSearch,
    roleFilter, setRoleFilter,
    msg, setMsg,
    isLoading,
    filtered,
    blockMutation,
    deleteMutation
  };
}
