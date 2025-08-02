"use client"
import { DoorOpen, Github } from "lucide-react";
import { Chatbox } from "./Chatbox";
import { Toaster } from "sonner";
import { INIT_GAME, ONLINE } from "../types/messages";

export function Sidebar({ socket, connected, setOpponent, setRoomModal }: { socket: WebSocket | null, connected: boolean, setOpponent: any, setRoomModal: any}) {
    
    return <div className="w-sm md:w-lg p-7 md:p-8 h-full rounded-lg bg-[#262522]">
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
                className="bg-[#659a1a] hover:bg-[#7d9f4e] text-white text-lg font-bold w-full p-3 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                disabled={connected}
            >
                {connected ? 'In Play' : 'Start Game'}
            </button>

            <div className="my-4">
                <Chatbox socket={socket} />
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                    <button
                     onClick={()=>{
                        setRoomModal(true)
                     }}
                        className="bg-red-900 flex justify-center items-center gap-2 text-white text-lg font-bold w-full p-3 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
                    > <DoorOpen/> CUSTOM ROOM
                    </button>
                </div>

                <button
                    className="bg-zinc-700 hover:bg-zinc-600 flex justify-center items-center gap-2 text-white text-lg font-bold w-full p-3 md:px-6 md:py-5 rounded-lg shadow-lg cursor-pointer"
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
        <Toaster />
    </div>
}