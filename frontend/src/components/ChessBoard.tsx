import type { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useState } from "react"
import { MOVE } from "./Game"

const unicodePieces: Record<Color, Record<PieceSymbol, string>> = {
  w: {
    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
  },
  b: {
    p: "♟︎",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
  },
}

export function ChessBoard({
  chess,
  player,
  socket,
  board,
  setBoard,
}: {
  chess: Chess
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  setBoard: any
  socket: WebSocket | null,
  player: string
}) {
  const [from, setFrom] = useState<string | null>(null)

  return (
    <div className="flex justify-center items-center">
      <div className="">
        {player} 
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((piece, j) => {
              const square = String.fromCharCode(97 + j) + (8 - i)
              const isSelected = from === square

              return (
                <div
                  key={j}
                  onClick={() => {
                    if (!from) {
                      setFrom(piece?.square ?? square)
                    } else {
                      socket?.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            move: {
                              from,
                              to: square,
                            },
                          },
                        })
                      )
                      setFrom(null)
                      setBoard(chess.board())
                    }
                  }}
                  className={`
                    w-16 h-16 flex justify-center items-center text-2xl font-bold cursor-pointer transition
                    ${(i + j) % 2 === 0 ? "bg-green-500" : "bg-green-300"}
                    ${isSelected ? "ring-3 ring-yellow-400" : ""}
                    hover:brightness-110
                  `}
                >
                  {piece ? unicodePieces[piece.color][piece.type] : ""}
                </div>
              )
            })}
          </div>
        ))}
        {player === "white" ? "black" : "white"}
      </div>
    </div>
  )
}
