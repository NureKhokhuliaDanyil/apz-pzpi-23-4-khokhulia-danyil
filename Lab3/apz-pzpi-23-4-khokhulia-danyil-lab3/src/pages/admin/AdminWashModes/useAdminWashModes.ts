import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import type { WashModeResponseDto, CreateWashModeDto, LaundryResponseDto } from '../../../types';

export function useAdminWashModes() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateWashModeDto>({
    laundryId: 0,
    name: '',
    price: 0,
    durationMinutes: 30,
    temperature: 40
  });

  const { data: laundries } = useQuery({
    queryKey: ['admin-laundries'],
    queryFn: async () => {
      const res = await api.get<LaundryResponseDto[]>('/laundries');
      return res.data;
    }
  });

  const { data: modes, isLoading } = useQuery({
    queryKey: ['admin-modes'],
    queryFn: async () => {
      const res = await api.get<WashModeResponseDto[]>('/tariffs');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: CreateWashModeDto) => {
      if (editingId) {
        await api.put(`/tariffs/${editingId}`, data);
      } else {
        await api.post('/tariffs', data);
      }
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('common.success') });
      queryClient.invalidateQueries({ queryKey: ['admin-modes'] });
      closeModal();
    },
    onError: (err: any) => {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tariffs/${id}`);
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('common.success') });
      queryClient.invalidateQueries({ queryKey: ['admin-modes'] });
    }
  });

  const openModal = (mode?: WashModeResponseDto) => {
    if (mode) {
      setEditingId(mode.id);
      setFormData({
        laundryId: mode.laundryId,
        name: mode.name,
        price: mode.price,
        durationMinutes: mode.durationMinutes,
        temperature: mode.temperature
      });
    } else {
      setEditingId(null);
      setFormData({ laundryId: laundries?.[0]?.id || 0, name: '', price: 0, durationMinutes: 30, temperature: 40 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({...formData, laundryId: Number(formData.laundryId), price: Number(formData.price), durationMinutes: Number(formData.durationMinutes), temperature: Number(formData.temperature)});
  };

  return {
    t,
    msg, setMsg,
    isModalOpen, editingId,
    formData, setFormData,
    laundries, modes, isLoading,
    saveMutation, deleteMutation,
    openModal, closeModal, handleSubmit
  };
}
