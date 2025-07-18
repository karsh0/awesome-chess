import { useEffect, useState } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null)
    
    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:8080')        
        setSocket(ws)
    },[])

    return socket
}