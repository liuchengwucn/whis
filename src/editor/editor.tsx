import TopMenu from "./components/top-menu";
import SubtitleTable from "./components/subtitle-table";
import VideoEditPanel from "./components/video-edit-panel";

function Editor() {
  return (
    <main className="flex flex-col h-screen w-full p-4">
      <TopMenu />
      <VideoEditPanel />
      <SubtitleTable />
    </main>
  );
}

export default Editor;
