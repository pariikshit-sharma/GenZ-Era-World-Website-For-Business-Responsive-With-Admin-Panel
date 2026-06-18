import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').single()

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl text-white tracking-wider mb-8">SETTINGS</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
