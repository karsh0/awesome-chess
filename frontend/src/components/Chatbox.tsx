"use client"
import { useState, useEffect } from "react"

export const MESSAGE = "message"

type MessageType = {
    message: string,
    direction: string,
}

export function Chatbox({ socket }: { socket: WebSocket | null }) {
    const [messages, setMessages] = useState<MessageType[]>([])
    const [input, setInput] = useState("")


    useEffect(() => {
        if (!socket) return;
        const handler = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === MESSAGE) {
                    const newMessage = {
                        message: message.payload.message,
                        direction: "received"
                    }
                    setMessages((prev) => [...prev, newMessage]);
                }
            } catch (err) {
                console.error("[Chatbox] Failed to parse message", err);
            }
        };

        socket.addEventListener("message", handler);
        return () => socket.removeEventListener("message", handler);
    }, [socket])

    const sendMessage = () => {
        if (input.trim() === "") return

        socket?.send(JSON.stringify({
            type: MESSAGE,
            payload: {
                message: input
            }
        }))

        setMessages((prev) => [...prev, { message: input, direction: "sent" }])
        setInput("")
    }



    return (
        <div className="flex flex-col bg-[#1e1e1e] text-white rounded-lg p-4 h-96">
           <div className="flex-1 overflow-y-auto mb-2 space-y-2 text-sm pr-1">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`flex w-full ${
        msg.direction === "sent" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] p-2 rounded break-words ${
          msg.direction === "sent"
            ? "bg-white text-black"
            : "bg-zinc-800 text-white"
        }`}
      >
        {msg.message}
      </div>
    </div>
  ))}
</div>

            <div className="flex gap-2">
                <input
                    className="flex-1 px-2 py-3 rounded bg-zinc-700 outline-none text-sm"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage()
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-[#659a1a] rounded hover:bg-[#7d9f4e] text-sm font-semibold"
                >
                    Send
                </button>
            </div>
        </div>
    )
}
