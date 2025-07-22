"use client"
import { INIT_GAME } from "./Game";

export function Sidebar({ socket, connected, OpponentRef }: { socket: WebSocket | null, connected: boolean, OpponentRef: any}) {

    return <div className="w-sm md:w-lg p-10 h-full rounded-lg bg-[#262522]">
        <div className=" flex flex-col gap-5">
            <button
                onClick={() => {
                    OpponentRef.current = 'Searching....'
                    socket?.send(
                        JSON.stringify({
                            type: INIT_GAME,
                        })
                    )
                }
                }
                className="bg-[#659a1a] hover:bg-[#7d9f4e] text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                disabled={connected}
            >
                {connected ? 'In Play' : 'Start Game'}
            </button>

            <button
                className="bg-zinc-700  text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
            >
                Invite a friend
            </button>
        </div>
    </div>
}