import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { CHECK, GAME_OVER, INIT_GAME, MESSAGE, MOVE } from "./messages";

interface User{
    username: string,
    socket: WebSocket
}

export class Game{
    public player1: User
    public player2: User
    private board: Chess

    constructor(player1: User, player2: User){
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        
        //socket.send messages to both init messages since we have two players

        this.player1.socket.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                username: player1.username,
                opponent: player2.username,
                color:"w"
            }
        }))

        this.player2.socket.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                username: player2.username,
                opponent: player1.username,
                color:"b"
            }
        }))
        
    }

    //make moves

    makeMove(socket: WebSocket, move: {from: string, to: string}){

        try{
            this.board.move(move)
        }catch(e){
            console.log(e)
            return
        }

       
        if(this.board.turn() === "w" && socket === this.player2.socket){
            console.log("invalid move2")
            return;
        }
         if(this.board.turn() === "b" && socket === this.player1.socket){
            console.log("invalid move1")
            return;
        }


        this.player2.socket.send(JSON.stringify({
            type:MOVE,
            payload:{
                move
            },
        }))

        this.player1.socket.send(JSON.stringify({
            type:MOVE,
            payload:{
                move
            },
        }))


        if(this.board.isCheck()){
            if(this.board.turn() === "b"){
                this.player1.socket.send(JSON.stringify({
                    type: CHECK,
                }))
            }else{
                this.player2.socket.send(JSON.stringify({
                    type: CHECK,
                }))
            }
        }

        if(this.board.isGameOver()){
            this.player1.socket.send(JSON.stringify({
                type: GAME_OVER,
                winner: this.board.turn() === "w" ? "black" :"white"
            }))

            this.player2.socket.send(JSON.stringify({
                type: GAME_OVER,
                winner: this.board.turn() === "w" ? "black" :"white"
            }))
            
            return;
        }
    }

    sendMessage(socket: WebSocket, message: string){
        if(socket === this.player2.socket){
            this.player1.socket.send(JSON.stringify({
            type: MESSAGE,
            payload:{
                message
            }
        }))

        }else{

            this.player2.socket.send(JSON.stringify({
                type: MESSAGE,
                payload:{
                    message
                }
            }))
        }
    }
    

}