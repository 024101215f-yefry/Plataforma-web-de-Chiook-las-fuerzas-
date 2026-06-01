import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Mail, Lock, User, Shield, Info, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'cliente' | 'admin'>('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!fullName || !email || !password) {
        setError('Por favor, completa todos los campos.');
        return;
      }
      onLogin({
        role: 'cliente',
        name: fullName,
      });
      return;
    }

    // Login logic
    if (role === 'admin') {
      if (email === 'admin@musicstore.com' && password === 'admin123') {
        onLogin({
          role: 'admin',
          name: 'Administrador Principal',
        });
      } else if (!email || !password) {
        setError('Ingresa email y contraseña.');
      } else {
        // Fallback for easy demo so user isn't stuck
        if (email.includes('admin') || password === 'admin123') {
          onLogin({
            role: 'admin',
            name: 'Admin Demo',
          });
        } else {
          setError('Credenciales de administrador incorrectas. Tip: admin@musicstore.com / admin123');
        }
      }
    } else {
      // Client login
      if (!email || !password) {
        setError('Por favor completa las credenciales.');
        return;
      }
      // Deriving client name from email
      let clientName = 'Eduardo Santos';
      if (email.toLowerCase().includes('holy')) clientName = 'Helena Holý';
      if (email.toLowerCase().includes('john')) clientName = 'John Doe';
      if (email.toLowerCase().includes('almeida')) clientName = 'Luis Almeida';
      
      onLogin({
        role: 'cliente',
        name: clientName,
      });
    }
  };

  const handleDemoCredentials = (selectedRole: 'cliente' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@musicstore.com');
      setPassword('admin123');
    } else {
      setEmail('eduardo.santos@embraer.com.br');
      setPassword('user123');
    }
  };

  return (
    <div id="login-container" className="min-h-screen bg-[#10101e] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#7F77DD]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#7F77DD]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#1a1a2e]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10"
      >
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#7F77DD]/20 border border-[#7F77DD]/35 text-[#7F77DD] mb-3">
            <Music className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">MusicStore Web</h1>
          <p className="text-gray-400 mt-1 text-sm">Universidad Andina del Cusco</p>
        </div>

        {/* Client / Admin Switcher */}
        {!isRegister && (
          <div className="flex bg-[#111122] rounded-lg p-1.5 mb-6 border border-white/5">
            <button
              id="switch-client"
              type="button"
              onClick={() => { setRole('cliente'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                role === 'cliente'
                  ? 'bg-[#7F77DD] text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              Soy Cliente
            </button>
            <button
              id="switch-admin"
              type="button"
              onClick={() => { setRole('admin'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                role === 'admin'
                  ? 'bg-[#7F77DD] text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              Soy Administrador
            </button>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-6">
          {isRegister ? 'Crear nueva cuenta' : role === 'admin' ? 'Ingreso Administrativo' : 'Iniciar sesión'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium uppercase text-gray-400 tracking-wider mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Ej. Eduardo Santos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#111122]/70 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] text-sm transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase text-gray-400 tracking-wider mb-1.5">
              Email Registrado
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder={role === 'admin' ? 'admin@musicstore.com' : 'eduardo.santos@embraer.com.br'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111122]/70 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase text-gray-400 tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111122]/70 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] text-sm transition"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-400 text-xs bg-red-950/40 p-3 rounded-lg border border-red-900/30 font-sans"
            >
              {error}
            </motion.div>
          )}

          <button
            id="login-btn"
            type="submit"
            className="w-full py-3 bg-[#7F77DD] hover:bg-[#6e66c4] cursor-pointer text-white font-semibold rounded-lg text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isRegister ? 'Crear Cuenta' : 'Acceder al Sistema'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins Details */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 mb-2">¿Quieres probar rápido? Usa accesos rápidos:</p>
          <div className="flex justify-center gap-2">
            <button
              id="demo-client"
              type="button"
              onClick={() => handleDemoCredentials('cliente')}
              className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded border border-white/5 transition"
            >
              Demo Cliente
            </button>
            <button
              id="demo-admin"
              type="button"
              onClick={() => handleDemoCredentials('admin')}
              className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded border border-white/5 transition"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Register Toggle */}
        <div className="mt-6 text-center text-xs">
          <button
            id="register-toggle"
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-gray-400 hover:text-[#7F77DD] transition"
          >
            {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Registrate aquí'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
