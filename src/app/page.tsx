import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Code2, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none z-0 blur-[120px] bg-gradient-to-b from-indigo-500 to-transparent"></div>

      {/* Navbar (minimal) */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-indigo-600 p-2 rounded-lg">
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
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 border-0">Entrar</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 border-0">
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
      <main className="flex-1 w-full max-w-7xl px-6 flex flex-col items-center justify-center text-center mt-20 mb-32 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm text-indigo-400 font-medium mb-8 shadow-inner shadow-indigo-500/10">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Nueva plataforma v1.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Domina <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Infraestructura</span> <br className="hidden md:block"/> y Programación
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          La academia premium para profesionales de TI. Aprende desde cero hasta avanzado con cursos basados en proyectos reales, arquitectura de redes y desarrollo de software.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 text-lg px-8 py-6 rounded-xl font-semibold transition-all">
            Ver Cursos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border border-slate-800 bg-slate-900/50 text-white hover:bg-slate-800 text-lg px-8 py-6 rounded-xl font-semibold transition-all">
            Ver Temario
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full border-t border-slate-900 bg-slate-950/50 py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/60 hover:border-indigo-500/30 transition-all hover:-translate-y-1">
              <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Network className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Redes y Sistemas</h3>
              <p className="text-slate-400 leading-relaxed">Domina Cisco, Moodle, servidores Linux y arquitectura de redes desde las bases hasta implementaciones empresariales.</p>
            </div>
            
            <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/60 hover:border-cyan-500/30 transition-all hover:-translate-y-1">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                <Code2 className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Desarrollo Web</h3>
              <p className="text-slate-400 leading-relaxed">Aprende a crear plataformas escalables, APIs robustas y aplicaciones web modernas utilizando el mejor stack tecnológico.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/60 hover:border-purple-500/30 transition-all hover:-translate-y-1">
              <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <BookOpen className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Recursos Prácticos</h3>
              <p className="text-slate-400 leading-relaxed">Acceso a repositorios, guías paso a paso, laboratorios virtuales y material de apoyo para complementar tu aprendizaje.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
