import { useState } from 'react'
import ProjectForm from './components/ProjectForm'
import ChapterGenerator from './components/ChapterGenerator'
import POVRules from './components/POVRules'

function App() {
  const [project, setProject] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_110%,rgba(14,165,233,0.08),transparent_40%)] pointer-events-none" />

      <header className="relative z-10 border-b border-blue-500/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">ChapterSmith AI</h1>
              <p className="text-xs text-blue-200/70">Complete Story Builder</p>
            </div>
          </div>
          <a href="/test" className="text-sm text-blue-200/80 hover:text-white">System Test</a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {!project ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/40 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-semibold mb-1">Start a New Project</h2>
              <p className="text-blue-200/80 mb-6">Paste your outline, select chapters and POV, then begin generating fully written chapters.</p>
              <ProjectForm onCreated={setProject} />
            </div>
            <aside className="bg-slate-900/40 border border-blue-500/20 rounded-2xl p-6 h-fit">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Writing Rules</h3>
                  <p className="text-sm text-blue-200/80">The app enforces grounded, human-first narration with clear, natural dialogue.</p>
                </div>
                <POVRules />
                <div className="text-sm text-blue-100/80">
                  <h4 className="text-blue-200 font-semibold mt-4 mb-2">Word Count</h4>
                  <p>Each chapter must be strictly between 1400 and 1800 words. Keep scenes complete and cohesive within this range.</p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-blue-100 font-semibold">{project.title || 'Untitled Project'}</div>
                <div className="text-xs text-blue-200/70">{project.chapter_count} chapters • POV: {project.pov_mode} • Genre: {project.genre || 'general'}</div>
                <button onClick={() => setProject(null)} className="ml-auto text-sm text-blue-200/80 hover:text-white">Start new project</button>
              </div>
            </div>
            <ChapterGenerator project={project} />
          </div>
        )}
      </main>

      <footer className="relative z-10 py-8 border-t border-blue-500/10 text-center text-blue-200/60 text-sm">
        Built with Flames Blue
      </footer>
    </div>
  )
}

export default App
