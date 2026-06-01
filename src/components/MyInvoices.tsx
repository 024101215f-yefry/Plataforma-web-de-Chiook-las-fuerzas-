import { useState, useMemo } from 'react';
import { Invoice, InvoiceLine } from '../types';
import { FileText, Calendar, MapPin, Receipt, Search, Download, CreditCard, Music } from 'lucide-react';

interface MyInvoicesProps {
  invoices: Invoice[];
}

export default function MyInvoices({ invoices }: MyInvoicesProps) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    invoices.length > 0 ? invoices[invoices.length - 1].id : null
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Handle updates to invoice selections if the active list grows
  const selectedInvoice = useMemo(() => {
    if (!selectedInvoiceId && invoices.length > 0) return invoices[invoices.length - 1];
    return invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];
  }, [invoices, selectedInvoiceId]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.billingCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.billingCity.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [invoices, searchQuery]);

  // Calculations for detail invoice
  const calculateInvoiceSubtotal = (lines: InvoiceLine[]) => {
    return lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
  };

  const handleDownloadPDFSim = (inv: Invoice) => {
    alert(`[Simulación PDF] Descargando comprobante oficial ${inv.id} en formato PDF en tu equipo (UAC MusicStore Web Cert)`);
  };

  return (
    <div id="my-invoices-view" className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Mis Comprobantes de Pago</h2>
        <p className="text-xs text-gray-400 mt-1">
          Historial y detalle de adquisiciones de licencias musicales, indexado por Chinook.
        </p>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Historial de facturas */}
        <div className="col-span-1 lg:col-span-5 bg-[#111125] border border-white/5 rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-semibold text-xs tracking-wider text-white gap-2 flex items-center uppercase">
              <Receipt className="w-3.5 h-3.5 text-[#7F77DD]" />
              Facturas Emitidas
            </span>
            <span className="text-xs font-mono font-bold text-gray-400">({filteredInvoices.length})</span>
          </div>

          {/* Local Search input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Buscar por id o país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161630] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          {/* Invoices List list */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredInvoices.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No se encontraron facturas registradas.
              </div>
            ) : (
              filteredInvoices.map((inv) => {
                const isActive = selectedInvoice?.id === inv.id;
                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoiceId(inv.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                      isActive
                        ? 'bg-[#1c1c3a] border-[#7F77DD] shadow'
                        : 'bg-[#14142a]/60 border-white/5 hover:border-white/10 hover:bg-[#161632]'
                    }`}
                  >
                    <div className="space-y-1 pr-2 truncate">
                      <div className="flex items-center gap-1.5">
                        <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-[#7F77DD]' : 'text-gray-400'}`} />
                        <span className="font-mono text-xs font-bold text-white">{inv.id}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {inv.invoiceDate}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[100px]">
                          <MapPin className="w-3 h-3" />
                          {inv.billingCity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-mono text-xs font-bold text-[#7F77DD] font-sans">
                        ${inv.total.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30 font-semibold font-sans mt-0.5 inline-block">
                        Pagado
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detail of active invoice */}
        <div className="col-span-1 lg:col-span-7 bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md">
          {selectedInvoice ? (
            <div className="space-y-6">
              
              {/* Receipt Header info */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-white/10 select-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-widest block">Comprobante No</span>
                    <span className="bg-[#7F77DD]/20 text-[#7F77DD] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#7F77DD]/35 font-mono">
                      ORIGINAL CHINOOK
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-white text-xl">{selectedInvoice.id}</h3>
                  <p className="text-xs text-gray-400">Canal de emisión: Tienda Digital MusicStore</p>
                </div>

                <div className="sm:text-right space-y-1 text-xs text-gray-400">
                  <p>Fecha Emisión: <strong className="text-white font-mono">{selectedInvoice.invoiceDate}</strong></p>
                  <p>Método de pago: <strong className="text-white flex items-center sm:justify-end gap-1"><CreditCard className="w-3.5 h-3.5 text-[#7F77DD]" /> Visa Digital</strong></p>
                  <p>Universidad Andina: <strong className="text-white">UAC-2025</strong></p>
                </div>
              </div>

              {/* Billing address details */}
              <div className="bg-[#161630] border border-white/5 p-4 rounded-xl text-xs space-y-2 select-none">
                <h4 className="font-semibold text-gray-300">Detalles de Facturación</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Dirección de Envío</span>
                    <p className="text-white font-medium">{selectedInvoice.billingCity}, {selectedInvoice.billingCountry}</p>
                    <p>Licencia para el territorio: {selectedInvoice.billingCountry}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Cliente Titular</span>
                    <p className="text-white font-medium">Eduardo Santos</p>
                    <p>Membresía activa: Chinook Gold Account</p>
                  </div>
                </div>
              </div>

              {/* Invoice Lines detail table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Conceptos Adquiridos</h4>
                <div className="border border-white/5 rounded-xl overflow-hidden bg-[#161630]/40">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase bg-[#161630] select-none">
                        <th className="py-2.5 pl-3 w-8">#</th>
                        <th className="py-2.5 pl-2">Descripción de la Canción</th>
                        <th className="py-2.5 text-center w-12">Cant.</th>
                        <th className="py-2.5 text-right pr-3 font-mono w-20">Precio Unit.</th>
                        <th className="py-2.5 text-right pr-4 font-mono w-24">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedInvoice.lines.map((line, idx) => {
                        const lineSub = line.unitPrice * line.quantity;
                        return (
                          <tr key={line.id || idx} className="text-gray-300 hover:bg-[#161630]/60 transition">
                            <td className="py-3 pl-3 font-mono text-[10px] text-gray-500">{idx + 1}</td>
                            <td className="py-3 pl-2 font-medium text-white flex items-center gap-1.5 pr-2 truncate max-w-[200px] sm:max-w-none">
                              <Music className="w-3 h-3 text-[#7F77DD]" />
                              {line.trackName}
                            </td>
                            <td className="py-3 text-center font-mono font-semibold">{line.quantity}</td>
                            <td className="py-3 text-right pr-3 font-mono">${line.unitPrice.toFixed(2)}</td>
                            <td className="py-3 text-right pr-4 font-mono text-white font-semibold">${lineSub.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total calculations details box */}
              <div className="pt-3 border-t border-white/10 flex flex-col items-end space-y-1.5 select-none">
                <div className="flex justify-between w-48 text-xs text-gray-400">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono font-medium text-white">${calculateInvoiceSubtotal(selectedInvoice.lines).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 text-xs text-gray-400">
                  <span>Impuestos (IGV 18% Incl.):</span>
                  <span className="font-mono font-medium text-white">$0.00</span>
                </div>
                <div className="flex justify-between w-48 text-sm font-bold text-white pt-1.5 border-t border-white/5">
                  <span className="text-gray-300">Total Facturado:</span>
                  <span className="font-mono text-[#7F77DD] text-base">${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions footer print/dl */}
              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  onClick={() => handleDownloadPDFSim(selectedInvoice)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold rounded-lg border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Factura PDF
                </button>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-gray-500">
              No se seleccionó factura. Elige una del panel izquierdo.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
