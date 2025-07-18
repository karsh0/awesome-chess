import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket
    public player2: WebSocket
    private board: Chess

    constructor(player1: WebSocket, player2:WebSocket){
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()

        //send messages to both init messages since we have two players

        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }))

        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }))
        
    }

    //make moves

    makeMove(socket: WebSocket, move: {from: string, to: string}){
        try{
            //by default validation
            this.board.move(move)
        }catch(e){
            console.log(e)
            return
        }

        if(this.board.turn() === "b" && socket === this.player1){
            console.log("invalid move1")
        }
        if(this.board.turn() === "w" && socket === this.player2){
            console.log("invalid move2")
        }


        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                winner: this.board.turn() === "w" ? "player 1" :"player 2"
            }))

            this.player2.send(JSON.stringify({
                winner: this.board.turn() === "w" ? "player 1" :"player 2"
            }))
        }


            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move
                },
            }))
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move
                },
            }))
    }

}