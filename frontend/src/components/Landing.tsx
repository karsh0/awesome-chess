"use client"

import { useNavigate } from "react-router"

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="w-screen h-screen bg-neutral-900 text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        ♟️ Welcome to ChessZone
      </h1>

      <p className="text-neutral-300 text-lg mb-10 max-w-md text-center">
        Challenge friends or battle the AI. Sharpen your strategy and dominate the board.
      </p>

      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl shadow hover:bg-gray-200 transition"
          onClick={() => navigate("/game")}
        >
          Play Now
        </button>
        <button
          className="px-6 py-3 bg-neutral-700 text-white border border-neutral-500 rounded-xl hover:bg-neutral-600 transition"
          onClick={() => alert("Coming soon: Multiplayer mode!")}
        >
          Multiplayer
        </button>
      </div>

      <div className="mt-16 text-sm text-neutral-500">
        Built with ❤️ for chess lovers.
      </div>
    </div>
  )
}
