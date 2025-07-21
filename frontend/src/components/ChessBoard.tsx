import type { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useState } from "react"
import { MOVE } from "./Game"
import { Profile } from "./Profile"

const unicodePieces: Record<Color, Record<PieceSymbol, string>> = {
  b: {
    p: "p.png",
    r: "r.png",
    n: "n.png",
    b: "b.png",
    q: "q.png",
    k: "k.png",
  },
  w: {
    p: "P.png",
    r: "R.png",
    n: "N.png",
    b: "B.png",
    q: "Q.png",
    k: "K.png",
  },
}

export function ChessBoard({
  chess,
  playerColor,
  socket,
  board,
  setBoard,
  opponent
}: {
  chess: Chess
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  setBoard: any
  socket: WebSocket | null
  playerColor: string | null
  opponent: string
}) {
  const [from, setFrom] = useState<string | null>(null)
  const isBlack = playerColor === "b"

  const renderedBoard = isBlack ? [...board].reverse() : board
  let time = (new Date).toLocaleTimeString() 

  return (
    <div className="flex flex-col  justify-center items-start text-sm md:text-xl ">
        <Profile username={opponent}/>
      <div className="rounded-sm overflow-hidden">
        {renderedBoard.map((row, i) => {
          const displayedRow = isBlack ? [...row].reverse() : row

          return (
            <div key={i} className="flex">
              {displayedRow.map((piece, j) => {
                const file = isBlack
                  ? String.fromCharCode(104 - j) // 'h' to 'a'
                  : String.fromCharCode(97 + j) // 'a' to 'h'
                const rank = isBlack ? i + 1 : 8 - i
                const square = file + rank

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
                              time,
                            },
                          })
                        )
                        setFrom(null)
                        setBoard(chess.board())
                      }
                    }}
                    className={`
                      w-10 h-10 md:w-25 md:h-25 flex justify-center items-center text-2xl font-bold cursor-pointer transition
                      ${(i + j) % 2 === 0 ? "bg-[#EBECD0]" : "bg-[#739552]"}
                      hover:brightness-110
                    `}
                  >
                    {piece ? (
                      <img
                        src={unicodePieces[piece.color][piece.type]}
                        className="w-8 h-8 md:w-19 md:h-19"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
        <Profile username={'You'}/>
    </div>
  )
}
