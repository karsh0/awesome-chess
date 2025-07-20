import { WebSocket } from "ws"
import { Game } from "./Game"
import { INIT_GAME, MOVE } from "./messages"

export class GameManager{
    private pendingUser: WebSocket | null
    private games: Game[]
    private users: WebSocket[]

    constructor(){
        this.pendingUser = null;
        this.games = []
        this.users = []
    }

    addUser(socket: WebSocket){
        this.users.push(socket)
        this.initHandlers(socket)
    }

    removeUser(socket: WebSocket){
        this.users.filter(u => u === socket)
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
        })
    }
}