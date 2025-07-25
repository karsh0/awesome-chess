export function GameOver({ winner, setGameOver}: { winner: string, setGameOver: any }) {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center backdrop-blur-xs bg-opacity-20 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 text-center space-y-4 max-w-sm w-full">
        <h1 className="text-4xl font-bold text-red-500">Game Over</h1>
        <p className="text-xl text-zinc-800 dark:text-zinc-100">
          🏆 Winner: <span className="font-semibold">{winner}</span>
        </p>
        <button
          onClick={() => {
            setGameOver('Opponent');
            window.location.reload()
          }}
         className="bg-[#659a1a] hover:bg-[#7d9f4e] text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
