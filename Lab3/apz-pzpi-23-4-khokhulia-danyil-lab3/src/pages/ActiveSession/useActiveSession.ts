import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';
import { useAuthStore } from '../../stores/useAuthStore';

export function useActiveSession() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [timeLeft, setTimeLeft] = useState(120); // Mock 2 minutes for demo
  const [status, setStatus] = useState<'booked'|'active'|'paused'|'completed'|'cancelled'>('booked');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (status !== 'active') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('completed');
          // Normally would call /sessions/{id}/complete here via API
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/sessions/${id}/cancel`, user?.userId, {
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      setStatus('cancelled');
    },
    onError: (err: any) => setErrorMsg(err.response?.data?.message || t('common.error'))
  });

  const beginMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/sessions/${id}/begin`, user?.userId, {
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => setStatus('active'),
    onError: (err: any) => setErrorMsg(err.response?.data?.message || t('common.error'))
  });

  const pauseMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/sessions/${id}/pause`, user?.userId, {
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => setStatus('paused'),
    onError: (err: any) => setErrorMsg(err.response?.data?.message || t('common.error'))
  });

  const resumeMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/sessions/${id}/resume`, user?.userId, {
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => setStatus('active'),
    onError: (err: any) => setErrorMsg(err.response?.data?.message || t('common.error'))
  });

  const handleCancel = () => {
    if (window.confirm(t('session.cancel_confirm'))) {
      cancelMutation.mutate();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    t,
    id,
    navigate,
    timeLeft,
    status,
    errorMsg, setErrorMsg,
    isPending: cancelMutation.isPending || beginMutation.isPending || pauseMutation.isPending || resumeMutation.isPending,
    handleCancel,
    handleBegin: () => beginMutation.mutate(),
    handlePause: () => pauseMutation.mutate(),
    handleResume: () => resumeMutation.mutate(),
    formatTime
  };
}
