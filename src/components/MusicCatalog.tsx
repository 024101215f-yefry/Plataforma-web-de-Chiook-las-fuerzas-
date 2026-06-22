import { Album, ViewType } from '../types';
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ListFilter, Music, ChevronRight } from 'lucide-react';

interface MusicCatalogProps {
  albums: Album[];
  onSelectAlbum: (albumId: number) => void;
  onNavigate: (view: ViewType) => void;
}

export default function MusicCatalog({ albums, onSelectAlbum}: MusicCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [selectedArtist, setSelectedArtist] = useState<string>('Todos');
  const [mediaType, setMediaType] = useState<string>('Todos');
  const [maxPrice, setMaxPrice] = useState<number>(6.0);

  // Derive unique lists from loaded albums
  const genres = useMemo(() => {
    const list = new Set(albums.map((a) => a.genre));
    return ['Todos', ...Array.from(list)];
  }, [albums]);

  const artists = useMemo(() => {
    const list = new Set(albums.map((a) => a.artistName));
    return ['Todos', ...Array.from(list)];
  }, [albums]);

  // Filter logic
  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchSearch =
        album.name.toLowerCase().includes(search.toLowerCase()) ||
        album.artistName.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === 'Todos' || album.genre === selectedGenre;
      const matchArtist = selectedArtist === 'Todos' || album.artistName === selectedArtist;
      const matchPrice = album.price <= maxPrice;
      const matchMedia = mediaType === 'Todos' || mediaType === 'digital'; // all represent mock digital in Chinook

      return matchSearch && matchGenre && matchArtist && matchPrice && matchMedia;
    });
  }, [albums, search, selectedGenre, selectedArtist, maxPrice, mediaType]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('Todos');
    setSelectedArtist('Todos');
    setMediaType('Todos');
    setMaxPrice(6.0);
  };

  return (
    <div id="music-catalog-view" className="space-y-6 font-sans">
      
      {/* Header title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Catálogo de Música Digital</h2>
          <p className="text-xs text-gray-500 mt-1">Busca e inspecciona los álbumes de la base de datos Chinook con su precio en soles.</p>
        </div>

        {/* Global Catalog Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="cat-search"
            type="text"
            placeholder="Buscar por álbum o cantante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition shadow-sm"
          />
        </div>
      </div>

      {/* Main Structural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar Module */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-6 lg:sticky lg:top-24 shadow-sm text-left">
          <div className="flex items-center justify-between pb-3 border-b border-gray-150">
            <span className="font-bold text-xs tracking-wider text-gray-700 flex items-center gap-2 uppercase">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              Filtros Avanzados
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-gray-450 font-bold hover:text-blue-600 transition cursor-pointer text-gray-500"
            >
              Restablecer
            </button>
          </div>

          {/* Genre selection list checkboxes style */}
          <div className="space-y-2.5">
            <label className="text-[10.5px] font-bold text-gray-405 uppercase tracking-wider block text-gray-400">Géneros Musicales</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {genres.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-xs text-gray-600 hover:text-gray-900 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="genre-filter"
                    checked={selectedGenre === genre}
                    onChange={() => setSelectedGenre(genre)}
                    className="accent-blue-600 cursor-pointer"
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Artist select dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-gray-405 uppercase tracking-wider block text-gray-400">Artista o Autor</label>
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500 transition cursor-pointer font-sans"
            >
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          {/* Media Format filter */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-gray-405 uppercase tracking-wider block text-gray-400">Formato de Licencia</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500 transition cursor-pointer font-sans"
            >
              <option value="Todos">Todos los formatos</option>
              <option value="digital">Digital Lossless FLAC / MP3</option>
              <option value="vinilo" disabled>Vinilo Físico (Sin stock)</option>
              <option value="cd" disabled>CD Edición Limitada (Sin stock)</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10.5px] font-bold text-gray-405 uppercase tracking-wider block text-gray-400">Precio Máximo</label>
              <span className="text-xs font-mono font-bold text-blue-600">S/. {maxPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="6.0"
              step="0.1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Database Details info banner */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-[10px] text-gray-400 space-y-1 leading-normal font-semibold">
            <p className="font-bold text-gray-500">Chinook Music DB Metadata</p>
            <p>Se cargan pistas en formato digital codificadas a 320kbps.</p>
          </div>
        </div>

        {/* Albums Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filteredAlbums.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-3 shadow-sm">
              <ListFilter className="w-12 h-12 text-blue-105 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-900">No se encontraron álbumes</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No hay resultados para la combinación seleccionada o la búsqueda actual. Intenta restablecer los filtros avanzados.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-blue-650 text-blue-600 rounded-xl border border-gray-200 mt-2 transition cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="bg-white border border-gray-200 hover:border-blue-500 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden block bg-gray-100">
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-90" />
                    
                    {/* Badge */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm border border-gray-150">
                      {album.genre}
                    </span>

                    {/* Price tag in Peruvian Soles (S/.) */}
                    <span className="absolute bottom-3 right-3 bg-blue-600 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                      S/. {album.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-gray-950 truncate group-hover:text-blue-600 transition">
                        {album.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate font-semibold">{album.artistName}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                      <span>Año: {album.releaseYear}</span>
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3 text-gray-400" />
                        {album.tracksCount} pistas
                      </span>
                    </div>

                    <button
                      id={`album-view-btn-${album.id}`}
                      onClick={() => onSelectAlbum(album.id)}
                      className="w-full mt-3 py-2 bg-gray-50 hover:bg-blue-600 border border-gray-200 hover:border-transparent text-gray-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      Ver Lista de Canciones
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
