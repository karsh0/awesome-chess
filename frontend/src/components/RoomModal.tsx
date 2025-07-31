"use client"
import { ArrowLeft, DoorOpen, IdCard } from "lucide-react"

export function RoomModal({ setRoomModal }: { setRoomModal: any }) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] backdrop-blur-xl flex justify-center items-center text-white px-4">
      <div className="w-full max-w-md space-y-6">
        <ArrowLeft
          className="cursor-pointer w-6 h-6 hover:text-gray-300 transition"
          onClick={() => setRoomModal(false)}
        />

        <div className="w-full bg-[#1e1e1e] p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <IdCard className="w-6 h-6 text-green-400" />
            Custom Room
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Enter your name"
              className="w-full bg-[#2c2c2c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              placeholder="Enter room name"
              className="w-full bg-[#2c2c2c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button className="bg-green-600 hover:bg-green-700 transition text-white text-lg font-semibold w-full py-3 rounded-lg flex justify-center items-center gap-2 shadow-lg">
            <IdCard className="w-5 h-5" />
            CREATE ROOM
          </button>
          <button className="bg-red-600 hover:bg-red-700 transition text-white text-lg font-semibold w-full py-3 rounded-lg flex justify-center items-center gap-2 shadow-lg">
            <DoorOpen className="w-5 h-5" />
            JOIN ROOM
          </button>
        </div>
      </div>
    </div>
  )
}
