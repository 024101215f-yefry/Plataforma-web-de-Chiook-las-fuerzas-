import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { 
  Users, Briefcase, Mail, Calendar, UserCheck, Search, 
  PlusCircle, X, Trash2, HeartHandshake
} from 'lucide-react';
import { motion } from 'motion/react';

interface EmployeeManagementProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: number) => void;
}

export default function EmployeeManagement({
  employees,
  onAddEmployee,
  onDeleteEmployee,
}: EmployeeManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding employee
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formTitle, setFormTitle] = useState('Agente de Soporte de Ventas');
  const [formEmail, setFormEmail] = useState('');
  const [formHireDate, setFormHireDate] = useState('2025-06-01');
  const [formReportsTo, setFormReportsTo] = useState('nancy'); //Nancy Edwards default Manager
  const [formAvatarUrl, setFormAvatarUrl] = useState('');

  // Peruvian date helper: YYYY-MM-DD -> DD/MM/YYYY
  const formatPeruvianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase();
      return (
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
        emp.title.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
      );
    });
  }, [employees, searchQuery]);

  const handleAddNewEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName || !formEmail) {
      alert("Por favor completa los campos obligatorios: Nombre, Apellido y Email.");
      return;
    }

    const nextId = employees.reduce((max, emp) => emp.id > max ? emp.id : max, 0) + 1;
    
    // Set Manager hierarchy details
    let reportsId = 2;
    let reportsName = "Nancy Edwards";
    if (formReportsTo === 'andrew') {
      reportsId = 1;
      reportsName = "Andrew Adams";
    }

    const defaultAvatarUrl = formAvatarUrl || [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60"
    ][nextId % 5];

    const newEmp: Employee = {
      id: nextId,
      firstName: formFirstName,
      lastName: formLastName,
      title: formTitle,
      reportsToId: reportsId,
      reportsToName: reportsName,
      hireDate: formHireDate,
      email: formEmail,
      clientsCount: 0,
      avatarUrl: defaultAvatarUrl,
    };

    onAddEmployee(newEmp);
    setShowAddModal(false);

    // Reset fields
    setFormFirstName('');
    setFormLastName('');
    setFormTitle('Agente de Soporte de Ventas');
    setFormEmail('');
    setFormAvatarUrl('');
  };

  const handleDeleteEmployeeSim = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de desvincular al colaborador "${name}" del directorio Chinook?`)) {
      onDeleteEmployee(id);
    }
  };

  return (
    <div id="employee-management-view" className="space-y-6 font-sans">
      
      {/* View Header with controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Organigrama y Colaboradores</h2>
          <p className="text-xs text-gray-550 mt-1">
            Gestión de jerarquías de trabajo, representantes de ventas y auditoría interna de Chinook.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow shadow-blue-200"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Colaborador
        </button>
      </div>

      {/* Directory search filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm select-none">
        <span className="font-bold text-xs tracking-wider text-gray-650 uppercase flex items-center gap-1.5 text-gray-600">
          <HeartHandshake className="w-4 h-4 text-blue-650" />
          Personal Registrado ({filteredEmployees.length})
        </span>

        {/* Local search input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Filtro rápido de personal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Employee Grid directories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => {
          const fullName = `${emp.firstName} ${emp.lastName}`;
          return (
            <div
              key={emp.id}
              className="bg-white border border-gray-200 hover:border-blue-500 rounded-2xl p-5 shadow-sm flex flex-col justify-between group transition relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 blur-[25px] rounded-full pointer-events-none" />
              
              <div className="space-y-4">
                {/* Employee Portrait & name */}
                <div className="flex items-start gap-3.5 text-left">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100 relative select-none shadow-sm">
                    <img
                      src={emp.avatarUrl}
                      alt={fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/5" />
                  </div>

                  <div className="truncate">
                    <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-widest block w-fit mb-1">
                      ID: {emp.id}
                    </span>
                    <h3 className="font-bold text-sm text-gray-950 truncate group-hover:text-blue-600 transition">
                      {fullName}
                    </h3>
                    <p className="text-[11px] text-gray-550 truncate leading-tight font-sans text-gray-500">
                      {emp.title}
                    </p>
                  </div>
                </div>

                {/* Info contact list and direct reports */}
                <div className="space-y-2 pt-3 border-t border-gray-100 select-none text-[11.5px] text-gray-650">
                  <div className="flex items-center gap-2 text-left text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate text-gray-800 font-semibold select-all">{emp.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-left text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Contratación: <strong className="text-gray-850 font-semibold font-mono">{formatPeruvianDate(emp.hireDate)}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-left text-gray-600">
                    <UserCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">Reporta a: <strong className="text-gray-805 text-gray-800">{emp.reportsToName || 'Gerencia General / Ninguno'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Stats Footer Client counts */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold select-none">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                  {emp.clientsCount} Clientes asignados
                </span>

                <div className="flex items-center gap-1">
                  {emp.id > 2 && (
                    <button
                      onClick={() => handleDeleteEmployeeSim(emp.id, fullName)}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                      title="Desvincular colaborador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* New Hiring Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative text-left"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2 select-none">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base text-gray-950 font-sans">Registrar Contratación</h3>
            </div>

            <form onSubmit={handleAddNewEmployeeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej. Nancy"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Apellido *</label>
                  <input
                    type="text"
                    placeholder="Ej. Edwards"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Puesto de Trabajo *</label>
                <select
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
                >
                  <option value="Agente de Soporte de Ventas">Agente de Soporte de Ventas</option>
                  <option value="Gerente de Ventas">Gerente de Ventas (Manager)</option>
                  <option value="Soporte Técnico de TI">Soporte Técnico de TI</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  placeholder="name@musicstore.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Fecha Contratación</label>
                  <input
                    type="date"
                    value={formHireDate}
                    onChange={(e) => setFormHireDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Superior Reportado *</label>
                  <select
                    value={formReportsTo}
                    onChange={(e) => setFormReportsTo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
                  >
                    <option value="nancy">Nancy Edwards (Gerente de Ventas)</option>
                    <option value="andrew">Andrew Adams (Gerente General)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">URL Foto de Avatar (Opcional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formAvatarUrl}
                  onChange={(e) => setFormAvatarUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-850 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 text-xs font-semibold select-none">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                >
                  Registrar Colaborador
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
