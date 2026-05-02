import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Пока домен не верифицирован — используем onboarding@resend.dev
// После верификации DNS поменяем на noreply@mekendesh.online
const FROM = process.env.RESEND_FROM || 'onboarding@resend.dev'

export async function sendConfirmEmail(to: string, name: string, token: string) {
  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm?token=${token}`

  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL CONFIRM] ${to} → ${link}`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Мекендеш — Email дарегиңизди тастыктаңыз',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
        <h2 style="color:#1d4ed8;margin-bottom:8px">Саламатсызбы, ${name}!</h2>
        <p style="color:#334155;font-size:15px">Мекендеш платформасына катталганыңыз үчүн рахмат.</p>
        <p style="color:#334155;font-size:15px">Email дарегиңизди тастыктоо үчүн төмөндөгү баскычты басыңыз:</p>
        <a href="${link}" style="display:inline-block;margin:20px 0;padding:14px 28px;background:#1d4ed8;color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
          Email тастыктоо
        </a>
        <p style="color:#94a3b8;font-size:12px">Шилтеме 24 саат ичинде жарактуу. Эгер сиз катталбасаңыз — бул катты этибарга алба.</p>
      </div>
    `,
  })
}

export async function sendResetEmail(to: string, name: string, token: string) {
  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`

  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL RESET] ${to} → ${link}`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Мекендеш — Сырсөзүңүздү калыбына келтириңиз',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
        <h2 style="color:#dc2626;margin-bottom:8px">Саламатсызбы, ${name}!</h2>
        <p style="color:#334155;font-size:15px">Сырсөзүңүздү калыбына келтирүү шилтемеси:</p>
        <a href="${link}" style="display:inline-block;margin:20px 0;padding:14px 28px;background:#dc2626;color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
          Сырсөздү калыбына келтирүү
        </a>
        <p style="color:#94a3b8;font-size:12px">Шилтеме 1 саат ичинде жарактуу.</p>
      </div>
    `,
  })
}
