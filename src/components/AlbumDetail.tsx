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
      <div id="album-not-found" className="text-center p-12 space-y-4">
        <HelpCircle className="w-12 h-12 text-[#7F77DD]/40 mx-auto" />
        <p className="text-sm text-white">No se seleccionó ningún álbum.</p>
        <button
          onClick={() => onNavigate('music-catalog')}
          className="px-4 py-1.5 bg-[#7F77DD] text-white rounded-lg text-xs"
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  const isAlbumFullyPurchased = useMemo(() => {
    // If we want to simulate buying the whole album:
    return false;
  }, []);

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
      alert(`Se agregaron ${addedCount} canciones del álbum "${album.name}" al carrito.`);
    } else {
      alert("Todas las pistas de este álbum ya están en tu carrito.");
    }
  };

  return (
    <div id="album-detail-view" className="space-y-8 font-sans">
      
      {/* Back to Catalog controller button */}
      <div>
        <button
          id="back-to-catalog"
          onClick={() => onNavigate('music-catalog')}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Catálogo Digital
        </button>
      </div>

      {/* Album Billboard Cover Panel */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#171735] to-[#121226] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start select-none">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[#7F77DD]/10 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Artwork cover image */}
        <div className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-[#252542]">
          <img
            src={album.coverUrl}
            alt={album.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info header metadata */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F77DD] bg-[#7F77DD]/10 px-2.5 py-1 rounded-full border border-[#7F77DD]/20">
              {album.genre}
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight mt-2.5">
              {album.name}
            </h2>
            <p className="text-sm font-semibold text-gray-300">
              Por <span className="text-white hover:underline cursor-pointer">{album.artistName}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-400">
            <span>Año: <strong className="text-white font-mono">{album.releaseYear}</strong></span>
            <span className="h-1.5 w-1.5 bg-gray-600 rounded-full hidden sm:inline" />
            <span>Pistas totales: <strong className="text-white font-mono">{album.tracksCount} tracks</strong></span>
            <span className="h-1.5 w-1.5 bg-gray-600 rounded-full hidden sm:inline" />
            <span>Licencia: <strong className="text-white font-mono">Chinook Digital Media</strong></span>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start items-center">
            <span className="text-xl font-bold text-white font-mono mr-2">
              Precio Álbum: <span className="text-[#7F77DD]">${album.price.toFixed(2)}</span>
            </span>
            <button
              id={`buy-all-album-${album.id}`}
              onClick={handleBuyAlbumTracks}
              className="px-4 py-2 bg-[#7F77DD] hover:bg-[#6e66c4] cursor-pointer text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Adquirir Álbum Completo
            </button>
          </div>
        </div>
      </div>

      {/* Tracks table block */}
      <div className="bg-[#111125]/90 border border-white/5 rounded-2xl shadow-xl p-5 md:p-6 overflow-hidden">
        <h3 className="font-semibold text-lg text-white mb-4">Lista de Canciones</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold text-gray-400 select-none">
                <th className="pb-3 text-center w-12">N°</th>
                <th className="pb-3 pl-2">Nombre de la pista</th>
                <th className="pb-3 hidden md:table-cell">Compositor / Autor</th>
                <th className="pb-3 text-center w-16 hidden sm:table-cell">
                  <Clock className="w-3.5 h-3.5 mx-auto text-gray-400" />
                </th>
                <th className="pb-3 hidden lg:table-cell">Formato de Medio</th>
                <th className="pb-3 font-mono text-right w-20">Precio</th>
                <th className="pb-3 text-center w-28">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {albumTracks.map((track, idx) => {
                const isAlreadyInCart = cartItems.some((c) => c.id === track.id);
                return (
                  <tr
                    key={track.id}
                    className="group hover:bg-[#161630]/60 transition text-sm text-gray-300"
                  >
                    {/* Index */}
                    <td className="py-3.5 text-center font-mono text-xs text-gray-500 group-hover:text-[#7F77DD] font-semibold">
                      {idx + 1}
                    </td>

                    {/* Track Name */}
                    <td className="py-3.5 pl-2 font-medium text-white max-w-[200px] sm:max-w-none truncate">
                      {track.name}
                    </td>

                    {/* Composer */}
                    <td className="py-3.5 hidden md:table-cell text-xs text-gray-400 truncate max-w-[240px]">
                      {track.composer || 'Anónimo / Tradicional'}
                    </td>

                    {/* Duration string */}
                    <td className="py-3.5 text-center text-xs font-mono text-gray-400 hidden sm:table-cell">
                      {track.duration}
                    </td>

                    {/* Media format */}
                    <td className="py-3.5 hidden lg:table-cell text-xs text-gray-400 capitalize">
                      {track.mediaType}
                    </td>

                    {/* Price list */}
                    <td className="py-3.5 font-mono text-xs text-right text-gray-300 font-semibold">
                      ${track.unitPrice.toFixed(2)}
                    </td>

                    {/* Action buttons list */}
                    <td className="py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {/* Play listener */}
                        <button
                          onClick={() => onPlayTrack(track)}
                          className="p-1.5 rounded bg-white/5 hover:bg-[#7F77DD] text-gray-400 hover:text-white transition cursor-pointer"
                          title="Reproducir gratis"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>

                        {/* Add to bill cart */}
                        <button
                          id={`add-track-${track.id}`}
                          onClick={() => onAddTrackToCart(track)}
                          disabled={isAlreadyInCart}
                          className={`p-1.5 rounded transition cursor-pointer ${
                            isAlreadyInCart
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                              : 'bg-[#7F77DD]/10 hover:bg-[#7F77DD] border border-[#7F77DD]/30 text-[#7F77DD] hover:text-white'
                          }`}
                          title={isAlreadyInCart ? "En tu carrito de compra" : "Adquirir esta pista"}
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
