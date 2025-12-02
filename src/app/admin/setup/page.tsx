'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FiCheckCircle, FiAlertCircle, FiExternalLink } from 'react-icons/fi'

export default function AdminSetupPage() {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const testImageUpload = async () => {
    setTestStatus('testing')
    setErrorMessage('')

    try {
      // Criar uma imagem de teste (1x1 pixel transparente)
      const blob = await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
        .then(res => res.blob())

      const testFile = new File([blob], 'test.png', { type: 'image/png' })

      // Importar função de upload
      const { uploadImage } = await import('@/lib/supabase')

      // Tentar fazer upload
      const url = await uploadImage(testFile, 'products')

      if (url) {
        setTestStatus('success')
      }
    } catch (error: any) {
      console.error('Test error:', error)
      setTestStatus('error')
      setErrorMessage(error.message || 'Erro desconhecido')
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuração do Storage</h1>
        <p className="text-gray-600 mt-2">Configure o bucket de imagens no Supabase</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Status do Storage</h2>
          <Button onClick={testImageUpload} isLoading={testStatus === 'testing'}>
            Testar Upload
          </Button>
        </div>

        {testStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-green-900">Storage configurado corretamente!</p>
              <p className="text-sm text-green-700 mt-1">O upload de imagens está funcionando.</p>
            </div>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-red-900">Erro no Storage</p>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              <p className="text-sm text-red-700 mt-2">Siga as instruções abaixo para configurar.</p>
            </div>
          </div>
        )}

        {testStatus === 'idle' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-yellow-900">Storage não testado</p>
              <p className="text-sm text-yellow-700 mt-1">Clique em "Testar Upload" para verificar se o bucket está configurado.</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Como Configurar o Bucket no Supabase</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Acesse o Supabase Dashboard</h3>
              <p className="text-gray-600 mb-3">
                Vá para o painel do Supabase e faça login com sua conta:
              </p>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                https://supabase.com/dashboard
                <FiExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Selecione seu Projeto</h3>
              <p className="text-gray-600">
                Clique no projeto: <code className="bg-gray-100 px-2 py-1 rounded text-sm">pwrpkrfyuwxcvufsqbju</code>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Vá para Storage</h3>
              <p className="text-gray-600">
                No menu lateral esquerdo, clique em <strong>Storage</strong>
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Crie um Novo Bucket</h3>
              <p className="text-gray-600 mb-3">
                Clique em <strong>"New bucket"</strong> ou <strong>"Create a new bucket"</strong>
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <p className="text-sm"><strong>Nome do bucket:</strong> <code className="bg-white px-2 py-1 rounded">products</code></p>
                <p className="text-sm"><strong>Public bucket:</strong> ✅ Marque esta opção</p>
                <p className="text-sm"><strong>File size limit:</strong> 5 MB (opcional)</p>
                <p className="text-sm"><strong>Allowed MIME types:</strong> image/png, image/jpeg, image/jpg, image/webp, image/gif (opcional)</p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Configure as Políticas (RLS) - IMPORTANTE!</h3>
              <p className="text-gray-600 mb-3">
                Após criar o bucket "products", você PRECISA configurar as políticas de acesso:
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">📋 Passo a passo:</p>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Clique no bucket <strong>"products"</strong> na lista de buckets</li>
                  <li>Clique na aba <strong>"Policies"</strong> (ao lado de "Objects")</li>
                  <li>Você verá "No policies yet" - clique em <strong>"New policy"</strong></li>
                  <li>Escolha o template: <strong>"Allow public read access"</strong></li>
                  <li>Clique em <strong>"Review"</strong> e depois <strong>"Save policy"</strong></li>
                </ol>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-orange-900 mb-2">🔧 Alternativa - Criar política manualmente:</p>
                <p className="text-sm text-orange-800 mb-3">Se preferir criar manualmente, crie 2 políticas:</p>

                <div className="bg-white rounded p-3 mb-3 border border-orange-300">
                  <p className="text-xs font-bold text-gray-700 mb-1">Política 1: Upload (INSERT)</p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                    <li><strong>Policy name:</strong> Allow public upload</li>
                    <li><strong>Allowed operation:</strong> INSERT</li>
                    <li><strong>Target roles:</strong> public</li>
                    <li><strong>USING expression:</strong> <code className="bg-gray-100 px-1">true</code></li>
                  </ul>
                </div>

                <div className="bg-white rounded p-3 border border-orange-300">
                  <p className="text-xs font-bold text-gray-700 mb-1">Política 2: Leitura (SELECT)</p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                    <li><strong>Policy name:</strong> Allow public read</li>
                    <li><strong>Allowed operation:</strong> SELECT</li>
                    <li><strong>Target roles:</strong> public</li>
                    <li><strong>USING expression:</strong> <code className="bg-gray-100 px-1">true</code></li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-900 font-medium mb-1">❌ Sem essas políticas o upload VAI FALHAR!</p>
                <p className="text-xs text-red-700">
                  O erro será "new row violates row-level security policy"
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              6
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Teste a Configuração</h3>
              <p className="text-gray-600 mb-3">
                Volte para esta página e clique em <strong>"Testar Upload"</strong> para verificar se está tudo funcionando.
              </p>
              <Button onClick={testImageUpload} isLoading={testStatus === 'testing'}>
                Testar Upload Agora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Link */}
      <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Link Direto para o Storage</h3>
        <p className="text-primary-100 mb-4">
          Acesse diretamente a página de Storage do seu projeto:
        </p>
        <a
          href="https://supabase.com/dashboard/project/pwrpkrfyuwxcvufsqbju/storage/buckets"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          Abrir Storage no Supabase
          <FiExternalLink size={16} />
        </a>
      </div>
    </div>
  )
}
