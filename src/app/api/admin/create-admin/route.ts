import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: currentAdmin } = await supabase
      .from('admin_users').select('role').eq('id', user.id).single()

    if (currentAdmin?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can create admins' }, { status: 403 })
    }

    const { email, name, password, role } = await req.json()
    const adminClient = await createAdminClient()

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) return NextResponse.json({ error: createError.message }, { status: 400 })

    await adminClient.from('admin_users').insert({
      id: newUser.user.id,
      email,
      name,
      role: role || 'admin',
      is_active: true,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
