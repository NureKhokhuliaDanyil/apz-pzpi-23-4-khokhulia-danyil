import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { MachineStatus } from '../../../types';
import type { MachineResponseDto, CreateMachineDto, LaundryResponseDto } from '../../../types';

export function useAdminMachines() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateMachineDto>({
    laundryId: 0,
    serialNumber: '',
    model: '',
    status: MachineStatus.Idle
  });

  const { data: laundries } = useQuery({
    queryKey: ['admin-laundries'],
    queryFn: async () => {
      const res = await api.get<LaundryResponseDto[]>('/laundries');
      return res.data;
    }
  });

  const { data: machines, isLoading } = useQuery({
    queryKey: ['admin-machines'],
    queryFn: async () => {
      const res = await api.get<MachineResponseDto[]>('/machines');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: CreateMachineDto) => {
      if (editingId) {
        await api.put(`/machines/${editingId}`, data);
      } else {
        await api.post('/machines', data);
      }
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('common.success') });
      queryClient.invalidateQueries({ queryKey: ['admin-machines'] });
      closeModal();
    },
    onError: (err: any) => {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/machines/${id}`);
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('common.success') });
      queryClient.invalidateQueries({ queryKey: ['admin-machines'] });
    }
  });

  const openModal = (machine?: MachineResponseDto) => {
    if (machine) {
      setEditingId(machine.id);
      setFormData({
        laundryId: machine.laundryId,
        serialNumber: machine.serialNumber,
        model: machine.model,
        status: machine.status
      });
    } else {
      setEditingId(null);
      setFormData({ laundryId: laundries?.[0]?.id || 0, serialNumber: '', model: '', status: MachineStatus.Idle });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({...formData, laundryId: Number(formData.laundryId), status: Number(formData.status)});
  };



  return {
    t,
    msg, setMsg,
    isModalOpen, editingId,
    formData, setFormData,
    laundries, machines, isLoading,
    saveMutation, deleteMutation,
    openModal, closeModal, handleSubmit
  };
}
