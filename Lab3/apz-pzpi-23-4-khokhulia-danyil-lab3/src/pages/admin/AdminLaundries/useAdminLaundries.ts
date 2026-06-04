import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import type { LaundryResponseDto, CreateLaundryDto } from '../../../types';

export function useAdminLaundries() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateLaundryDto>({
    ownerId: 1, // Defaulting to 1 for admin/owner
    name: '',
    address: '',
    workingHours: ''
  });

  const { data: laundries, isLoading } = useQuery({
    queryKey: ['admin-laundries'],
    queryFn: async () => {
      const res = await api.get<LaundryResponseDto[]>('/laundries');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: CreateLaundryDto) => {
      if (editingId) {
        await api.put(`/laundries/${editingId}`, data);
      } else {
        await api.post('/laundries', data);
      }
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('common.success') });
      queryClient.invalidateQueries({ queryKey: ['admin-laundries'] });
      closeModal();
    },
    onError: (err: any) => {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/laundries/${id}`);
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('common.success') });
      queryClient.invalidateQueries({ queryKey: ['admin-laundries'] });
    }
  });

  const openModal = (laundry?: LaundryResponseDto) => {
    if (laundry) {
      setEditingId(laundry.id);
      setFormData({
        ownerId: laundry.ownerId,
        name: laundry.name,
        address: laundry.address,
        workingHours: laundry.workingHours
      });
    } else {
      setEditingId(null);
      setFormData({ ownerId: 1, name: '', address: '', workingHours: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return {
    t,
    msg, setMsg,
    isModalOpen,
    editingId,
    formData, setFormData,
    laundries, isLoading,
    saveMutation, deleteMutation,
    openModal, closeModal, handleSubmit
  };
}
