import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Client, Employee, Invoice, ViewType } from '../types';
import { 
  Users, Search, PlusCircle, X, ShieldAlert, Edit, Trash2, 
  MapPin, Phone, Building, Mail, Sparkles, UserCheck, Play 
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
  invoices,
  onAddClient,
  onUpdateClient,
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

  // Simulated metrics of the selected client
  const selectedClientPurchases = useMemo(() => {
    if (!selectedClient) return [];
    // Generating simulated bills linked to clients to keep things dynamic and exciting
    // EduardoSantos maps to INV-00104 and INV-00106
    if (selectedClient.id === 1) {
      return [
        { id: "INV-00104", date: "2025-05-12", amount: 3.96, tracksCount: 4 },
        { id: "INV-00106", date: "2025-05-18", amount: 4.95, tracksCount: 5 },
      ];
    }
    // Helena Holy maps to INV-00105
    if (selectedClient.id === 2) {
      return [
        { id: "INV-00105", date: "2025-05-14", amount: 2.97, tracksCount: 3 },
      ];
    }
    // Random fallback simulated purchases
    return [
      { id: `INV-0010${8 + selectedClient.id}`, date: "2025-05-24", amount: 5.94, tracksCount: 6 }
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
      phone: formPhone || "+55 (00) 0000-0000",
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Gestión de Clientes Digitales</h2>
          <p className="text-xs text-gray-400 mt-1">
            Administración de cuentas de clientes, asignación de soporte de ventas y auditoría de compras.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#7F77DD] hover:bg-[#6e66c4] px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nuevo Cliente
        </button>
      </div>

      {/* Main split dashboard section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Client Data Table (7 columns) */}
        <div className="col-span-1 lg:col-span-7 bg-[#111125] border border-white/5 rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 select-none">
            <span className="font-semibold text-xs tracking-wider text-gray-300 flex items-center gap-1.5 uppercase">
              <Users className="w-4 h-4 text-[#7F77DD]" />
              Clientes Indexados ({filteredClients.length})
            </span>
            <div className="relative w-48 sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Filtro rápido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#161630] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] transition"
              />
            </div>
          </div>

          {/* Client directory list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 font-semibold select-none">
                  <th className="pb-3 w-10">ID</th>
                  <th className="pb-3 pl-2">Nombre</th>
                  <th className="pb-3">Compañía</th>
                  <th className="pb-3">País</th>
                  <th className="pb-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => {
                  const isActive = selectedClientId === client.id;
                  const fullName = `${client.firstName} ${client.lastName}`;
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`hover:bg-[#161630]/60 transition cursor-pointer text-gray-300 ${
                        isActive ? 'bg-[#1c1c3a] text-white font-medium border-l border-l-[#7F77DD]' : ''
                      }`}
                    >
                      <td className="py-3 font-mono text-[10.5px] text-gray-500">{client.id}</td>
                      <td className="py-3 pl-2 font-medium truncate max-w-[120px]">{fullName}</td>
                      <td className="py-3 text-gray-400 truncate max-w-[100px]">
                        {client.company || <span className="text-gray-600 italic">Particular</span>}
                      </td>
                      <td className="py-3 text-gray-400">{client.country}</td>
                      <td className="py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDeleteClientSim(client.id, fullName)}
                            className="p-1 hover:bg-red-950/40 text-gray-500 hover:text-red-400 rounded transition cursor-pointer"
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

        {/* Right Side: Detailed slide (edit/detail drawer panel) (5 columns) */}
        <div className="col-span-1 lg:col-span-5 bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden">
          {selectedClient ? (
            <div className="space-y-6">
              
              {/* Header card with name and country */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/35 flex items-center justify-center text-white font-bold text-sm tracking-wide shrink-0">
                    {selectedClient.firstName.charAt(0)}{selectedClient.lastName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                      Perfil del Cliente
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {selectedClient.firstName} {selectedClient.lastName}
                    </h3>
                    <p className="text-xs text-gray-400">ID de cliente: CHN-C00{selectedClient.id}</p>
                  </div>
                </div>

                <span className="bg-[#7F77DD]/15 text-[#7F77DD] text-[10px] font-bold py-0.5 px-2 rounded border border-[#7F77DD]/30">
                  Activo
                </span>
              </div>

              {/* Business specs card */}
              <div className="space-y-3.5 pt-4 border-t border-white/10 select-none">
                <div className="flex items-center gap-2 text-xs text-gray-300 text-left">
                  <Building className="w-4 h-4 text-[#7F77DD] shrink-0" />
                  <span className="text-gray-500">Organización:</span>
                  <span className="font-semibold text-white ml-auto">
                    {selectedClient.company || 'Cliente Particular'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-300 text-left">
                  <Mail className="w-4 h-4 text-[#7F77DD] shrink-0" />
                  <span className="text-gray-500">Correo electrónico:</span>
                  <span className="font-mono text-white ml-auto select-all">
                    {selectedClient.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-300 text-left">
                  <Phone className="w-4 h-4 text-[#7F77DD] shrink-0" />
                  <span className="text-gray-500">Teléfono:</span>
                  <span className="font-mono text-white ml-auto select-all">
                    {selectedClient.phone || 'Sin registrar'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-300 text-left">
                  <MapPin className="w-4 h-4 text-[#7F77DD] shrink-0" />
                  <span className="text-gray-500">País de registro:</span>
                  <span className="font-semibold text-white ml-auto">
                    {selectedClient.country}
                  </span>
                </div>
              </div>

              {/* Support Assigned Employee */}
              <div className="bg-[#161630] border border-white/5 rounded-xl p-3.5 space-y-2 select-none">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#7F77DD]" />
                  <h4 className="font-bold text-xs text-gray-300">Asesor de Soporte (Rep. de Ventas)</h4>
                </div>
                <div className="text-xs text-left">
                  <p className="text-white font-medium">
                    {agentMap[selectedClient.supportRepId] || 'Sin Asesor'}
                  </p>
                  <p className="text-[10px] text-gray-500">Jane Peacock es responsable del seguimiento.</p>
                </div>
              </div>

              {/* Invoices list purchases details */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Historial de Compras</h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedClientPurchases.map((pur) => (
                    <div
                      key={pur.id}
                      className="flex justify-between items-center p-2.5 rounded-lg bg-[#161630]/60 border border-white/5 text-xs text-left text-gray-300 select-none"
                    >
                      <div>
                        <p className="font-mono font-bold text-white">{pur.id}</p>
                        <p className="text-[10px] text-gray-500">Emitido: {pur.date} • {pur.tracksCount} pistas</p>
                      </div>
                      <span className="font-mono font-semibold text-[#7F77DD]">${pur.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-gray-500 select-none">
              <ShieldAlert className="w-10 h-10 text-gray-600 mx-auto" />
              Selecciona un cliente del listado para auditar sus detalles.
            </div>
          )}
        </div>

      </div>

      {/* New Client Registration Overlay Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#7F77DD]" />
              <h3 className="font-bold text-lg text-white font-sans">Registrar Cliente Chinook</h3>
            </div>

            <form onSubmit={handleAddNewClientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej. Eduardo"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Apellido *</label>
                  <input
                    type="text"
                    placeholder="Ej. Santos"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Correo electrónico *</label>
                <input
                  type="email"
                  placeholder="eduardo.santos@embraer.com.br"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Compañía (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Embraer S.A."
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">País *</label>
                  <input
                    type="text"
                    placeholder="Brasil"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+55 (12) 3927-1000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Representante de Soporte *</label>
                  <select
                    value={formAgentId}
                    onChange={(e) => setFormAgentId(Number(e.target.value))}
                    className="w-full bg-[#111122] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#7F77DD] cursor-pointer"
                  >
                    <option value={3}>Jane Peacock (Soporte)</option>
                    <option value={4}>Margaret Park (Soporte)</option>
                    <option value={5}>Steve Johnson (Soporte)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7F77DD] text-white rounded-lg hover:bg-[#6e66c4] shadow-lg transition"
                >
                  Agregar Cliente permanentemente
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
