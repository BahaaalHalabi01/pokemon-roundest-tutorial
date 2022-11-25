import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { GetServerSideProps } from "next"

type Props = {
  first:number,second:number
}

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home({first,second}:Props) {

  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({id:first})
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({id:second})
  
  if(firstPokemon.isLoading || secondPokemon.isLoading) return null


  return (
   <div className='h-screen w-screen flex flex-col justify-center items-center'>
    <div className=' text-2xl text-center '>Which Pokemon is rounder ?</div>

    <div className='border rounded  flex justify-between max-w-3xl items-center mt-2 pb-12 p-8'>
      
      <div className='w-64 h-64 flex flex-col items-center'>
      <img src={firstPokemon.data?.sprites.front_default} alt='pokemon' className="w-full"/>
      <span className="text-xl text-center capitalize mt-[-2rem] pb-1">{firstPokemon.data?.name}</span>
      <button className={btn}>Vote</button>
      </div>
      
      <span className='p-8'>Vs</span>

      <div className='w-64 h-64 flex flex-col items-center'>
        <img src={secondPokemon.data?.sprites.front_default} alt='pokemon' className="w-full"/>
      <span className="text-xl text-center capitalize mt-[-2rem] pb-1">{secondPokemon.data?.name}</span>
      <button className={btn}>Vote</button>
      </div>
      
      
      </div>
    </div>
  )
}

export const getServerSideProps:GetServerSideProps =async (context) =>{
  
  const [first,second] = getOptionsForVote()

  return {
    props:{
      first,second
    }
  }
}