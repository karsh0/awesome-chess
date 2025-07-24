import type { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useEffect, useRef, useState } from "react"
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
  opponent,
  activeColor,
  check,
  gameOver
}: {
  chess: Chess
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  setBoard: any
  socket: WebSocket | null
  playerColor: string | null
  opponent: string
  activeColor: string | null
  check: boolean,
  gameOver: string | null
}) {
  const [from, setFrom] = useState<string | null>(null)
  const [whiteTime, setWhiteTime] = useState(600)
  const [blackTime, setBlackTime] = useState(600)
  const isBlack = playerColor === "b"

  const renderedBoard = isBlack ? [...board].reverse() : board

  const activeColorRef = useRef(activeColor)

  useEffect(() => {
    activeColorRef.current = activeColor
  }, [activeColor])

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeColorRef.current === "w") {
        setWhiteTime((prev) => Math.max(prev - 1, 0))
      } else if (activeColorRef.current === "b") {
        setBlackTime((prev) => Math.max(prev - 1, 0))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])


  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  useEffect(() => {
    if (check) {
      alert("check")
    }
  }, [check])


  useEffect(()=>{
    if(gameOver){
      alert(gameOver)
    }
  },[gameOver])


  const inCheckSquare = chess.board().flat().find(p => p?.type === "k" && p.color === activeColor)?.square


  return (
    <div className="flex flex-col  justify-center items-start text-sm md:text-xl ">
      <Profile username={opponent} time={playerColor === "w" ? formatTime(blackTime) : formatTime(whiteTime)} />
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
                              }
                            },
                          })
                        )
                        setFrom(null)
                        setBoard(chess.board())
                      }
                    }}
                    className={`${square === inCheckSquare && check ? "bg-red-500" : ""}
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
      <Profile username={'You'} time={playerColor === "w" ? formatTime(whiteTime) : formatTime(blackTime)} />
    </div>
  )
}
