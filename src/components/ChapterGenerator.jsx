import { useEffect, useMemo, useState } from 'react'

export default function ChapterGenerator({ project }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [chapters, setChapters] = useState([])
  const [selected, setSelected] = useState(1)
  const [plan, setPlan] = useState(null)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [overridePOV, setOverridePOV] = useState('')
  const [message, setMessage] = useState('')

  const fetchChapters = async () => {
    const res = await fetch(`${baseUrl}/api/projects/${project.id}/chapters`)
    const data = await res.json()
    setChapters(data)
  }

  useEffect(() => { fetchChapters() }, [project.id])

  const prepare = async () => {
    setMessage('')
    setPlan(null)
    const res = await fetch(`${baseUrl}/api/chapters/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: project.id, number: selected, override_pov: overridePOV || null })
    })
    if (!res.ok) {
      setMessage('Failed to prepare generation')
      return
    }
    const data = await res.json()
    setPlan(data)
    setTitle(data.chapter_title)
  }

  const save = async () => {
    if (!content) { setMessage('Please paste or write the chapter content before saving.'); return }
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`${baseUrl}/api/chapters/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id, number: selected, title, content, pov_used: plan?.resolved_pov })
      })
      const data = await res.json()
      setMessage(`Saved. Word count: ${data.word_count}`)
      fetchChapters()
    } catch (e) {
      setMessage('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const wc = useMemo(() => content.split(/\s+/).filter(Boolean).length, [content])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {Array.from({ length: project.chapter_count }).map((_, i) => (
          <button key={i} onClick={() => setSelected(i+1)} className={`px-3 py-1.5 rounded border ${selected===i+1 ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900/60 text-blue-100 border-blue-500/30'}`}>
            Chapter {i+1}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label className="text-blue-200 text-sm">Override POV</label>
          <select value={overridePOV} onChange={e=>setOverridePOV(e.target.value)} className="bg-slate-900/60 border border-blue-500/30 rounded px-2 py-1 text-blue-50">
            <option value="">Auto</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2 space-y-3">
            <button onClick={prepare} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded">Prepare Chapter</button>
            {plan && (
              <div className="space-y-3">
                <div>
                  <h4 className="text-blue-200 font-semibold">Resolved POV</h4>
                  <p className="text-blue-100/80 text-sm">{plan.resolved_pov}</p>
                </div>
                <div>
                  <h4 className="text-blue-200 font-semibold">System Rules</h4>
                  <pre className="whitespace-pre-wrap text-blue-100/80 text-xs bg-slate-900/50 p-3 rounded border border-blue-500/20 max-h-64 overflow-auto">{plan.system_rules}</pre>
                </div>
                <div>
                  <h4 className="text-blue-200 font-semibold">User Prompt</h4>
                  <pre className="whitespace-pre-wrap text-blue-100/80 text-xs bg-slate-900/50 p-3 rounded border border-blue-500/20 max-h-64 overflow-auto">{plan.user_prompt}</pre>
                </div>
              </div>
            )}
          </div>
          <div className="md:w-1/2 space-y-3">
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50" placeholder="Chapter Title" />
            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={16} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50" placeholder="Paste generated chapter here (1400–1800 words)" />
            <div className="flex items-center justify-between text-sm">
              <p className={wc<1400 || wc>1800 ? 'text-red-300' : 'text-green-300'}>Word Count: {wc}</p>
              <button disabled={saving} onClick={save} className="bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-3 rounded disabled:opacity-60">{saving ? 'Saving...' : 'Save Chapter'}</button>
            </div>
            {message && <p className="text-blue-200 text-sm">{message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded p-4">
        <h4 className="text-blue-200 font-semibold mb-2">Saved Chapters</h4>
        <div className="grid gap-3">
          {chapters.map(ch => (
            <div key={ch.number} className="p-3 bg-slate-900/40 border border-blue-500/20 rounded">
              <div className="flex items-center justify-between">
                <div className="text-blue-100">Chapter {ch.number} {ch.title ? `— ${ch.title}` : ''}</div>
                <div className="text-xs text-blue-200/70">{ch.pov_used || 'auto'} • {ch.status} • {ch.word_count || 0} words</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
