import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, name, password, secret } = await req.json()

    console.log("===================================")
    console.log("ENV SECRET:", process.env.ADMIN_SETUP_SECRET)
    console.log("RECEIVED SECRET:", secret)
    console.log("EMAIL:", email)
    console.log("NAME:", name)
    console.log("===================================")

    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json(
        {
          error: 'Invalid secret',
          received: secret,
          expected: process.env.ADMIN_SETUP_SECRET
        },
        { status: 403 }
      )
    }

    const adminClient = await createAdminClient()

    const { data: existing } = await adminClient
      .from('admin_users')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Super admin already exists' },
        { status: 400 }
      )
    }

    const { data: newUser, error } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    await adminClient.from('admin_users').insert({
      id: newUser.user.id,
      email,
      name,
      role: 'super_admin',
      is_active: true,
    })

    await adminClient.from('categories').upsert(
      [
        {
          name: 'Action Figures',
          slug: 'action-figures',
          description: 'Premium anime & pop culture action figures',
        },
        {
          name: 'T-Shirts',
          slug: 't-shirts',
          description: 'Oversized fit streetwear',
        },
        {
          name: 'Sneakers',
          slug: 'sneakers',
          description: 'Premium sneakers and footwear',
        },
      ],
      {
        onConflict: 'slug',
        ignoreDuplicates: true,
      }
    )

    await adminClient.from('site_settings').upsert(
      {
        id: 1,
        low_stock_threshold: 5,
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully!',
    })
  } catch (err: any) {
    console.error("SETUP ERROR:", err)

    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    )
  }
}