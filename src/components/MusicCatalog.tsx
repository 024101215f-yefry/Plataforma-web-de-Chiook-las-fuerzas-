import { Album, ViewType } from '../types';
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ListFilter, Play, ChevronRight, Music, ArrowUpRight } from 'lucide-react';

interface MusicCatalogProps {
  albums: Album[];
  onSelectAlbum: (albumId: number) => void;
  onNavigate: (view: ViewType) => void;
}

export default function MusicCatalog({ albums, onSelectAlbum, onNavigate }: MusicCatalogProps) {
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
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Catálogo de Música Digital</h2>
          <p className="text-xs text-gray-400 mt-1">Busca y adquiere álbumes originales indexados de la base de datos Chinook.</p>
        </div>

        {/* Global Catalog Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="cat-search"
            type="text"
            placeholder="Buscar por álbum o cantante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111125] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD] transition"
          />
        </div>
      </div>

      {/* Main Structural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar Module */}
        <div className="bg-[#111125] border border-white/5 rounded-2xl p-5 space-y-6 lg:sticky lg:top-24 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-semibold text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7F77DD]" />
              Filtros Avanzados
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-gray-400 hover:text-[#7F77DD] font-medium transition cursor-pointer"
            >
              Restablecer
            </button>
          </div>

          {/* Genre selection list checkboxes style */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">Géneros musicales</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {genres.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 text-xs text-gray-300 hover:text-white cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="genre-filter"
                    checked={selectedGenre === genre}
                    onChange={() => setSelectedGenre(genre)}
                    className="accent-[#7F77DD] cursor-pointer"
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Artist select dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">Artista o Autor</label>
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full bg-[#161630] border border-white/10 rounded-lg py-1.5 px-2 text-xs text-gray-200 focus:outline-none focus:border-[#7F77DD] transition cursor-pointer"
            >
              {artists.map((artist) => (
                <option key={artist} value={artist} className="bg-[#111125]">
                  {artist}
                </option>
              ))}
            </select>
          </div>

          {/* Media Format filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">Tipo de soporte / Formato</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full bg-[#161630] border border-white/10 rounded-lg py-1.5 px-2 text-xs text-gray-200 focus:outline-none focus:border-[#7F77DD] transition cursor-pointer"
            >
              <option value="Todos" className="bg-[#111125]">Todos los formatos</option>
              <option value="digital" className="bg-[#111125]">Digital FLAC / MP3 (Chinook)</option>
              <option value="vinilo" className="bg-[#111125]" disabled>Vinilo Físico (Sin stock)</option>
              <option value="cd" className="bg-[#111125]" disabled>Edición Limitada CD (Sin stock)</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">Precio Máximo</label>
              <span className="text-xs font-mono font-semibold text-[#7F77DD]">${maxPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="6.0"
              step="0.1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-full accent-[#7F77DD] cursor-pointer"
            />
          </div>

          {/* Database Details info banner */}
          <div className="bg-[#161630] p-3 rounded-xl border border-white/5 text-[10px] text-gray-500 space-y-1 leading-normal">
            <p className="font-semibold text-gray-400">Chinook Music DB Metadata</p>
            <p>Se cargan pistas en formato digital y licencias originales compatibles.</p>
          </div>
        </div>

        {/* Albums Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filteredAlbums.length === 0 ? (
            <div className="bg-[#111125] border border-white/5 rounded-2xl p-16 text-center space-y-3">
              <ListFilter className="w-12 h-12 text-[#7F77DD]/40 mx-auto" />
              <p className="text-sm font-semibold text-white">No se encontraron álbumes</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No hay resultados para la combinación seleccionada o la búsqueda actual. Intenta flexibilizar los filtros.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#7F77DD] rounded-xl border border-white/10 mt-2 transition cursor-pointer"
              >
                Limpiar todo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="bg-[#111125] border border-white/5 hover:border-[#7F77DD]/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-[#111125]/80 transition group flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden block bg-[#20203a]">
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111125] to-transparent opacity-80" />
                    
                    {/* Badge */}
                    <span className="absolute top-3 left-3 bg-[#111125]/80 backdrop-blur-md text-gray-300 font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-white/10">
                      {album.genre}
                    </span>

                    {/* Price tag */}
                    <span className="absolute bottom-3 right-3 bg-[#7F77DD] text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow shadow-[#7F77DD]/35">
                      ${album.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-white truncate group-hover:text-[#7f77dd] transition">
                        {album.name}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">{album.artistName}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Lanzamiento: {album.releaseYear}</span>
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3 text-gray-400" />
                        {album.tracksCount} pistas
                      </span>
                    </div>

                    <button
                      id={`album-view-btn-${album.id}`}
                      onClick={() => onSelectAlbum(album.id)}
                      className="w-full mt-3 py-2 bg-white/5 hover:bg-[#7F77DD] border border-white/10 hover:border-transparent text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:bg-[#7F77DD]"
                    >
                      Ver Lista de Pistas
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
