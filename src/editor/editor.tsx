import NavigationBar from "./components/navigation-bar";
import SubtitleTable from "./components/subtitle-table";
import VideoEditPanel from "./components/video-edit-panel";

function Editor() {
  return (
    <main>
      <NavigationBar />
      <VideoEditPanel />
      <SubtitleTable />
    </main>
  );
}

export default Editor;
