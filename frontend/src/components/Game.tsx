"use client"

import { Chess } from "chess.js"
import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { ChessBoard } from "./ChessBoard"
import { Sidebar } from "./Sidebar"

export const INIT_GAME = "init_game"
export const MOVE = "move"

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  const [playerColor, setPlayerColor] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [opponent, setOpponent] = useState('Opponent')

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
            setOpponent('GUEST123567')
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
    <div className="w-screen h-screen overflow-x-hidden bg-zinc-800 text-white flex flex-col justify-center items-center gap-6 p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <ChessBoard
          chess={chess}
          playerColor={playerColor}
          socket={socket}
          board={board}
          setBoard={setBoard}
          opponent={opponent}
        />
        <Sidebar socket={socket} connected={connected} setOpponent={setOpponent}/>
       
      </div>
    </div>
  )
}
