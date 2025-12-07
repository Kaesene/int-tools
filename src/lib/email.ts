import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY nao configurada, pulando envio de email')
      return { success: false, error: 'API key not configured' }
    }

    const fromEmail = process.env.EMAIL_FROM || 'INT Tools <noreply@inttools.com.br>'

    console.log('📧 Enviando email:', { to, subject, from: fromEmail })

    const data = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    })

    console.log('✅ Email enviado com sucesso:', data)

    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Erro ao enviar email:', error)
    return { success: false, error: error.message }
  }
}

// Template base para emails
export function emailTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>INT Tools</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">INT TOOLS</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    ${content}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      <strong>INT Tools</strong><br>
                      Ferramentas e Equipamentos de Qualidade
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      <a href="https://www.inttools.com.br" style="color: #667eea; text-decoration: none;">www.inttools.com.br</a>
                    </p>
                    <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px;">
                      Voce esta recebendo este email porque fez um pedido em nossa loja.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

// Email de confirmacao de pedido
export function orderConfirmationEmail(data: {
  orderNumber: string
  customerName: string
  total: string
  items: Array<{ name: string; quantity: number; price: string }>
  orderUrl: string
}) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <span style="color: #6b7280; font-size: 14px;">Quantidade: ${item.quantity}</span>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${item.price}
      </td>
    </tr>
  `
    )
    .join('')

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">Pedido Confirmado!</h2>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Ola <strong>${data.customerName}</strong>,
    </p>

    <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Recebemos seu pedido <strong>#${data.orderNumber}</strong> e estamos processando o pagamento.
    </p>

    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Resumo do Pedido</h3>

      <table width="100%" cellpadding="0" cellspacing="0">
        ${itemsHtml}
        <tr>
          <td style="padding: 15px 0 0 0;">
            <strong style="font-size: 18px; color: #111827;">Total:</strong>
          </td>
          <td style="padding: 15px 0 0 0; text-align: right;">
            <strong style="font-size: 18px; color: #667eea;">${data.total}</strong>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Voce pode acompanhar o status do seu pedido clicando no botao abaixo:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.orderUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Ver Meu Pedido
      </a>
    </div>

    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Qualquer duvida, responda este email ou entre em contato conosco.
    </p>
  `

  return emailTemplate(content)
}

// Email de pagamento aprovado
export function paymentApprovedEmail(data: {
  orderNumber: string
  customerName: string
  orderUrl: string
}) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #10b981; border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px;">
        <span style="color: white; font-size: 40px;">✓</span>
      </div>
      <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">Pagamento Aprovado!</h2>
    </div>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Ola <strong>${data.customerName}</strong>,
    </p>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Seu pagamento do pedido <strong>#${data.orderNumber}</strong> foi aprovado com sucesso!
    </p>

    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #065f46; font-size: 14px;">
        <strong>Proximo passo:</strong> Estamos preparando seu pedido para envio. Voce recebera um novo email assim que ele for despachado.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.orderUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Acompanhar Pedido
      </a>
    </div>

    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Obrigado por comprar na INT Tools!
    </p>
  `

  return emailTemplate(content)
}

// Email de pedido enviado
export function orderShippedEmail(data: {
  orderNumber: string
  customerName: string
  trackingCode: string
  trackingUrl: string
  orderUrl: string
}) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #3b82f6; border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px;">
        <span style="color: white; font-size: 40px;">📦</span>
      </div>
      <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">Pedido Enviado!</h2>
    </div>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Ola <strong>${data.customerName}</strong>,
    </p>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Seu pedido <strong>#${data.orderNumber}</strong> foi enviado!
    </p>

    <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">Codigo de Rastreamento:</h3>
      <div style="background-color: #ffffff; border: 2px dashed #3b82f6; padding: 15px; border-radius: 6px; text-align: center;">
        <code style="font-size: 20px; font-weight: bold; color: #1e40af; letter-spacing: 2px;">${data.trackingCode}</code>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.trackingUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-right: 10px;">
        Rastrear Entrega
      </a>
      <a href="${data.orderUrl}" style="display: inline-block; background-color: #6b7280; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Ver Pedido
      </a>
    </div>

    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Acompanhe a entrega pelos Correios usando o codigo acima.
    </p>
  `

  return emailTemplate(content)
}

// Email de pedido entregue
export function orderDeliveredEmail(data: {
  orderNumber: string
  customerName: string
  orderUrl: string
}) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #10b981; border-radius: 50%; width: 80px; height: 80px; line-height: 80px; margin-bottom: 20px;">
        <span style="color: white; font-size: 40px;">🎉</span>
      </div>
      <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">Pedido Entregue!</h2>
    </div>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Ola <strong>${data.customerName}</strong>,
    </p>

    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Seu pedido <strong>#${data.orderNumber}</strong> foi entregue com sucesso!
    </p>

    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #065f46; font-size: 14px;">
        <strong>Esperamos que voce esteja satisfeito com sua compra!</strong>
      </p>
      <p style="margin: 0; color: #065f46; font-size: 14px;">
        Se tiver algum problema com o produto, entre em contato conosco em ate 7 dias.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.orderUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Ver Detalhes do Pedido
      </a>
    </div>

    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
      Obrigado por comprar na INT Tools!<br>
      Esperamos ve-lo novamente em breve.
    </p>
  `

  return emailTemplate(content)
}
