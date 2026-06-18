import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    const email = email_addresses?.[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'Estudiante'

    // Save to UserProfile DB
    await db.userProfile.create({
      data: {
        userId: id,
        name: name,
        email: email,
      }
    });

    if (email && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'InfraCode Academy <soporte@infracode.com>', // User needs a verified domain for Resend to use their own email
          to: [email],
          subject: '¡Bienvenido a InfraCode Academy! 🚀',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>¡Hola ${name}! 👋</h2>
              <p>Queremos darte la más cordial bienvenida a <strong>InfraCode Academy</strong>.</p>
              <p>Nuestra misión es llevar tus habilidades tecnológicas al siguiente nivel con contenido de Silicon Valley, creado en español.</p>
              <p>¿Qué sigue?</p>
              <ul>
                <li>Explora nuestro catálogo de cursos.</li>
                <li>Únete a las discusiones en los foros.</li>
                <li>Gana puntos y obtén certificados válidos en LinkedIn.</li>
              </ul>
              <p>Si tienes alguna duda, no dudes en responder este correo.</p>
              <br/>
              <p>Saludos,</p>
              <p><strong>El equipo de InfraCode</strong></p>
            </div>
          `
        });
      } catch (error) {
        console.error("Error sending welcome email", error);
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses?.[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ')

    await db.userProfile.update({
      where: { userId: id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    }).catch(() => null);
  }

  return new Response('', { status: 200 })
}
