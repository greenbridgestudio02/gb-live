"use client";

import { useState } from "react";

import Header from "./components/Header";
import Player from "./components/Player";
import SongList from "./components/SongList";
import StatusBar from "./components/StatusBar";
import Transport from "./components/Transport";
import { show } from "../data/show";

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSong = show.songs[currentSongIndex];

  function goToPreviousSong() {
    setCurrentSongIndex((currentIndex) =>
      Math.max(currentIndex - 1, 0)
    );
  }

  function goToNextSong() {
    setCurrentSongIndex((currentIndex) =>
      Math.min(currentIndex + 1, show.songs.length - 1)
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <div className="flex flex-1">
        <SongList
          songs={show.songs}
          currentSongIndex={currentSongIndex}
          onSelectSong={setCurrentSongIndex}
        />

        <section className="flex flex-1 flex-col p-8">
          <Player song={currentSong} />

          <Transport
            currentSongIndex={currentSongIndex}
            totalSongs={show.songs.length}
            onPrevious={goToPreviousSong}
            onNext={goToNextSong}
          />
        </section>
      </div>

      <StatusBar />
    </main>
  );
}