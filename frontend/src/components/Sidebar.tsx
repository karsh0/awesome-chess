"use client"
import { Github, Mail } from "lucide-react";
import { Chatbox } from "./Chatbox";
import { toast, Toaster } from "sonner";
import { INIT_GAME, ONLINE } from "../types/messages";

export function Sidebar({ socket, connected, setOpponent, online }: { socket: WebSocket | null, connected: boolean, setOpponent: any, online: number }) {

    return <div className="w-sm md:w-lg p-5 md:p-8 h-full rounded-lg bg-[#262522]">
            <div className="flex gap-2 items-center mb-4">
                <div className="bg-[#659a1a] rounded-full text-xs w-6 h-6 flex justify-center items-center">{online}</div>
                Online
            </div>
        <div className="h-full flex flex-col justify-between">
            <button
                onClick={() => {
                    setOpponent('Searching....')
                    socket?.send(
                        JSON.stringify({
                            type: INIT_GAME
                        })
                    )
                    socket?.send(
                        JSON.stringify({
                            type: ONLINE
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
                    onClick={() => {
                        navigator.clipboard.writeText('https://awesome-chess-6qva.onrender.com/')
                        toast.success('Link Copied to Clipboard')
                    }}
                    className="bg-zinc-700 hover:bg-zinc-600 flex justify-center items-center gap-2 text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                >
                    <Mail />
                    Invite a friend
                </button>
                <button
                    className="bg-zinc-700 hover:bg-zinc-600 flex justify-center items-center gap-2 text-white text-lg font-bold w-full p-2 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                    onClick={() => window.location.href = "https://github.com/karsh0/awesome-chess"}
                >
                    <Github />
                    Star on Github
                </button>
                <div className="text-sm text-neutral-300 text-center">
                    Built with ❤️ by Grandmaster @karan.
                </div>
            </div>
        </div>
        <Toaster/>
    </div>
}