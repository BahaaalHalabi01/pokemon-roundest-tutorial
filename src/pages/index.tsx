import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { GetServerSideProps } from "next"
import { useState } from "react"


const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {


  const [ids,setIds] = useState(()=>getOptionsForVote())

  const [first,second] = ids


  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({id:first})
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({id:second})
  
  if(firstPokemon.isLoading || secondPokemon.isLoading) return null


  const voteForRoundest = (selected:number) =>{

  setIds(getOptionsForVote())
  }


  return (
   <div className='h-screen w-screen flex flex-col justify-center items-center'>
    <div className=' text-2xl text-center '>Which Pokemon is rounder ?</div>

    <div className='border rounded  flex justify-between max-w-3xl items-center mt-2  p-10 pb-16'>
      
      <div className='w-64 h-64 flex flex-col items-center mt-[-2rem]'>
      <img src={firstPokemon.data?.sprites.front_default || ''} alt='pokemon' className="w-full"/>
      <span className="text-xl text-center capitalize mt-[-2rem] pb-1">{firstPokemon.data?.name}</span>
      <button className={btn} onClick={()=>voteForRoundest(first)}>Vote</button>
      </div>
      
      <span className='p-8'>Vs</span>

      <div className='w-64 h-64 flex flex-col items-center mt-[-2rem]'>
        <img src={secondPokemon.data?.sprites.front_default || ''} alt='pokemon' className="w-full"/>
      <span className="text-xl text-center capitalize mt-[-2rem] pb-1">{secondPokemon.data?.name}</span>
      <button className={btn} onClick={()=>voteForRoundest(second)}>Vote</button>
      </div>
      
      
      </div>
    </div>
  )
}
