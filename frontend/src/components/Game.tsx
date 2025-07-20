"use client"

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
  const [playerColor, setPlayerColor] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!socket) return
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      switch (message.type) {
        case INIT_GAME:
          if(message.payload.color){
            const newGame = new Chess()
            setChess(newGame)   
            setPlayerColor(message.payload.color)
            setConnected(true)
            setBoard(chess.board())
          }
          break

        case MOVE:
          chess.move(message.payload.move)
          setBoard(chess.board())
          break
      }
    }
  }, [socket, chess])

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center gap-6 p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <ChessBoard
          chess={chess}
          playerColor={playerColor}
          socket={socket}
          board={board}
          setBoard={setBoard}
        />

        <button
          onClick={() =>
            socket?.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 md:px-6 md:py-3 rounded-lg shadow-lg transition-transform"
          disabled={connected}
        >
          {connected ? 'In Play' : 'Play Online'}
        </button>
      </div>
    </div>
  )
}
