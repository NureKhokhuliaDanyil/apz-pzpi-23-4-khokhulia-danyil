import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../api';
import { useAuthStore } from '../../stores/useAuthStore';
import type { 
  LaundryResponseDto, 
  MachineResponseDto, 
  WashModeResponseDto, 
  PricingDetailDto,
  StartSessionDto,
  SessionResponseDto
} from '../../types';

export function useLaundryDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [selectedMachine, setSelectedMachine] = useState<MachineResponseDto | null>(null);
  const [selectedMode, setSelectedMode] = useState<WashModeResponseDto | null>(null);
  const [bookingTime, setBookingTime] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [promoCode, setPromoCode] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: laundry, isLoading: isLoadingL } = useQuery({
    queryKey: ['laundry', id],
    queryFn: async () => {
      const res = await api.get<LaundryResponseDto>(`/laundries/${id}`);
      return res.data;
    },
  });

  const { data: machines, isLoading: isLoadingM } = useQuery({
    queryKey: ['machines', id],
    queryFn: async () => {
      const res = await api.get<MachineResponseDto[]>('/machines');
      return res.data.filter(m => m.laundryId === Number(id));
    },
  });

  const { data: modes, isLoading: isLoadingModes } = useQuery({
    queryKey: ['tariffs', id],
    queryFn: async () => {
      const res = await api.get<WashModeResponseDto[]>('/tariffs');
      return res.data.filter(m => m.laundryId === Number(id));
    },
  });

  const { data: pricePreview, isLoading: isPricingLoading } = useQuery({
    queryKey: ['pricePreview', id, selectedMode?.id, user?.userId],
    queryFn: async () => {
      const res = await api.post<PricingDetailDto>(
        `/sessions/preview-price?laundryId=${id}&modeId=${selectedMode?.id}&userId=${user?.userId}`
      );
      return res.data;
    },
    enabled: !!selectedMode && !!user?.userId,
  });

  const promoMutation = useMutation({
    mutationFn: async (code: string) => {
      await api.post('/wallet/apply-promo', { userId: user?.userId, code });
    },
    onSuccess: () => {
      setPromoSuccess(true);
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || t('laundry_detail.promo_error'));
    }
  });

  const startMutation = useMutation({
    mutationFn: async (data: StartSessionDto) => {
      const res = await api.post<SessionResponseDto>('/sessions/start', data);
      return res.data;
    },
    onSuccess: (data) => {
      navigate(`/session/${data.id}`);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || t('laundry_detail.insufficient_balance'));
    }
  });

  const handleApplyPromo = () => {
    if (promoCode) promoMutation.mutate(promoCode);
  };

  const handleStart = () => {
    if (selectedMachine && selectedMode && user) {
      startMutation.mutate({ 
        userId: user.userId,
        machineId: selectedMachine.id, 
        modeId: selectedMode.id, 
        startTime: bookingTime || undefined 
      });
    }
  };

  const closeDialog = () => {
    setSelectedMachine(null);
    setSelectedMode(null);
    setPromoCode('');
    setPromoSuccess(false);
    setErrorMsg('');
  };

  return {
    t,
    navigate,
    isAuthenticated,
    laundry, isLoadingL,
    machines, isLoadingM,
    modes, isLoadingModes,
    filterStatus, setFilterStatus,
    bookingTime, setBookingTime,
    pricePreview, isPricingLoading,
    selectedMachine, setSelectedMachine,
    selectedMode, setSelectedMode,
    promoCode, setPromoCode,
    promoSuccess,
    errorMsg,
    promoMutation,
    startMutation,
    handleApplyPromo,
    handleStart,
    closeDialog
  };
}
