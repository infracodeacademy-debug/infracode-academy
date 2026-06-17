import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Code2, Network, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-30 pointer-events-none z-0 blur-[150px] bg-gradient-to-b from-indigo-600/40 via-cyan-500/20 to-transparent"></div>
      
      {/* Navbar */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between z-10 animate-fade-in">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          InfraCode Academy
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#cursos" className="hover:text-white transition-colors">Cursos</Link>
          <Link href="#recursos" className="hover:text-white transition-colors">Recursos</Link>
          <Link href="#comunidad" className="hover:text-white transition-colors">Comunidad</Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-slate-300 hover:text-white">Entrar</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20">
                Empezar
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 mr-2 hover:bg-slate-900">Mi Panel</Button>
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl px-6 flex flex-col items-center justify-center text-center mt-24 mb-32 z-10">
        <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-800 text-sm text-indigo-400 font-medium mb-8 shadow-inner shadow-indigo-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">Descubre la nueva plataforma v1.0</span>
        </div>
        
        <h1 className="animate-slide-up [animation-delay:100ms] text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Domina <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-pulse-slow">Infraestructura</span> <br className="hidden md:block"/> y Programación
        </h1>
        
        <p className="animate-slide-up [animation-delay:200ms] text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          La academia premium para profesionales de TI. Aprende desde cero hasta avanzado con cursos basados en proyectos reales, arquitectura de redes y desarrollo de software.
        </p>

        <div className="animate-slide-up [animation-delay:300ms] flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/search">
            <Button size="lg" className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 text-lg px-8 py-6 rounded-xl font-bold transition-all hover:scale-105">
              Explorar Cursos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl font-semibold transition-all glass-card">
            Ver Temario
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full border-t border-slate-900/50 bg-slate-950/30 relative z-10">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-[-1]"></div>
        <div className="max-w-7xl mx-auto py-24 px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl animate-slide-up [animation-delay:100ms]">
              <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Network className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Redes y Sistemas</h3>
              <p className="text-slate-400 leading-relaxed">Domina Cisco, Moodle, servidores Linux y arquitectura de redes desde las bases hasta implementaciones empresariales.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl animate-slide-up [animation-delay:200ms]">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                <Code2 className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Desarrollo Web</h3>
              <p className="text-slate-400 leading-relaxed">Aprende a crear plataformas escalables, APIs robustas y aplicaciones web modernas utilizando el mejor stack tecnológico.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl animate-slide-up [animation-delay:300ms]">
              <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 shadow-lg shadow-purple-500/10">
                <BookOpen className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Recursos Prácticos</h3>
              <p className="text-slate-400 leading-relaxed">Acceso a repositorios, guías paso a paso, laboratorios virtuales y material de apoyo para complementar tu aprendizaje.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
