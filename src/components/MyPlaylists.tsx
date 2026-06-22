import React, { useState, useMemo } from 'react';
import { Playlist, Track } from '../types';
import { 
  Plus, Play, Trash2, ListMusic, Music, Search, Disc, 
  HelpCircle, Volume2, SkipForward, SkipBack, Pause
} from 'lucide-react';

interface MyPlaylistsProps {
  playlists: Playlist[];
  tracks: Track[];
  playlistTracksMap: Record<number, number[]>;
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: number) => void;
  onRemoveTrackFromPlaylist: (playlistId: number, trackId: number) => void;
  onPlayTrack: (track: Track) => void;
  nowPlaying: Track | null;
  onTogglePlay: () => void;
  isPlaying: boolean;
}

export default function MyPlaylists({
  playlists,
  tracks,
  playlistTracksMap,
  onCreatePlaylist,
  onDeletePlaylist,
  onRemoveTrackFromPlaylist,
  onPlayTrack,
  nowPlaying,
  onTogglePlay,
  isPlaying,
}: MyPlaylistsProps) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number>(
    playlists.length > 0 ? playlists[0].id : 1
  );
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPlaylist = useMemo(() => {
    return playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];
  }, [playlists, selectedPlaylistId]);

  // Derive tracks belonging to this playlist
  const playlistTracks = useMemo(() => {
    if (!selectedPlaylist) return [];
    const trackIds = playlistTracksMap[selectedPlaylist.id] || [];
    return tracks.filter((t) => trackIds.includes(t.id));
  }, [tracks, selectedPlaylist, playlistTracksMap]);

  const filteredPlaylists = useMemo(() => {
    return playlists.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [playlists, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
  };

  const currentTrackIndex = useMemo(() => {
    if (!nowPlaying || playlistTracks.length === 0) return -1;
    return playlistTracks.findIndex(t => t.id === nowPlaying.id);
  }, [nowPlaying, playlistTracks]);

  const handleNextTrack = () => {
    if (playlistTracks.length === 0) return;
    let nextIndex = 0;
    if (currentTrackIndex !== -1 && currentTrackIndex < playlistTracks.length - 1) {
      nextIndex = currentTrackIndex + 1;
    }
    onPlayTrack(playlistTracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (playlistTracks.length === 0) return;
    let prevIndex = playlistTracks.length - 1;
    if (currentTrackIndex > 0) {
      prevIndex = currentTrackIndex - 1;
    }
    onPlayTrack(playlistTracks[prevIndex]);
  };

  return (
    <div id="my-playlists-view" className="space-y-6 font-sans">
      
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight">Mis Listas de Reproducción</h2>
          <p className="text-xs text-gray-500 mt-1">
            Crea colecciones personalizadas de música o edita tus playlists sincronizadas con Chinook.
          </p>
        </div>

        {/* Local Playlist search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-450">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Filtrar playlist por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition shadow-sm"
          />
        </div>
      </div>

      {/* Split grid layout of channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Playlists Left Side control column (4 cols) */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          
          {/* Create new playlist form panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-sm text-left">
            <h3 className="font-bold text-xs tracking-wider text-gray-700 flex items-center gap-1.5 uppercase select-none">
              <Plus className="w-4 h-4 text-blue-600" />
              Nueva Playlist
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-2">
              <input
                id="playlist-name-input"
                type="text"
                placeholder="Nombre de la nueva lista..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition font-sans"
              />
              <button
                type="submit"
                className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold text-xs rounded-xl transition shadow shadow-blue-100"
              >
                Crear Playlist Vacía
              </button>
            </form>
          </div>

          {/* List of existing playlists */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 space-y-3 shadow-sm text-left">
            <span className="font-bold text-xs tracking-wider text-gray-700 uppercase block select-none">
              Mis Carpetas de Música ({filteredPlaylists.length})
            </span>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredPlaylists.map((pl) => {
                const isActive = selectedPlaylist?.id === pl.id;
                return (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPlaylistId(pl.id)}
                    className={`p-3 rounded-xl border cursor-pointer text-left transition flex justify-between items-center group ${
                      isActive
                        ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-105'
                        : 'bg-white border-gray-150 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 pr-2 truncate">
                      <ListMusic className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="truncate">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-blue-800' : 'text-gray-950'}`}>{pl.name}</p>
                        <p className="text-[10px] text-gray-450 font-semibold">{pl.trackCount} temas guardados</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      {pl.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la playlist "${pl.name}"?`)) {
                              onDeletePlaylist(pl.id);
                              if (selectedPlaylistId === pl.id) {
                                setSelectedPlaylistId(playlists.length > 0 ? playlists[0].id : 1);
                              }
                            }
                          }}
                          className="p-1 text-gray-450 hover:text-red-655 rounded transition hover:bg-red-50 text-gray-400 hover:text-red-600"
                          title="Eliminar esta lista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Tracks List Right Side details column (8 cols) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* Now Playing Dynamic Player Controller Module with premium styled Blue colors */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-650 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden select-none flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[25px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3.5 pr-2 truncate w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              </div>
              <div className="truncate text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-105 block mb-0.5">
                  Reproduciendo Ahora
                </span>
                {nowPlaying ? (
                  <>
                    <p className="text-xs font-bold text-white truncate leading-none mb-1">{nowPlaying.name}</p>
                    <p className="text-[10px] text-blue-100 truncate leading-none">{nowPlaying.composer || 'Desconocido'}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-blue-100 leading-none mb-1">Sin pista activa</p>
                    <p className="text-[10px] text-blue-200 leading-none font-semibold">Pulsa reproducir en una canción</p>
                  </>
                )}
              </div>
            </div>

            {/* Media controllers */}
            <div className="flex items-center gap-3 bg-white/10 border border-white/5 rounded-2xl px-4 py-2 shrink-0 select-none">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 text-blue-100 hover:text-white transition cursor-pointer"
                title="Pista anterior"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={onTogglePlay}
                className="p-2.5 rounded-full bg-white hover:bg-gray-100 text-blue-750 text-blue-700 transition cursor-pointer shadow-sm"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 text-blue-100 hover:text-white transition cursor-pointer"
                title="Siguiente pista"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Animated sound equalizer columns */}
            <div className="flex gap-0.5 items-end h-8 shrink-0 pr-2 hidden md:flex select-none">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 2, 4].map((h, i) => (
                <span
                  key={i}
                  className={`w-[2px] bg-white rounded-full transition-all block ${
                    isPlaying ? 'animate-pulse' : 'h-1'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(4, h * 6)}px` : '4px',
                    transitionDuration: '200ms',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Active playlist tracks lists */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
            {selectedPlaylist ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none pb-2 border-b border-gray-150">
                  <h3 className="font-bold text-base text-gray-900 flex items-center gap-1.5 text-left">
                    <ListMusic className="w-4.5 h-4.5 text-blue-600" />
                    {selectedPlaylist.name}
                  </h3>
                  <span className="text-xs text-gray-500 font-bold">({playlistTracks.length} temas)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 font-bold bg-gray-50 text-gray-500 select-none">
                        <th className="py-2.5 px-3 text-center w-12">#</th>
                        <th className="py-2.5 px-3 pl-2">Canción</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell">Compositor</th>
                        <th className="py-2.5 px-3 hidden md:table-cell">Género</th>
                        <th className="py-2.5 px-3 text-center w-16">Durac.</th>
                        <th className="py-2.5 px-3 text-center w-20">Auditar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {playlistTracks.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-gray-400 text-xs">
                            <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            Esta playlist está vacía. ¡Explora el catálogo y agrega tracks hoy!
                          </td>
                        </tr>
                      ) : (
                        playlistTracks.map((track, index) => {
                          const isActiveNow = nowPlaying?.id === track.id;
                          return (
                            <tr
                              key={track.id}
                              className={`group hover:bg-slate-50 transition ${
                                isActiveNow ? 'text-blue-750 bg-blue-50/50 font-bold' : 'text-gray-750 text-gray-700'
                              }`}
                            >
                              <td className="py-3 px-3 text-center font-mono font-bold text-gray-400">
                                {index + 1}
                              </td>
                              <td className="py-3 px-3 pl-2 truncate max-w-[150px] sm:max-w-none text-left">
                                <div className="font-bold text-gray-950 flex items-center gap-1">
                                  {isActiveNow && <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                  {track.name}
                                </div>
                                <div className="text-[10px] text-gray-500 font-semibold sm:hidden truncate">{track.composer}</div>
                              </td>
                              <td className="py-3 px-3 text-xs text-gray-500 truncate max-w-[180px] hidden sm:table-cell text-left">
                                {track.composer || 'Desconocido'}
                              </td>
                              <td className="py-3 px-3 text-xs text-gray-500 hidden md:table-cell text-left font-semibold">
                                {track.genre}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-gray-500 select-none">
                                {track.duration}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => onPlayTrack(track)}
                                    className={`p-1.5 rounded-lg transition border cursor-pointer ${
                                      isActiveNow 
                                        ? 'bg-blue-600 text-white border-transparent' 
                                        : 'bg-white text-gray-400 hover:text-blue-600 border-gray-200 hover:bg-blue-50'
                                    }`}
                                    title="Reproducir gratis"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`¿Deseas desvincular la canción "${track.name}" de esta playlist?`)) {
                                        onRemoveTrackFromPlaylist(selectedPlaylist.id, track.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition cursor-pointer"
                                    title="Remover de la playlist"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-gray-450 select-none">
                Selecciona una playlist del panel izquierdo para ver sus canciones.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
