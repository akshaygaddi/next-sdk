export default function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-semibold">Welcome to Chat Rooms</h2>
        <p className="text-muted-foreground">
          Join existing rooms or create your own to start chatting with others.
          Select a room from the sidebar to begin.
        </p>
      </div>
    </div>
  );
}
