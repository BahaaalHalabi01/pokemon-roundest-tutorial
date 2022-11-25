import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { GetServerSideProps } from "next"

type Props = {
  first:number,second:number
}
export default function Home({first,second}:Props) {

  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({id:first})
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({id:second})
  
  if(firstPokemon.isLoading || secondPokemon.isLoading) return null

  return (
   <div className='h-screen w-screen flex flex-col justify-center items-center'>
    <div className=' text-2xl text-center '>Which Pokemon is rounder ?</div>
    <div className='border rounded p-8 flex justify-between max-w-3xl items-center mt-2'>
      <div className='w-64 h-64 flex flex-col '><img src={firstPokemon.data?.sprites.front_default} alt='pokemon' className="w-full"/>
      <div className="text-xl text-center capitalize mt-[-2rem]">{firstPokemon.data?.name}</div>
      </div>
      <div className='p-8'>Vs</div>
      <div className='w-64 h-64 flex flex-col '><img src={secondPokemon.data?.sprites.front_default} alt='pokemon' className="w-full"/>
      <div className="text-xl text-center capitalize mt-[-2rem]">{secondPokemon.data?.name}</div>
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