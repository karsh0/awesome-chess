import { useEffect, useState } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null)
    
    useEffect(()=>{
        const url = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
        const ws = new WebSocket(url)        
        setSocket(ws)
    },[])

    return socket
}