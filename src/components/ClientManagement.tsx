import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Client, Employee, Invoice } from '../types';
import { 
  Users, Search, PlusCircle, X, ShieldAlert, Trash2, 
  MapPin, Phone, Building, Mail, Sparkles, UserCheck 
} from 'lucide-react';

interface ClientManagementProps {
  clients: Client[];
  employees: Employee[];
  invoices: Invoice[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: number) => void;
}

export default function ClientManagement({
  clients,
  employees,
  onAddClient,
  onDeleteClient,
}: ClientManagementProps) {
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(clients.length > 0 ? clients[0].id : null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for creating a new client
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAgentId, setFormAgentId] = useState<number>(3); // Jane Peacock by default

  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // Peruvian date helper: YYYY-MM-DD -> DD/MM/YYYY
  const formatPeruvianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Support Agent helper map
  const agentMap = useMemo(() => {
    const map: Record<number, string> = {};
    employees.forEach((emp) => {
      map[emp.id] = `${emp.firstName} ${emp.lastName}`;
    });
    return map;
  }, [employees]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      return (
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        c.country.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  // Simulated metrics of the selected client in Peruvian Soles (S/.)
  const selectedClientPurchases = useMemo(() => {
    if (!selectedClient) return [];
    if (selectedClient.id === 1) {
      return [
        { id: "INV-00104", date: "2025-05-12", amount: 14.50, tracksCount: 4 },
        { id: "INV-00106", date: "2025-05-18", amount: 18.20, tracksCount: 5 },
      ];
    }
    if (selectedClient.id === 2) {
      return [
        { id: "INV-00105", date: "2025-05-14", amount: 10.90, tracksCount: 3 },
      ];
    }
    return [
      { id: `INV-0010${8 + selectedClient.id}`, date: "2025-05-24", amount: 21.80, tracksCount: 6 }
    ];
  }, [selectedClient]);

  const handleAddNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName || !formEmail || !formCountry) {
      alert("Por favor completa los campos requeridos: Nombre, Apellido, Email y País.");
      return;
    }

    const nextId = clients.reduce((max, c) => c.id > max ? c.id : max, 0) + 1;
    const newClient: Client = {
      id: nextId,
      firstName: formFirstName,
      lastName: formLastName,
      email: formEmail,
      company: formCompany,
      country: formCountry,
      phone: formPhone || "+51 (1) 000-000",
      supportRepId: Number(formAgentId),
    };

    onAddClient(newClient);
    setSelectedClientId(nextId);
    setShowAddForm(false);
    
    // Clear fields
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormCompany('');
    setFormCountry('');
    setFormPhone('');
    setFormAgentId(3);
  };

  const handleDeleteClientSim = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al cliente "${name}" en la base de datos Chinook?`)) {
      onDeleteClient(id);
      if (selectedClientId === id) {
        setSelectedClientId(clients.length > 1 ? clients[0].id : null);
      }
    }
  };

  return (
    <div id="client-management-view" className="space-y-6 font-sans">
      
      {/* View Header with control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Gestión de Clientes en Chinook</h2>
          <p className="text-xs text-gray-500 mt-1">
            Administración de cuentas académicas, asignación de asesores y auditoría de compras en soles.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow shadow-blue-200"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nuevo Cliente
        </button>
      </div>

      {/* Main split dashboard section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Client Data Table (7 columns) */}
        <div className="col-span-1 lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-150 select-none">
            <span className="font-bold text-xs tracking-wider text-gray-600 flex items-center gap-1.5 uppercase">
              <Users className="w-4 h-4 text-blue-600" />
              Directorio de Clientes ({filteredClients.length})
            </span>
            <div className="relative w-48 sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Filtro por nombre, país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Client directory list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-bold select-none bg-gray-50">
                  <th className="py-2.5 px-3 w-12">ID</th>
                  <th className="py-2.5 px-3 pl-2">Nombre</th>
                  <th className="py-2.5 px-3">Compañía</th>
                  <th className="py-2.5 px-3">País</th>
                  <th className="py-2.5 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map((client) => {
                  const isActive = selectedClientId === client.id;
                  const fullName = `${client.firstName} ${client.lastName}`;
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`hover:bg-slate-50 transition cursor-pointer text-gray-700 ${
                        isActive ? 'bg-blue-50/50 font-semibold border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-[10.5px] text-gray-400">{client.id}</td>
                      <td className="py-3 px-3 pl-2 font-bold text-gray-950 truncate max-w-[125px]">{fullName}</td>
                      <td className="py-3 px-3 text-gray-500 truncate max-w-[110px]">
                        {client.company || <span className="text-gray-400 italic">Particular</span>}
                      </td>
                      <td className="py-3 px-3 text-gray-500">{client.country}</td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDeleteClientSim(client.id, fullName)}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-655 rounded transition cursor-pointer"
                            title="Eliminar de base de datos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detailed card detail drawer panel (5 columns) */}
        <div className="col-span-1 lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
          {selectedClient ? (
            <div className="space-y-6">
              
              {/* Header card with name and country */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-sm tracking-wide shrink-0">
                    {selectedClient.firstName.charAt(0)}{selectedClient.lastName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Ficha de Registro
                    </span>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                      {selectedClient.firstName} {selectedClient.lastName}
                    </h3>
                    <p className="text-xs text-gray-550 font-mono">CHN-C00{selectedClient.id}</p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold py-0.5 px-2 rounded border border-emerald-100">
                  Activo
                </span>
              </div>

              {/* Business specs card */}
              <div className="space-y-3 pt-4 border-t border-gray-200 select-none">
                <div className="flex items-center gap-2 text-xs text-gray-750 text-left">
                  <Building className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-gray-400">Organización:</span>
                  <span className="font-bold text-gray-800 ml-auto">
                    {selectedClient.company || 'Cliente Particular'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-750 text-left">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-gray-400">Correo Electrónico:</span>
                  <span className="font-mono text-gray-800 font-semibold ml-auto select-all">
                    {selectedClient.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-750 text-left">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-gray-400">Teléfono Móvil:</span>
                  <span className="font-mono text-gray-800 ml-auto select-all">
                    {selectedClient.phone || 'Sin registrar'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-750 text-left">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-gray-400">País de Residencia:</span>
                  <span className="font-bold text-gray-850 ml-auto">
                    {selectedClient.country}
                  </span>
                </div>
              </div>

              {/* Support Assigned Employee */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2 select-none text-left">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-xs text-gray-700">Asesor de Soporte (Ventas)</h4>
                </div>
                <div className="text-xs">
                  <p className="text-gray-900 font-bold">
                    {agentMap[selectedClient.supportRepId] || 'Sin Asesor'}
                  </p>
                  <p className="text-[10px] text-gray-400">Representante oficial responsable del cliente en Chinook DB.</p>
                </div>
              </div>

              {/* Invoices list purchases details */}
              <div className="space-y-2.5">
                <h4 className="text-[10.5px] font-bold text-gray-400 uppercase tracking-widest text-left">Historial de Compras</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedClientPurchases.map((pur) => (
                    <div
                      key={pur.id}
                      className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-left text-gray-700 select-none"
                    >
                      <div>
                        <p className="font-mono font-bold text-gray-950">{pur.id}</p>
                        <p className="text-[10px] text-gray-400">Emitido: {formatPeruvianDate(pur.date)} • {pur.tracksCount} temas</p>
                      </div>
                      <span className="font-mono font-bold text-blue-600">S/. {pur.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-gray-400 select-none">
              <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              Selecciona un cliente del listado para auditar sus detalles de compras.
            </div>
          )}
        </div>

      </div>

      {/* New Client Registration Overlay Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative text-left"
          >
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base text-gray-950 font-sans">Registrar Cliente Chinook</h3>
            </div>

            <form onSubmit={handleAddNewClientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej. Eduardo"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">Apellido *</label>
                  <input
                    type="text"
                    placeholder="Ej. Santos"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">Correo Electrónico *</label>
                <input
                  type="email"
                  placeholder="eduardo.santos@embraer.com.br"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">Compañía (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Embraer S.A."
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">País *</label>
                  <input
                    type="text"
                    placeholder="Brasil"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+55 (12) 3927-1000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-505 mb-1 text-gray-500">Asesor Asignado *</label>
                  <select
                    value={formAgentId}
                    onChange={(e) => setFormAgentId(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
                  >
                    <option value={3}>Jane Peacock (Agente de Ventas)</option>
                    <option value={4}>Margaret Park (Agente de Ventas)</option>
                    <option value={5}>Steve Johnson (Agente de Ventas)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                >
                  Guardar en Base de Datos
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
