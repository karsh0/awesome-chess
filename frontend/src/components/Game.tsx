"use client"

import { Chess } from "chess.js"
import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { ChessBoard } from "./ChessBoard"
import { Sidebar } from "./Sidebar"
import { GameOver } from "./GameOver"
import { CHECK, GAME_OVER, INIT_GAME, MOVE } from "../types/messages"

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  const [playerColor, setPlayerColor] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [activeColor, setActiveColor] = useState<'w' | 'b' | null>(null)
  const [check, setCheck] = useState(false)
  const [gameOver, setGameOver] = useState<string | null>(null)
  const [opponent, setOpponent] = useState('Opponent')

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case INIT_GAME:
          if (message.payload.color) {
            const newGame = new Chess()
            setChess(newGame)
            setPlayerColor(message.payload.color === "w" ? "b" : "w")
            setOpponent('GUEST123456')
            setConnected(true)
            setBoard(newGame.board())
            setActiveColor('w')
          }
          break

        case MOVE:
          chess.move(message.payload.move)
          setBoard(chess.board())
          setActiveColor(chess.turn())
          setCheck(false)
          break

        case CHECK:
          setCheck(true)
          break

        case GAME_OVER:
          setGameOver(message.winner)
          break;
      }
    }
  }, [socket, chess])


  return (
    <div className="w-screen h-full md:h-screen overflow-x-hidden relative">
      <div className="w-screen h-full md:h-screen overflow-x-hidden bg-zinc-800 text-white flex justify-center items-center gap-6  md:p-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ChessBoard
            chess={chess}
            playerColor={playerColor}
            socket={socket}
            board={board}
            setBoard={setBoard}
            opponent={opponent}
            activeColor={activeColor}
            check={check}
            setGameOver={setGameOver}
          />
          <Sidebar socket={socket} connected={connected} setOpponent={setOpponent} />
        </div>

      </div>
      {gameOver && gameOver !== 'Opponent' ?
        <GameOver winner={gameOver!} setGameOver={setGameOver} />
        : null}
    </div>
  )
}
