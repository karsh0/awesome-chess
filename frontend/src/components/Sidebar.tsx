"use client"
import { Chatbox } from "./Chatbox";
import { INIT_GAME } from "./Game";

export function Sidebar({ socket, connected, OpponentRef }: { socket: WebSocket | null, connected: boolean, OpponentRef: any }) {

    return <div className="w-sm md:w-lg p-10 h-full rounded-lg bg-[#262522]">
        <div className="h-full flex flex-col justify-between">
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

            <div className="my-4">
                <Chatbox socket={socket} />
            </div>

            <div className="flex flex-col gap-5">
                <button
                    className="bg-zinc-700  text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                >
                    Invite a friend
                </button>
                <button
                    className="bg-zinc-700  text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                >
                    Star on Github
                </button>
                <div className="text-sm text-neutral-300 text-center">
                    Built with ❤️ by Grandmaster @karan.
                </div>
            </div>
        </div>
    </div>
}