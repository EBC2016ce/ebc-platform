import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

const MILESTONES_BY_TYPE = {
  "New home": ["Site preparation", "Slab", "Frame", "Roof", "Lock-up", "Rough-in", "Plaster", "Fixing", "Painting", "Flooring", "Final inspections", "Handover"],
  "Kitchen renovation": ["Demolition", "Plumbing rough-in", "Electrical rough-in", "Cabinetry installed", "Benchtop installed", "Splashback/tiling", "Appliances installed", "Final clean & handover"],
  "Bathroom renovation": ["Demolition", "Plumbing rough-in", "Electrical rough-in", "Waterproofing", "Tiling", "Vanity & fixtures installed", "Shower screen installed", "Final clean & handover"],
  "Laundry renovation": ["Demolition", "Plumbing rough-in", "Electrical rough-in", "Waterproofing", "Tiling", "Joinery & trough installed", "Final clean & handover"],
}

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

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const projectType = searchParams.get('projectType')
  return Response.json({ milestonesList: MILESTONES_BY_TYPE[projectType] || [] })
}
