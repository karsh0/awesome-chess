import { WebSocket } from "ws"
import { Game } from "./Game"
import { CREATE_ROOM, INIT_GAME, JOIN_ROOM, MESSAGE, MOVE, ONLINE } from "./messages"

interface Room{
    username: string,
    roomName: string
    socket: WebSocket
}

export class GameManager{
    private pendingUser: WebSocket | null
    private games: Game[]
    private users: WebSocket[]
    private room: Room[]

    constructor(){
        this.pendingUser = null;
        this.games = []
        this.users = []
        this.room = []
    }

    addUser(socket: WebSocket){
        this.users.push(socket)
        this.initHandlers(socket)
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(u => u === socket)
    }

    initHandlers(socket: WebSocket){
        socket.on("message", (data)=>{
            const message = JSON.parse(data.toString())

            if(message.type === INIT_GAME){
                if(this.pendingUser && this.pendingUser !== socket){
                    const game = new Game(socket, this.pendingUser)
                    this.games.push(game)
                    this.pendingUser = null;
                }
                else{
                    this.pendingUser = socket
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket)
                if(game){
                    game.makeMove(socket, message.payload.move)
                }
            }

            if(message.type === MESSAGE){
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket)
                if(game){
                    game.sendMessage(socket, message.payload.message)
                }
            }

            if(message.type === ONLINE){
                socket.send(JSON.stringify({
                    type: ONLINE,
                    online: this.users.length
                }))
            }

            if(message.type === CREATE_ROOM){
                const room = this.room.find(r => r.roomName === message.payload.roomName)

                if(!room){
                    this.room.push({
                        username: message.payload.username,
                        roomName: message.payload.roomName,
                        socket
                    })
                }
            }

            if(message.type === JOIN_ROOM){
                const room = this.room.find(r => r.roomName === message.payload.roomName)

                if(room){
                    const game = new Game(room.socket, socket);
                    this.games.push(game)
                }

                this.room = this.room.filter(r => r.roomName !== message.payload.roomName)
            }

        })
    }
}