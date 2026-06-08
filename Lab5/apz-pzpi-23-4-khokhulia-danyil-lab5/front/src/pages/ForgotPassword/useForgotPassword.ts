import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';

export function useForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetMutation = useMutation({
    mutationFn: async (emailData: string) => {
      // Backend expects [FromBody] string email directly, handled via quotes:
      const res = await api.post('/auth/forgot-password', `"${emailData}"`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      setMsg(`${t('auth.reset_sent')}: ${data.resetToken}`); // showing token for dev purposes
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || t('common.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    resetMutation.mutate(email);
  };

  return {
    t,
    email, setEmail,
    msg, setMsg,
    errorMsg, setErrorMsg,
    isPending: resetMutation.isPending,
    handleSubmit
  };
}
