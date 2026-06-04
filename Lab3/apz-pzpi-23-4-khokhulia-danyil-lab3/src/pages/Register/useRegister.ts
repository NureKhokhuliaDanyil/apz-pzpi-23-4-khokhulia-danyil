import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';
import { UserRole } from '../../types';
import type { RegisterUserDto } from '../../types';

export function useRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterUserDto) => {
      const res = await api.post('/auth/register', data);
      return res.data;
    },
    onSuccess: () => {
      setSuccessMsg(t('auth.register_success'));
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || t('auth.error_exists'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg(t('auth.passwords_mismatch'));
      return;
    }
    registerMutation.mutate({ fullName, email, password, role: UserRole.Client });
  };

  return {
    t,
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    errorMsg, setErrorMsg,
    successMsg, setSuccessMsg,
    isPending: registerMutation.isPending,
    handleSubmit
  };
}
