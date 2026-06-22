import { Album, Track, ViewType } from '../types';
import { ArrowLeft, Play, Plus, Clock, HelpCircle, Sparkles, Check } from 'lucide-react';
import { useMemo } from 'react';

interface AlbumDetailProps {
  albumId: number | null;
  albums: Album[];
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  onAddTrackToCart: (track: Track) => void;
  onNavigate: (view: ViewType) => void;
  cartItems: Track[];
}

export default function AlbumDetail({
  albumId,
  albums,
  tracks,
  onPlayTrack,
  onAddTrackToCart,
  onNavigate,
  cartItems,
}: AlbumDetailProps) {
  
  // Find current album
  const album = useMemo(() => {
    return albums.find((a) => a.id === albumId) || albums[0];
  }, [albums, albumId]);

  // Find tracks belonging to this album
  const albumTracks = useMemo(() => {
    if (!album) return [];
    return tracks.filter((t) => t.albumId === album.id);
  }, [tracks, album]);

  if (!album) {
    return (
      <div id="album-not-found" className="text-center p-12 space-y-4 font-sans select-none">
        <HelpCircle className="w-12 h-12 text-blue-500/40 mx-auto" />
        <p className="text-sm text-gray-500">No se ha seleccionado ningún álbum.</p>
        <button
          onClick={() => onNavigate('music-catalog')}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-705 text-white rounded-lg text-xs"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const handleBuyAlbumTracks = () => {
    // Add all tracks of this album to the cart
    let addedCount = 0;
    albumTracks.forEach((track) => {
      const alreadyInCart = cartItems.some((c) => c.id === track.id);
      if (!alreadyInCart) {
        onAddTrackToCart(track);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      alert(`Se agregaron ${addedCount} canciones del álbum "${album.name}" en soles peruanos al carrito.`);
    } else {
      alert("Todas las pistas de este álbum ya están en tu carrito.");
    }
  };

  return (
    <div id="album-detail-view" className="space-y-6 font-sans">
      
      {/* Back to Catalog controller button */}
      <div className="text-left">
        <button
          id="back-to-catalog"
          onClick={() => onNavigate('music-catalog')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Catálogo de Música
        </button>
      </div>

      {/* Album Billboard Cover Panel with elegant vibrant blue/indigo color */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-650 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start select-none">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Artwork cover image */}
        <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-lg border border-white/20 shrink-0 bg-gray-100">
          <img
            src={album.coverUrl}
            alt={album.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info header metadata */}
        <div className="flex-1 space-y-4 text-center md:text-left text-white">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-105 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              {album.genre}
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2.5">
              {album.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-blue-100">
              Por <span className="text-white hover:underline cursor-pointer">{album.artistName}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-blue-100 font-semibold direct-card">
            <span>Año: <strong className="font-mono">{album.releaseYear}</strong></span>
            <span className="h-1.5 w-1.5 bg-white/30 rounded-full hidden sm:inline" />
            <span>Pistas totales: <strong className="font-mono">{album.tracksCount} tracks</strong></span>
            <span className="h-1.5 w-1.5 bg-white/30 rounded-full hidden sm:inline" />
            <span>Licencia: <strong className="font-mono">Chinook Sound Standard</strong></span>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start items-center">
            <span className="text-lg font-black font-mono mr-2">
              Precio Álbum: <span className="text-white bg-white/10 px-2.5 py-0.5 rounded-lg ml-1 font-bold">S/. {album.price.toFixed(2)}</span>
            </span>
            <button
              id={`buy-all-album-${album.id}`}
              onClick={handleBuyAlbumTracks}
              className="px-4 py-2 bg-white hover:bg-gray-100 cursor-pointer text-blue-700 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500 fill-current" />
              Llevar todo el álbum
            </button>
          </div>
        </div>
      </div>

      {/* Tracks table block */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6 overflow-hidden">
        <h3 className="font-bold text-base text-gray-900 mb-4 text-left select-none">Lista de Canciones</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 font-bold bg-gray-50 text-gray-500 select-none">
                <th className="py-2.5 px-3 text-center w-12">N°</th>
                <th className="py-2.5 px-3 pl-2">Título de Pista</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Compositor o Cooperador</th>
                <th className="py-2.5 px-3 text-center w-16 hidden sm:table-cell">
                  <Clock className="w-3.5 h-3.5 mx-auto text-gray-400" />
                </th>
                <th className="py-2.5 px-3 hidden lg:table-cell">Soporte Código</th>
                <th className="py-2.5 px-3 font-mono text-right w-24">Precio Unitario</th>
                <th className="py-2.5 px-3 text-center w-28">Auditar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {albumTracks.map((track, idx) => {
                const isAlreadyInCart = cartItems.some((c) => c.id === track.id);
                return (
                  <tr
                    key={track.id}
                    className="group hover:bg-slate-50 transition text-gray-700"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-3 text-center font-mono text-xs text-gray-400 group-hover:text-blue-600 font-bold select-none">
                      {idx + 1}
                    </td>

                    {/* Track Name */}
                    <td className="py-3.5 px-3 pl-2 font-bold text-gray-950 max-w-[200px] sm:max-w-none truncate text-left">
                      {track.name}
                    </td>

                    {/* Composer */}
                    <td className="py-3.5 px-3 hidden md:table-cell text-xs text-gray-500 truncate max-w-[240px] text-left">
                      {track.composer || 'Anónimo / Tradicional'}
                    </td>

                    {/* Duration string */}
                    <td className="py-3.5 px-3 text-center text-xs font-mono text-gray-500 hidden sm:table-cell select-none">
                      {track.duration}
                    </td>

                    {/* Media format */}
                    <td className="py-3.5 px-3 hidden lg:table-cell text-xs text-gray-400 font-semibold uppercase text-left select-none">
                      {track.mediaType}
                    </td>

                    {/* Price list in Peruvian Soles (S/.) */}
                    <td className="py-3.5 px-3 font-mono text-xs text-right text-blue-600 font-extrabold">
                      S/. {track.unitPrice.toFixed(2)}
                    </td>

                    {/* Action buttons list */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Play listener */}
                        <button
                          onClick={() => onPlayTrack(track)}
                          className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Reproducir muestra gratis"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {/* Add to bill cart */}
                        <button
                          id={`add-track-${track.id}`}
                          onClick={() => onAddTrackToCart(track)}
                          disabled={isAlreadyInCart}
                          className={`p-1.5 rounded-lg transition cursor-pointer border ${
                            isAlreadyInCart
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-150'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                          }`}
                          title={isAlreadyInCart ? "En tu carrito de compra" : "Adquirir esta de forma individual"}
                        >
                          {isAlreadyInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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

    </div>
  );
}
