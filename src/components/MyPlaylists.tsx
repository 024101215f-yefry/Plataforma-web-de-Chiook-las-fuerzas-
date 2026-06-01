import React, { useState, useMemo } from 'react';
import { Playlist, Track } from '../types';
import { 
  Plus, Play, Trash2, ListMusic, Music, Search, Disc, 
  HelpCircle, Sparkles, Volume2, SkipForward, SkipBack, Pause, RotateCcw
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mis Listas de Reproducción</h2>
          <p className="text-xs text-gray-400 mt-1">
            Administra tus playlists de Chinook, agrega nuevas o elimina pistas asociadas.
          </p>
        </div>

        {/* Local Playlist search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Buscar playlist por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111125] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] transition"
          />
        </div>
      </div>

      {/* Split grid layout of channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Playlists Left Side control column (5 cols) */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          
          {/* Create new playlist form panel */}
          <div className="bg-[#111125] border border-white/5 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-md">
            <h3 className="font-semibold text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Plus className="w-3.5 h-3.5 text-[#7F77DD]" />
              Nueva Lista de música
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-2">
              <input
                id="playlist-name-input"
                type="text"
                placeholder="Nombre para la playlist..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-[#161630] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7F77DD] transition"
              />
              <button
                type="submit"
                className="w-full text-center py-2 bg-[#7F77DD] hover:bg-[#6e66c4] cursor-pointer text-white font-semibold text-xs rounded-lg transition shadow-md"
              >
                Crear Playlist Vacía
              </button>
            </form>
          </div>

          {/* List of existing playlists */}
          <div className="bg-[#111125] border border-white/5 rounded-2xl p-4 md:p-5 space-y-3 shadow-md">
            <span className="font-semibold text-xs tracking-wider text-white uppercase block">
              Mis Listas ({filteredPlaylists.length})
            </span>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredPlaylists.map((pl) => {
                const isActive = selectedPlaylist?.id === pl.id;
                return (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPlaylistId(pl.id)}
                    className={`p-3 rounded-lg border cursor-pointer text-left transition flex justify-between items-center group ${
                      isActive
                        ? 'bg-[#1c1c3a] border-[#7F77DD]'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 pr-2 truncate">
                      <ListMusic className={`w-4 h-4 ${isActive ? 'text-[#7F77DD]' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-xs font-semibold text-white truncate">{pl.name}</p>
                        <p className="text-[10px] text-gray-500">{pl.trackCount} temas guardados</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {pl.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar la playlist "${pl.name}"?`)) {
                              onDeletePlaylist(pl.id);
                              if (selectedPlaylistId === pl.id) {
                                setSelectedPlaylistId(1);
                              }
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-red-400 group-hover:opacity-100 transition"
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
          
          {/* Now Playing Dynamic Player Controller Module */}
          <div className="bg-[#111125] border border-white/5 rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden select-none flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7F77DD]/10 blur-[30px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3.5 pr-2 truncate w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7F77DD] to-purple-800 flex items-center justify-center text-white shrink-0 shadow shadow-[#7F77DD]/30">
                <Disc className={`w-6 h-6 ${isPlaying ? 'animate-[spin_2s_linear_infinite]' : ''}`} />
              </div>
              <div className="truncate text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7F77DD] block mb-0.5">
                  Reproduciendo Ahora
                </span>
                {nowPlaying ? (
                  <>
                    <p className="text-xs font-bold text-white truncate leading-none mb-1">{nowPlaying.name}</p>
                    <p className="text-[10px] text-gray-400 truncate leading-none">{nowPlaying.composer || 'Desconocido'}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-gray-400 leading-none mb-1">Ninguna pista activa</p>
                    <p className="text-[10px] text-gray-500 leading-none">Selecciona Play para escuchar</p>
                  </>
                )}
              </div>
            </div>

            {/* Media controllers */}
            <div className="flex items-center gap-3 bg-[#161630] border border-white/5 rounded-xl px-4 py-2 shrink-0">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                title="Pista anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="p-2.5 rounded-full bg-[#7F77DD] hover:bg-[#6e66c4] text-white transition cursor-pointer shadow shadow-[#7F77DD]/30"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                title="Siguiente pista"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Animated sound equalizer columns */}
            <div className="flex gap-0.5 items-end h-8 shrink-0 pr-2 hidden md:flex">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 2, 4].map((h, i) => (
                <span
                  key={i}
                  className={`w-[2px] bg-[#7F77DD] rounded-full transition-all duration-300 block ${
                    isPlaying ? 'animate-[pulse_0.8s_infinite]' : 'h-1'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(4, h * 6)}px` : '4px',
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Active playlist tracks lists */}
          <div className="bg-[#111125] border border-white/5 rounded-2xl p-5 md:p-6 shadow-md">
            {selectedPlaylist ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-[#7F77DD]" />
                    {selectedPlaylist.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">({playlistTracks.length} temas)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 font-semibold select-none">
                        <th className="pb-3 text-center w-12">#</th>
                        <th className="pb-3 pl-2">Canción</th>
                        <th className="pb-3 hidden sm:table-cell">Compositor</th>
                        <th className="pb-3 hidden md:table-cell">Género</th>
                        <th className="pb-3 text-center w-16">Durac.</th>
                        <th className="pb-3 text-center w-16">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {playlistTracks.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-gray-500 text-xs">
                            <HelpCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                            Esta playlist está vacía. ¡Explora el catálogo para agregar tracks!
                          </td>
                        </tr>
                      ) : (
                        playlistTracks.map((track, index) => {
                          const isActiveNow = nowPlaying?.id === track.id;
                          return (
                            <tr
                              key={track.id}
                              className={`hover:bg-[#161630]/60 transition ${
                                isActiveNow ? 'text-[#7F77DD] bg-[#7F77DD]/5' : 'text-gray-300'
                              }`}
                            >
                              <td className="py-3 text-center font-mono font-medium text-gray-500">
                                {index + 1}
                              </td>
                              <td className="py-3 pl-2 truncate max-w-[150px] sm:max-w-none">
                                <div className="font-medium text-white">{track.name}</div>
                                <div className="text-[10px] text-gray-500 font-mono sm:hidden truncate">{track.composer}</div>
                              </td>
                              <td className="py-3 text-xs text-gray-400 truncate max-w-[180px] hidden sm:table-cell">
                                {track.composer || 'Desconocido'}
                              </td>
                              <td className="py-3 text-xs text-gray-400 hidden md:table-cell">
                                {track.genre}
                              </td>
                              <td className="py-3 text-center font-mono text-gray-400">
                                {track.duration}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => onPlayTrack(track)}
                                    className={`p-1.5 rounded transition cursor-pointer ${
                                      isActiveNow 
                                        ? 'bg-[#7F77DD] text-white shadow shadow-[#7F77DD]/35' 
                                        : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                                    title="Reproducir gratis"
                                  >
                                    <Play className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`¿Desvincular "${track.name}" de la playlist?`)) {
                                        onRemoveTrackFromPlaylist(selectedPlaylist.id, track.id);
                                      }
                                    }}
                                    className="p-1.5 rounded bg-white/5 hover:bg-red-950/40 text-gray-500 hover:text-red-400 border border-transparent transition cursor-pointer"
                                    title="Remover de la playlist"
                                  >
                                    <Trash2 className="w-3 h-3" />
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
              <div className="py-16 text-center text-xs text-gray-400">
                Selecciona una playlist del panel izquierdo para ver sus canciones.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
