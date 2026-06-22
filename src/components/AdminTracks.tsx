import React, { useState, useMemo } from 'react';
import { Track, Album, Genre } from '../types';
import { 
  PlusCircle, Edit, Trash2, Search, X, Music, SlidersHorizontal, ChevronLeft, ChevronRight, Play
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminTracksProps {
  tracks: Track[];
  albums: Album[];
  genres: Genre[];
  onAddTrack: (track: Track) => void;
  onUpdateTrack: (track: Track) => void;
  onDeleteTrack: (id: number) => void;
  onPlayTrack?: (track: Track) => void;
}

export default function AdminTracks({
  tracks,
  albums,
  genres,
  onAddTrack,
  onUpdateTrack,
  onDeleteTrack,
  onPlayTrack,
}: AdminTracksProps) {
  const [search, setSearch] = useState('');
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState<string>('Todos');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTrackToEdit, setCurrentTrackToEdit] = useState<Track | null>(null);

  // Form fields for adding or editing
  const [formName, setFormName] = useState('');
  const [formComposer, setFormComposer] = useState('');
  const [formDuration, setFormDuration] = useState('03:30');
  const [formMediaType, setFormMediaType] = useState('MPEG audio file');
  const [formGenre, setFormGenre] = useState('Rock');
  const [formAlbumId, setFormAlbumId] = useState<number>(albums.length > 0 ? albums[0].id : 1);
  const [formUnitPrice, setFormUnitPrice] = useState(1.99);

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = 
        t.name.toLowerCase().includes(q) || 
        (t.composer && t.composer.toLowerCase().includes(q));
      
      const matchAlbum = selectedAlbumFilter === 'Todos' || String(t.albumId) === selectedAlbumFilter;
      
      return matchSearch && matchAlbum;
    });
  }, [tracks, search, selectedAlbumFilter]);

  const paginatedTracks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTracks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTracks, currentPage]);

  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);

  // Map album names for quick access
  const albumMap = useMemo(() => {
    const map: Record<number, string> = {};
    albums.forEach(a => {
      map[a.id] = a.name;
    });
    return map;
  }, [albums]);

  const handleOpenAddModal = () => {
    setFormName('');
    setFormComposer('');
    setFormDuration('03:30');
    setFormMediaType('MPEG audio file');
    setFormGenre(genres.length > 0 ? genres[0].name : 'Rock');
    setFormAlbumId(albums.length > 0 ? albums[0].id : 1);
    setFormUnitPrice(1.99);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (track: Track) => {
    setCurrentTrackToEdit(track);
    setFormName(track.name);
    setFormComposer(track.composer || '');
    setFormDuration(track.duration);
    setFormMediaType(track.mediaType);
    setFormGenre(track.genre);
    setFormAlbumId(track.albumId);
    setFormUnitPrice(track.unitPrice);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      alert('Por favor, ingresa el nombre de la pista.');
      return;
    }

    const nextId = tracks.reduce((max, t) => t.id > max ? t.id : max, 0) + 1;
    const newTrack: Track = {
      id: nextId,
      name: formName,
      composer: formComposer || 'Desconocido',
      duration: formDuration,
      mediaType: formMediaType,
      unitPrice: Number(formUnitPrice),
      genre: formGenre,
      albumId: Number(formAlbumId),
    };

    onAddTrack(newTrack);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrackToEdit) return;
    if (!formName) {
      alert('Por favor, ingresa el nombre de la pista.');
      return;
    }

    const updatedTrack: Track = {
      ...currentTrackToEdit,
      name: formName,
      composer: formComposer || 'Desconocido',
      duration: formDuration,
      mediaType: formMediaType,
      unitPrice: Number(formUnitPrice),
      genre: formGenre,
      albumId: Number(formAlbumId),
    };

    onUpdateTrack(updatedTrack);
    setShowEditModal(false);
  };

  const handleDeleteClick = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente el track "${name}"? Se dará de baja del catálogo Chinook.`)) {
      onDeleteTrack(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Catálogo de Pistas (Tracks)</h2>
          <p className="text-xs text-gray-500 mt-1">
            Mantenimiento y precios por licencias de pistas, composición de metadatos y duraciones.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nueva Pista
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm select-none">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Buscar por título de pista o compositor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">Filtrar por Álbum:</span>
          <select
            value={selectedAlbumFilter}
            onChange={(e) => { setSelectedAlbumFilter(e.target.value); setCurrentPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-700 focus:outline-none cursor-pointer max-w-xs"
          >
            <option value="Todos">Todos los Álbumes</option>
            {albums.map(al => (
              <option key={al.id} value={al.id}>{al.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table details Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[10.5px] uppercase tracking-wider select-none">
                <th className="py-3 px-4 text-center w-12">Play</th>
                <th className="py-3 px-4">Nombre de Pista</th>
                <th className="py-3 px-4">Álbum</th>
                <th className="py-3 px-4">Compositor</th>
                <th className="py-3 px-4">Género</th>
                <th className="py-3 px-4 text-center">Duración</th>
                <th className="py-3 px-4 text-right">Precio Licencia</th>
                <th className="py-3 px-5 text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {paginatedTracks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-medium">
                    No se encontraron tracks en este álbum o con ese término de búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedTracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-50/60 transition group animate-in fade-in duration-100">
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onPlayTrack && onPlayTrack(track)}
                        className="p-1 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition cursor-pointer"
                        title="Escuchar demo"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 truncate max-w-[150px]">{track.name}</td>
                    <td className="py-3 px-4 text-gray-600 font-semibold truncate max-w-[130px]">{albumMap[track.albumId] || 'Álbum Desconocido'}</td>
                    <td className="py-3 px-4 text-gray-400 truncate max-w-[120px]">{track.composer || 'Desconocido'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] border border-gray-200 font-semibold">
                        {track.genre}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-gray-400">{track.duration}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-905">S/. {track.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(track)}
                          className="p-1.5 hover:bg-sky-50 text-sky-600 hover:text-sky-700 rounded-lg transition"
                          title="Editar pista"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(track.id, track.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition"
                          title="Eliminar pista"
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

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500 select-none">
            <span>Página <strong>{currentPage}</strong> de {totalPages} ({filteredTracks.length} tracks registrados)</span>
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
            className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3 text-left">
              <Music className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900 font-sans">Registrar Nueva Pista</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Nombre de Pista *</label>
                <input
                  type="text"
                  placeholder="Ej. Stairway to Heaven"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Álbum Relacionado *</label>
                <select
                  value={formAlbumId}
                  onChange={(e) => setFormAlbumId(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {albums.map(al => (
                    <option key={al.id} value={al.id}>{al.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Compositor / Autor</label>
                  <input
                    type="text"
                    placeholder="Ej. Jimmy Page"
                    value={formComposer}
                    onChange={(e) => setFormComposer(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Género</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {genres.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                    <option value="Rock">Rock</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Metal">Metal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Duración (MM:SS) *</label>
                  <input
                    type="text"
                    placeholder="03:45"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono text-center"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Precio Licencia (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
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
                  Crear Pista
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
            className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3 text-left">
              <Edit className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-lg text-gray-900 font-sans">Editar Pista</h3>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Nombre de Pista *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Álbum Relacionado *</label>
                <select
                  value={formAlbumId}
                  onChange={(e) => setFormAlbumId(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {albums.map(al => (
                    <option key={al.id} value={al.id}>{al.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Compositor / Autor</label>
                  <input
                    type="text"
                    value={formComposer}
                    onChange={(e) => setFormComposer(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Género</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {genres.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                    <option value="Rock">Rock</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Metal">Metal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Duración (MM:SS) *</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono text-center"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Precio Licencia (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
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
