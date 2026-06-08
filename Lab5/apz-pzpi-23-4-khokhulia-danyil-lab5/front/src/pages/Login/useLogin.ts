import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';
import { useAuthStore } from '../../stores/useAuthStore';
import type { LoginDto, LoginResponseDto } from '../../types';

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const res = await api.post<LoginResponseDto>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.token, {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });
      navigate('/laundries');
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || t('auth.error_invalid'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    loginMutation.mutate({ email, password });
  };

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    errorMsg,
    setErrorMsg,
    isPending: loginMutation.isPending,
    handleSubmit
  };
}
