import React, { useState, useMemo } from 'react';
import { Album, Artist } from '../types';
import { 
  PlusCircle, Edit, Trash2, Search, X, Disc, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminAlbumsProps {
  albums: Album[];
  artists: Artist[];
  onAddAlbum: (album: Album) => void;
  onUpdateAlbum: (album: Album) => void;
  onDeleteAlbum: (id: number) => void;
}

export default function AdminAlbums({
  albums,
  artists,
  onAddAlbum,
  onUpdateAlbum,
  onDeleteAlbum,
}: AdminAlbumsProps) {
  const [search, setSearch] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<'name' | 'artist' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAlbumToEdit, setCurrentAlbumToEdit] = useState<Album | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formArtistName, setFormArtistName] = useState('');
  const [formGenre, setFormGenre] = useState('Rock');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formReleaseYear, setFormReleaseYear] = useState(2025);
  const [formPrice, setFormPrice] = useState(19.90);

  // Extract all unique genres for filter options
  const genres = useMemo(() => {
    const list = new Set<string>();
    albums.forEach(a => { if (a.genre) list.add(a.genre); });
    return ['Todos', ...Array.from(list)];
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    let result = albums.filter(album => {
      const q = search.toLowerCase();
      const matchSearch = 
        album.name.toLowerCase().includes(q) || 
        album.artistName.toLowerCase().includes(q);
      
      const matchGenre = selectedGenreFilter === 'Todos' || album.genre === selectedGenreFilter;
      
      return matchSearch && matchGenre;
    });

    // Sorting
    result.sort((a, b) => {
      let valA: any = a.name;
      let valB: any = b.name;
      
      if (sortBy === 'artist') {
        valA = a.artistName;
        valB = b.artistName;
      } else if (sortBy === 'price') {
        valA = a.price;
        valB = b.price;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [albums, search, selectedGenreFilter, sortBy, sortOrder]);

  // Paginated albums
  const paginatedAlbums = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlbums.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlbums, currentPage]);

  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);

  const handleToggleSort = (field: 'name' | 'artist' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormArtistName(artists.length > 0 ? artists[0].name : 'AC/DC');
    setFormGenre('Rock');
    setFormPrice(19.90);
    setFormReleaseYear(2025);
    setFormCoverUrl('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (album: Album) => {
    setCurrentAlbumToEdit(album);
    setFormName(album.name);
    setFormArtistName(album.artistName);
    setFormGenre(album.genre);
    setFormPrice(album.price);
    setFormReleaseYear(album.releaseYear);
    setFormCoverUrl(album.coverUrl);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formArtistName) {
      alert('Ingresa el título del álbum y selecciona el artista.');
      return;
    }

    const nextId = albums.reduce((max, a) => a.id > max ? a.id : max, 0) + 1;
    const defaultCover = formCoverUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60";

    const newAlbum: Album = {
      id: nextId,
      name: formName,
      artistName: formArtistName,
      coverUrl: defaultCover,
      genre: formGenre,
      releaseYear: Number(formReleaseYear),
      tracksCount: 0,
      price: Number(formPrice),
    };

    onAddAlbum(newAlbum);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAlbumToEdit) return;

    const updatedAlbum: Album = {
      ...currentAlbumToEdit,
      name: formName,
      artistName: formArtistName,
      genre: formGenre,
      price: Number(formPrice),
      releaseYear: Number(formReleaseYear),
      coverUrl: formCoverUrl,
    };

    onUpdateAlbum(updatedAlbum);
    setShowEditModal(false);
  };

  const handleDeleteClick = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el álbum "${name}" de la tienda?`)) {
      onDeleteAlbum(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Mantenimiento de Álbumes</h2>
          <p className="text-xs text-gray-500 mt-1">
            Gestión del inventario de álbumes físicos y de licencias digitales de la base de datos Chinook.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition cursor-pointer self-start shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nuevo Álbum
        </button>
      </div>

      {/* Filter and search panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm select-none">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Buscar por título de álbum o artista..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1" />
          <select
            value={selectedGenreFilter}
            onChange={(e) => { setSelectedGenreFilter(e.target.value); setCurrentPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-700 focus:outline-none cursor-pointer"
          >
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table Card layout */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[10.5px] uppercase tracking-wider">
                <th className="py-3 px-5 w-20">Portada</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleToggleSort('name')}>
                  <div className="flex items-center gap-1">
                    Título Álbum
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleToggleSort('artist')}>
                  <div className="flex items-center gap-1">
                    Artista Asociado
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Género</th>
                <th className="py-3 px-4 text-center">Año lanzamiento</th>
                <th className="py-3 px-4 text-center">Canciones</th>
                <th className="py-3 px-4 text-right cursor-pointer hover:bg-gray-100 transition" onClick={() => handleToggleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    Precio Base
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-5 text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {paginatedAlbums.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-medium">
                    No se encontraron álbumes con los criterios de búsqueda especificados.
                  </td>
                </tr>
              ) : (
                paginatedAlbums.map((album) => (
                  <tr key={album.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 select-none">
                        <img
                          src={album.coverUrl}
                          alt={album.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 truncate max-w-[180px]">{album.name}</td>
                    <td className="py-3 px-4 text-gray-600 font-medium truncate max-w-[150px]">{album.artistName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                        {album.genre}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">{album.releaseYear}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400 font-semibold">{album.tracksCount} tracks</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">S/. {album.price.toFixed(2)}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(album)}
                          className="p-1.5 hover:bg-sky-50 text-sky-600 hover:text-sky-700 rounded-lg transition-all"
                          title="Editar álbum"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(album.id, album.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition-all"
                          title="Eliminar álbum"
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

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500 select-none">
            <span>Mostrando página <strong>{currentPage}</strong> de {totalPages} ({filteredAlbums.length} registros en total)</span>
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

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Disc className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900 font-sans">Registrar Nuevo Álbum</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Título de Álbum *</label>
                <input
                  type="text"
                  placeholder="Ej. Back in Black"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Artista *</label>
                <select
                  value={formArtistName}
                  onChange={(e) => setFormArtistName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {artists.map(art => (
                    <option key={art.id} value={art.name}>{art.name}</option>
                  ))}
                  <option value="AC/DC">AC/DC</option>
                  <option value="Metallica">Metallica</option>
                  <option value="Vivaldi">Vivaldi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Género Principal</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Rock">Rock</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Metal">Metal</option>
                    <option value="Classical">Classical</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Pop">Pop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Precio Unitario (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Año Lanzamiento</label>
                  <input
                    type="number"
                    min="1600"
                    max="2030"
                    value={formReleaseYear}
                    onChange={(e) => setFormReleaseYear(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">URL Portada (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com..."
                    value={formCoverUrl}
                    onChange={(e) => setFormCoverUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
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
                  Crear Álbum
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

            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Edit className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-lg text-gray-900 font-sans">Editar Álbum</h3>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Título de Álbum *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Artista *</label>
                <select
                  value={formArtistName}
                  onChange={(e) => setFormArtistName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {artists.map(art => (
                    <option key={art.id} value={art.name}>{art.name}</option>
                  ))}
                  <option value="AC/DC">AC/DC</option>
                  <option value="Metallica">Metallica</option>
                  <option value="Vivaldi">Vivaldi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Género Principal</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Rock">Rock</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Metal">Metal</option>
                    <option value="Classical">Classical</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Pop">Pop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Precio Unitario (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Año Lanzamiento</label>
                  <input
                    type="number"
                    value={formReleaseYear}
                    onChange={(e) => setFormReleaseYear(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">URL Portada</label>
                  <input
                    type="text"
                    value={formCoverUrl}
                    onChange={(e) => setFormCoverUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
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
