import Header from "./components/Header";
import Player from "./components/Player";
import SongList from "./components/SongList";
import StatusBar from "./components/StatusBar";
import Transport from "./components/Transport";
import { show } from "../data/show";

export default function Home() {
  const currentSong = show.songs[0];

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <div className="flex flex-1">
        <SongList songs={show.songs} />

        <section className="flex flex-1 flex-col p-8">
          <Player song={currentSong} />
          <Transport />
        </section>
      </div>

      <StatusBar />
    </main>
  );
}