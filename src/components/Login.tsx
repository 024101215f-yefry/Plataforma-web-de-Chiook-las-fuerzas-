import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
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

    // Login credentials matching
    if (role === 'admin') {
      if (email === 'admin@musicstore.com' && password === 'admin123') {
        onLogin({
          role: 'admin',
          name: 'Administrador Principal',
        });
      } else if (!email || !password) {
        setError('Ingresa email y contraseña para el panel de control.');
      } else {
        if (email.includes('admin') || password === 'admin123') {
          onLogin({
            role: 'admin',
            name: 'Admin Especial',
          });
        } else {
          setError('Credenciales de administrador incorrectas. Tip: admin@musicstore.com / admin123');
        }
      }
    } else {
      if (!email || !password) {
        setError('Por favor completa las credenciales de cliente.');
        return;
      }
      // Derive customer name from input email
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

  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    // Demonstration social sign-in simulation representing proper NextAuth/Auth.js handler triggers
    if (role === 'admin') {
      alert(`Para el ingreso administrativo, por favor use el formulario con credenciales fijas.`);
      return;
    }
    
    onLogin({
      role: 'cliente',
      name: provider === 'Google' ? 'Gaston Gomez (Google)' : 'Fabiana Fernandez (Facebook)',
    });
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Soft gradient background radial shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/40 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-xl relative z-10"
      >
        {/* Academic Program Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-3 select-none">
            <Music className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 font-sans">MusicStore Web</h1>
          <p className="text-gray-500 mt-0.5 text-xs font-semibold">Universidad Andina del Cusco • Chinook DB</p>
        </div>

        {/* Client / Admin Mode Switcher Toggle */}
        {!isRegister && (
          <div className="flex bg-gray-100 border border-gray-200 rounded-xl p-1 mb-5">
            <button
              id="switch-client"
              type="button"
              onClick={() => { setRole('cliente'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'cliente'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Portal Clientes
            </button>
            <button
              id="switch-admin"
              type="button"
              onClick={() => { setRole('admin'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Administración
            </button>
          </div>
        )}

        {/* Action Title */}
        <h2 className="text-md font-bold text-gray-800 mb-4 font-sans border-b border-gray-100 pb-2">
          {isRegister ? 'Crear Cuenta Estudiante' : role === 'admin' ? 'Acceso de Personal' : 'Ingreso al Catálogo'}
        </h2>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {isRegister && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                Nombre y Apellido
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Ej. Manuel Quispe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder={role === 'admin' ? 'admin@musicstore.com' : 'eduardo.santos@embraer.com.br'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs transition"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-600 text-xs bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium"
            >
              {error}
            </motion.div>
          )}

          <button
            id="login-btn"
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold rounded-xl text-xs tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isRegister ? 'Registrar y Conectar' : 'Iniciar Sesión'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Social Authentication NextAuth Mockup (Google & Facebook official styles) */}
        {!isRegister && role === 'cliente' && (
          <div className="mt-5 pt-4 border-t border-gray-150 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Acceso Social NextAuth</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer transition shadow-sm"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.02h3.89c2.28-2.1 3.56-5.19 3.56-8.5z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3.02c-1.08.73-2.48 1.16-4.04 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.32 14.27a7.16 7.16 0 0 1 0-4.54V6.62H1.21a11.96 11.96 0 0 0 0 10.76l4.11-3.11z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.93 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 6.62l4.11 3.11c.94-2.85 3.57-4.98 6.68-4.98z" />
                </svg>
                Google
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#1877F2] text-white hover:bg-[#166fe5] border border-transparent rounded-xl text-xs font-semibold cursor-pointer transition shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        )}

        {/* Demo Fast Logins bypass trigger */}
        <div className="mt-5 pt-4 border-t border-gray-150 text-center select-none">
          <p className="text-[10px] text-gray-400 font-semibold mb-2">Ingresos de simulación académica:</p>
          <div className="flex justify-center gap-2">
            <button
              id="demo-client"
              type="button"
              onClick={() => handleDemoCredentials('cliente')}
              className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200 transition cursor-pointer"
            >
              Demo Cliente
            </button>
            <button
              id="demo-admin"
              type="button"
              onClick={() => handleDemoCredentials('admin')}
              className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200 transition cursor-pointer"
            >
              Demo Administrador
            </button>
          </div>
        </div>

        {/* Register switcher */}
        <div className="mt-5 text-center text-xs">
          <button
            id="register-toggle"
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-gray-500 hover:text-blue-600 font-medium transition cursor-pointer"
          >
            {isRegister ? '¿Ya tienes una cuenta registrada? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
