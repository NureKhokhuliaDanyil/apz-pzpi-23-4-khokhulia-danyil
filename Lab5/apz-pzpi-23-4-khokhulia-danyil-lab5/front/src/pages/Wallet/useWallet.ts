import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { useAuthStore } from '../../stores/useAuthStore';
import type { TransactionResponseDto } from '../../types';

export function useWallet() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Fetch updated user data for exact balance
  const { data: userData } = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: async () => {
      const res = await api.get<any>(`/users/${user?.userId}`);
      return res.data;
    },
    enabled: !!user?.userId,
  });

  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', user?.userId],
    queryFn: async () => {
      const res = await api.get<TransactionResponseDto[]>('/transactions');
      // Filter by user ID
      return res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    enabled: !!user?.userId,
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      await api.post('/wallet/deposit', { userId: user?.userId, amount });
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('wallet.deposit_success') });
      setDepositAmount('');
      queryClient.invalidateQueries({ queryKey: ['user', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.userId] });
    },
    onError: (err: any) => {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    }
  });

  const promoMutation = useMutation({
    mutationFn: async (code: string) => {
      await api.post('/wallet/apply-promo', { userId: user?.userId, code });
    },
    onSuccess: () => {
      setMsg({ type: 'success', text: t('wallet.promo_success') });
      setPromoCode('');
      queryClient.invalidateQueries({ queryKey: ['user', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.userId] });
    },
    onError: (err: any) => {
      setMsg({ type: 'error', text: err.response?.data?.message || t('laundry_detail.promo_error') });
    }
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (amt > 0) depositMutation.mutate(amt);
  };

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) promoMutation.mutate(promoCode);
  };

  const balance = userData?.balance ?? 0;

  return {
    t,
    depositAmount, setDepositAmount,
    promoCode, setPromoCode,
    msg, setMsg,
    transactions, isLoading,
    depositMutation, promoMutation,
    handleDeposit, handlePromo,
    balance
  };
}
