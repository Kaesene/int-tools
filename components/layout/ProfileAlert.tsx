'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ProfileAlert() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [missingData, setMissingData] = useState<string[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if alert was dismissed in this session
    const dismissed = sessionStorage.getItem('profile-alert-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Only check for logged in customers (not admins)
    if (status === 'loading' || !session?.user || session.user.role === 'ADMIN') {
      setIsVisible(false);
      return;
    }

    // Fetch user data to check completeness
    const checkProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();

        const missing: string[] = [];

        if (!data.cpf) missing.push('CPF');
        if (!data.phone) missing.push('Telefone');
        if (!data.addresses || data.addresses.length === 0) missing.push('Endereço');

        setMissingData(missing);
        setIsVisible(missing.length > 0);
      } catch (error) {
        console.error('Erro ao verificar perfil:', error);
      }
    };

    checkProfile();
  }, [session, status]);

  const handleDismiss = () => {
    sessionStorage.setItem('profile-alert-dismissed', 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-800 mb-1">
              Complete seu cadastro
            </h3>
            <p className="text-sm text-yellow-700">
              Faltam alguns dados no seu perfil: <strong>{missingData.join(', ')}</strong>.
              Complete agora para agilizar suas compras!
            </p>
            <Link
              href="/perfil"
              className="inline-block mt-2 text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline"
            >
              Completar cadastro →
            </Link>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-yellow-600 hover:text-yellow-800 transition-colors flex-shrink-0"
          aria-label="Fechar alerta"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
