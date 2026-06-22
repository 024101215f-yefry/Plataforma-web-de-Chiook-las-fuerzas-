import React, { useState, useMemo } from 'react';
import { Artist } from '../types';
import { 
  PlusCircle, Edit, Trash2, Search, X, Users, ChevronLeft, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminArtistsProps {
  artists: Artist[];
  onAddArtist: (artist: Artist) => void;
  onUpdateArtist: (artist: Artist) => void;
  onDeleteArtist: (id: number) => void;
}

export default function AdminArtists({
  artists,
  onAddArtist,
  onUpdateArtist,
  onDeleteArtist,
}: AdminArtistsProps) {
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentArtistToEdit, setCurrentArtistToEdit] = useState<Artist | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');

  const filteredArtists = useMemo(() => {
    return artists.filter(art => {
      return art.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [artists, search]);

  const paginatedArtists = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArtists.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArtists, currentPage]);

  const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);

  const handleOpenAddModal = () => {
    setFormName('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (artist: Artist) => {
    setCurrentArtistToEdit(artist);
    setFormName(artist.name);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Ingresa el nombre del artista.');
      return;
    }

    const nextId = artists.reduce((max, a) => a.id > max ? a.id : max, 0) + 1;
    const newArtist: Artist = {
      id: nextId,
      name: formName.trim(),
    };

    onAddArtist(newArtist);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArtistToEdit) return;
    if (!formName.trim()) {
      alert('Ingresa el nombre del artista.');
      return;
    }

    const updatedArtist: Artist = {
      ...currentArtistToEdit,
      name: formName.trim(),
    };

    onUpdateArtist(updatedArtist);
    setShowEditModal(false);
  };

  const handleDeleteClick = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar al artista "${name}"? Esto afectará los álbumes asociados en la base de datos Chinook.`)) {
      onDeleteArtist(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Directorio de Artistas</h2>
          <p className="text-xs text-gray-500 mt-1">
            Administración completa de solistas, bandas y compositores registrados en nuestra base de datos.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Artista
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm select-none">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre de artista..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <span className="text-xs text-gray-500 font-medium">Total: <strong>{filteredArtists.length}</strong> artistas encontrados</span>

      </div>

      {/* Table container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[10.5px] uppercase tracking-wider select-none">
                <th className="py-3 px-6 w-20 text-center">ID</th>
                <th className="py-3 px-6">Nombre de Artista / Grupo</th>
                <th className="py-3 px-6 text-center w-32">Código Chinook</th>
                <th className="py-3 px-6 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {paginatedArtists.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                    No se encontraron artistas registrados con ese criterio.
                  </td>
                </tr>
              ) : (
                paginatedArtists.map((artist) => (
                  <tr key={artist.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-6 text-center font-mono font-medium text-gray-400">#ART-0{artist.id}</td>
                    <td className="py-4 px-6 font-bold text-gray-900 group-hover:text-blue-600 transition text-sm">{artist.name}</td>
                    <td className="py-3 px-6 text-center text-gray-500 font-mono font-bold text-xs">{artist.id}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(artist)}
                          className="p-1.5 hover:bg-sky-50 text-sky-600 hover:text-sky-700 rounded-lg transition"
                          title="Editar artista"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(artist.id, artist.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition"
                          title="Eliminar artista"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-500 select-none">
            <span>Página <strong>{currentPage}</strong> de {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3 text-left">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900 font-sans">Registrar Artista</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Nombre Completo / Banda *</label>
                <input
                  type="text"
                  placeholder="Ej. Pink Floyd"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
                >
                  Registrar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3 text-left">
              <Edit className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-lg text-gray-900 font-sans">Editar Artista</h3>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Nombre Completo / Banda *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
