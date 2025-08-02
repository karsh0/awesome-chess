"use client"

import { Chess } from "chess.js"
import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { ChessBoard } from "./ChessBoard"
import { Sidebar } from "./Sidebar"
import { GameOver } from "./GameOver"
import { ADD_USER, CHECK, GAME_OVER, INIT_GAME, JOIN_ROOM, MOVE } from "../types/messages"
import { RoomModal } from "./RoomModal"
import { UserModal } from "./UserModal"

export function Game() {
  const socket = useSocket()
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  const [playerColor, setPlayerColor] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [activeColor, setActiveColor] = useState<'w' | 'b' | null>(null)
  const [check, setCheck] = useState(false)
  const [gameOver, setGameOver] = useState<string | null>(null)
  const [username, setUsername] = useState('You')
  const [opponent, setOpponent] = useState('Opponent')
  const [roomModal, setRoomModal] = useState(false);
  const [userModal, setUserModal] = useState(true);
  const [localUsername, setLocalUsername] = useState<string | null>(null)

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
            setOpponent(message.payload.opponent)
            setUsername(message.payload.username)
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

        case JOIN_ROOM:
          if (message.payload.color) {
            const newGame = new Chess()
            setChess(newGame)
            setPlayerColor(message.payload.color === "w" ? "b" : "w")
            setOpponent(message.payload.opponent)
            setUsername(message.payload.username)
            setConnected(true)
            setBoard(newGame.board())
            setActiveColor('w')
          }
          break
      }
    }
  }, [socket, chess])


  useEffect(() => {
    const username = localStorage.getItem("chess-username")
    if (!username) return;

    setLocalUsername(username)
  }, [])

useEffect(() => {
  if (!socket || !localUsername) return;

  const sendAddUser = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: ADD_USER,
        payload: { username: localUsername }
      }))
    } else {
      // Wait for the socket to open
      socket.addEventListener('open', sendAddUser, { once: true })
    }
  }

  sendAddUser()

}, [socket, localUsername])



  if (!localUsername && userModal) return <UserModal setUserModal={setUserModal} />
  if (roomModal && socket) return <RoomModal setRoomModal={setRoomModal} socket={socket} />

  return (
    <div className="w-screen h-full md:h-screen overflow-x-hidden bg-zinc-800 text-white flex justify-center items-center gap-6  md:p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <ChessBoard
          chess={chess}
          playerColor={playerColor}
          socket={socket}
          board={board}
          setBoard={setBoard}
          username={username}
          opponent={opponent}
          activeColor={activeColor}
          check={check}
          setGameOver={setGameOver}
        />
        <Sidebar socket={socket} connected={connected} setOpponent={setOpponent} setRoomModal={setRoomModal} />
      </div>

      {gameOver && gameOver !== 'Opponent' ?
        <GameOver winner={gameOver!} setGameOver={setGameOver} />
        : null}
    </div>
  )
}
