"use client"

import { IdCard } from "lucide-react"
import { useRef } from "react"
import { ADD_USER } from "../types/messages"

export function UserModal({ setUserModal, socket }: { setUserModal: any, socket: WebSocket }) {

  const usernameRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] backdrop-blur-xl flex justify-center items-center text-white px-4">
      <div className="w-full max-w-md space-y-6">

        <div className="w-full bg-[#1e1e1e] p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <IdCard className="w-6 h-6 text-green-400" />
            Enter your name
          </h2>

          <div className="space-y-4">
            <input
              ref={usernameRef}
              placeholder="Enter your name"
              className="w-full bg-[#2c2c2c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={()=>{
              socket.send(JSON.stringify({
                type:ADD_USER,
                  payload:{
                    username: usernameRef.current?.value,
                  }
              }))
              setUserModal(false)
            }} 
            className="bg-green-600 hover:bg-green-700 transition text-white text-lg font-semibold w-full py-3 rounded-lg flex justify-center items-center gap-2 shadow-lg">
            <IdCard className="w-5 h-5" />
            ADD ME
          </button>

        </div>
      </div>
    </div>
  )
}
