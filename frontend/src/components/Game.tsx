"use client"

import { Chess } from "chess.js"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { ChessBoard } from "./ChessBoard"
import { Sidebar } from "./Sidebar"

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"
export const CHECK = "check"

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  const [playerColor, setPlayerColor] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [activeColor, setActiveColor] = useState<'w' | 'b' | null>(null)
  const [check, setCheck] = useState(false)
  const [gameOver, setGameOver] = useState<string | null>(null)
  const OpponentRef = useRef('Opponent')
  let opponent = OpponentRef.current;

  useEffect(() => {
    if (!socket) return
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      switch (message.type) {
        case INIT_GAME:
          if (message.payload.color) {
            const newGame = new Chess()
            setChess(newGame)
            setPlayerColor(message.payload.color === "w" ? "b" :"w")
            OpponentRef.current = "GUEST123456"
            setConnected(true)
            setBoard(newGame.board())
            setActiveColor('w')
          }
          break

        case MOVE:
          chess.move(message.payload.move)
          setBoard(chess.board())
          setActiveColor(chess.turn())
          console.log(activeColor)
          console.log(check)
          console.log(message.payload.move)
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
    <div className="w-screen h-full md:h-screen overflow-x-hidden bg-zinc-800 text-white flex flex-col justify-center items-center gap-6 p-2 md:p-4">
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
          gameOver={gameOver}
        />
        <Sidebar socket={socket} connected={connected} OpponentRef={OpponentRef} />
      </div>
    </div>
  )
}
