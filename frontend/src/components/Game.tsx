import { Chess } from "chess.js"
import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { ChessBoard } from "./ChessBoard"

export const INIT_GAME = "init_game"
export const MOVE = "move"

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  const [player, setPlayer] = useState('')

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case INIT_GAME:
            setPlayer(message.payload.color)
            setBoard(chess.board())
            break
        case MOVE:
          chess.move(message.payload.move)
          setBoard(chess.board())
          break
      }
    }
  }, [socket])

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center gap-6 p-4">

      <div className="flex flex-col md:flex-row items-center gap-8">
        <ChessBoard chess={chess} player={player} socket={socket} board={board} setBoard={setBoard} />

        <button
          onClick={() =>
            socket?.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Play Now
        </button>
      </div>
    </div>
  )
}
