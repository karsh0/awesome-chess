
export function Profile({username}:{username:string}){
    return <div className="w-full flex justify-between py-2">
        <div className="flex gap-2 justify-center items-start text-sm md:text-lg">
            <img className="w-7 h-7 md:w-10 md:h-10" src="./user.png" />
            {username}
        </div>
        <div className="px-7 py-2 bg-zinc-700 rounded-sm font-bold">
            10:00
        </div>
    </div>
}