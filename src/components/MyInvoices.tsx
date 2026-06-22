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

  // Peruvian date helper: YYYY-MM-DD -> DD/MM/YYYY
  const formatPeruvianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

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

  const calculateInvoiceSubtotal = (lines: InvoiceLine[]) => {
    return lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
  };

  const handleDownloadPDFSim = (inv: Invoice) => {
    alert(`[Simulación PDF] Descargando comprobante de pago oficial ${inv.id} en Soles (S/.) en formato PDF. Registrado por la UAC Cusco.`);
  };

  return (
    <div id="my-invoices-view" className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="text-left select-none">
        <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Mis Comprobantes de Pago</h2>
        <p className="text-xs text-gray-500 mt-1">
          Historial de compras y descargas de sonido digital para tu cuenta, indexada en la base de datos Chinook.
        </p>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Historial de facturas */}
        <div className="col-span-1 lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center justify-between pb-3 border-b border-gray-150 select-none">
            <span className="font-bold text-xs tracking-wider text-gray-700 gap-2 flex items-center uppercase">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              Facturas Emitidas
            </span>
            <span className="text-xs font-mono font-bold text-gray-400">({filteredInvoices.length})</span>
          </div>

          {/* Local Search input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Buscar por id de factura o país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition shadow-sm"
            />
          </div>

          {/* Invoices List */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredInvoices.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 select-none">
                No se encontraron facturas en soles registradas.
              </div>
            ) : (
              filteredInvoices.map((inv) => {
                const isActive = selectedInvoice?.id === inv.id;
                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoiceId(inv.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex justify-between items-center ${
                      isActive
                        ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-105'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 pr-2 truncate">
                      <div className="flex items-center gap-1.5 select-none">
                        <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`font-mono text-xs font-bold ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>{inv.id}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold select-none">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-450" />
                          {formatPeruvianDate(inv.invoiceDate)}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[100px]">
                          <MapPin className="w-3 h-3 text-gray-450" />
                          {inv.billingCity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-mono text-xs font-black text-blue-600">
                        S/. {inv.total.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold select-none mt-0.5 inline-block">
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
        <div className="col-span-1 lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm text-left">
          {selectedInvoice ? (
            <div className="space-y-6">
              
              {/* Receipt Header info */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-gray-150 select-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">Boleta de Compra</span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-105 font-mono">
                      VALIDADO CHINOOK
                    </span>
                  </div>
                  <h3 className="font-mono font-black text-gray-950 text-xl">{selectedInvoice.id}</h3>
                  <p className="text-xs text-gray-500 font-semibold">Canal de emisión virtual: MusicStore SAC Cusco</p>
                </div>

                <div className="sm:text-right space-y-1 text-xs text-gray-500 font-bold">
                  <p>Fecha de emisión: <strong className="text-gray-900 font-mono">{formatPeruvianDate(selectedInvoice.invoiceDate)}</strong></p>
                  <p className="flex items-center sm:justify-end gap-1">Método: <strong className="text-gray-900 flex items-center gap-0.5"><CreditCard className="w-3.5 h-3.5 text-blue-600" /> Visa Digital</strong></p>
                  <p>Institución Educativa: <strong className="text-gray-900">UAC Cusco - 2025</strong></p>
                </div>
              </div>

              {/* Billing address details */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs space-y-2 select-none">
                <h4 className="font-bold text-gray-800">Detalles de Facturación Virtual</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500 font-semibold">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Destino Legal</span>
                    <p className="text-gray-900 font-bold">{selectedInvoice.billingCity}, {selectedInvoice.billingCountry}</p>
                    <p>Licencia Chinook internacional válida.</p>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Cliente Suscriptor</span>
                    <p className="text-gray-900 font-bold">Eduardo Santos</p>
                    <p>Membresía: Chinook Gold VIP</p>
                  </div>
                </div>
              </div>

              {/* Invoice Lines detail table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Conceptos Adquiridos</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase bg-gray-50 select-none">
                        <th className="py-2.5 px-3 w-8 text-center">#</th>
                        <th className="py-2.5 px-3 pl-2">Track Registrado</th>
                        <th className="py-2.5 px-3 text-center w-12">Cant.</th>
                        <th className="py-2.5 px-3 text-right pr-3 font-mono w-24">Precio (S/.)</th>
                        <th className="py-2.5 px-3 text-right pr-4 font-mono w-28">Subtotal (S/.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedInvoice.lines.map((line, idx) => {
                        const lineSub = line.unitPrice * line.quantity;
                        return (
                          <tr key={line.id || idx} className="text-gray-700 hover:bg-slate-50 transition">
                            <td className="py-3 px-3 text-center font-mono text-[10px] text-gray-400">{idx + 1}</td>
                            <td className="py-3 px-3 pl-2 font-bold text-gray-950 flex items-center gap-1.5 pr-2 truncate max-w-[200px] sm:max-w-none text-left">
                              <Music className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              {line.trackName}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-semibold">{line.quantity}</td>
                            <td className="py-3 px-3 text-right pr-3 font-mono text-gray-500">S/. {line.unitPrice.toFixed(2)}</td>
                            <td className="py-3 px-3 text-right pr-4 font-mono text-gray-950 font-bold">S/. {lineSub.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total calculations details box */}
              <div className="pt-3 border-t border-gray-200 flex flex-col items-end space-y-1.5 select-none font-bold">
                <div className="flex justify-between w-48 text-xs text-gray-500">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono font-bold text-gray-900">S/. {calculateInvoiceSubtotal(selectedInvoice.lines).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 text-xs text-gray-500">
                  <span>IGV (18% Incl.):</span>
                  <span className="font-mono font-bold text-gray-900">S/. { (calculateInvoiceSubtotal(selectedInvoice.lines) * 18/118).toFixed(2) }</span>
                </div>
                <div className="flex justify-between w-48 text-sm font-black text-gray-950 pt-1.5 border-t border-gray-200">
                  <span className="text-gray-600 font-bold">Total Cancelado:</span>
                  <span className="font-mono text-blue-600 text-base font-extrabold">S/. {selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions footer print/dl */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-150">
                <button
                  onClick={() => handleDownloadPDFSim(selectedInvoice)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Comprobante PDF (S/.)
                </button>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-gray-400 select-none">
              No se seleccionó factura. Elige una del panel izquierdo.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
