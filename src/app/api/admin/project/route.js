import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

const MILESTONES = ["Site preparation", "Slab", "Frame", "Roof", "Lock-up", "Rough-in", "Plaster", "Fixing", "Painting", "Flooring", "Final inspections", "Handover"]

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const { action, customerId, stage, milestone, updateText } = await request.json()

    if (action === 'updateStage') {
      const { error } = await supabaseAdmin.from('projects').update({ stage }).eq('customer_id', customerId)
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    if (action === 'toggleMilestone') {
      const { data: project } = await supabaseAdmin.from('projects').select('milestones').eq('customer_id', customerId).single()
      const milestones = { ...(project?.milestones || {}) }
      milestones[milestone] = !milestones[milestone]
      const { error } = await supabaseAdmin.from('projects').update({ milestones }).eq('customer_id', customerId)
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    if (action === 'addUpdate') {
      const { error } = await supabaseAdmin.from('project_updates').insert([{ customer_id: customerId, update_text: updateText }])
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ success: true, milestonesList: MILESTONES })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({ milestonesList: MILESTONES })
}
