import { useState } from 'react'
import POVRules from './POVRules'

export default function ProjectForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [outline, setOutline] = useState('')
  const [chapterCount, setChapterCount] = useState(3)
  const [povMode, setPovMode] = useState('female')
  const [genre, setGenre] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const createProject = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, outline, chapter_count: Number(chapterCount), pov_mode: povMode, genre })
      })
      if (!res.ok) throw new Error('Failed to create project')
      const data = await res.json()
      onCreated?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={createProject} className="space-y-6">
      <div>
        <label className="block text-blue-200 text-sm mb-1">Project Title (optional)</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50 placeholder-blue-200/50" placeholder="e.g., Broken Vows" />
      </div>

      <div>
        <label className="block text-blue-200 text-sm mb-1">Outline Input</label>
        <textarea value={outline} onChange={e=>setOutline(e.target.value)} required rows={10} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50 placeholder-blue-200/50" placeholder="Paste or write your outline here..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-blue-200 text-sm mb-1">Chapters</label>
          <select value={chapterCount} onChange={e=>setChapterCount(e.target.value)} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50">
            {[3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-blue-200 text-sm mb-1">POV Settings (Optional)</label>
          <select value={povMode} onChange={e=>setPovMode(e.target.value)} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50">
            <option value="female">Female Lead POV (default)</option>
            <option value="male">Male Lead POV</option>
            <option value="dual">Dual POV (alternate every chapter)</option>
          </select>
        </div>

        <div>
          <label className="block text-blue-200 text-sm mb-1">Genre Focus</label>
          <select value={genre} onChange={e=>setGenre(e.target.value)} className="w-full bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-blue-50">
            <option value="general">General</option>
            <option value="billionaire">Billionaire Romance</option>
            <option value="werewolf">Werewolf Romance</option>
            <option value="mafia">Mafia Romance</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded p-4">
        <POVRules />
      </div>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-2 rounded">
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  )
}
