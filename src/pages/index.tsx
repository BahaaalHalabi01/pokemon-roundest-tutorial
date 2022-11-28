import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { RouterOutput, trpc } from '@/utils/trpc'
import { useState } from 'react'
import { PropsWithChildren } from 'react'
import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const btn =
  'inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'

export default function Home() {
  const [ids, setIds] = useState(() => getOptionsForVote())

  const [first, second] = ids

  const firstPokemon = trpc['get-pokemon-by-id'].useQuery({ id: first })
  const secondPokemon = trpc['get-pokemon-by-id'].useQuery({ id: second })

  const voteMutation = trpc['cast-vote'].useMutation()

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second })
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first })
    }

    setIds(getOptionsForVote())
  }

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data

  return (
    <div className='h-screen w-screen flex flex-col justify-between items-center relative'>
      <div className=' text-2xl text-center pt-8'>
        Which Pokemon is rounder ?
      </div>
      {/* Poke Voting */}
      {dataLoaded && (
        <div className='border rounded  flex justify-between max-w-3xl items-center p-10 pb-16'>
          <>
            <PokemonListing
              pokemon={firstPokemon.data}
              voteForRoundest={() => voteForRoundest(first)}
            ></PokemonListing>
            <span className='p-8'>Vs</span>
            <PokemonListing
              pokemon={secondPokemon.data}
              voteForRoundest={() => voteForRoundest(second)}
            ></PokemonListing>
          </>
        </div>
      )}
      {!dataLoaded && (
        <Image src='/rings.svg' alt='loading' width={192} height={192} />
      )}
      <div className=' w-full text-xl text-center pb-4'>
        <a href='https://github.com/BahaaalHalabi01/pokemon-roundest-tutorial'>
          Github Repo
        </a>
        <span className='border-r mx-4'></span>
        <Link href='/results'>Results Page</Link>
      </div>
    </div>
  )
}

type PokemonFromServer = RouterOutput['get-pokemon-by-id']

type PropsPoke = {
  pokemon: PokemonFromServer
  voteForRoundest: () => void
}

const PokemonListing: React.FC<PropsWithChildren<PropsPoke>> = ({
  pokemon,
  children,
  voteForRoundest,
}) => {
  return (
    <div className='flex flex-col items-center mt-[-2rem]'>
      <Image
        src={pokemon.spriteUrl || ''}
        alt='pokemon'
        quality={100}
        priority
        width={256}
        height={256}
      />
      <span className='text-xl text-center capitalize mt-[-2rem] pb-1'>
        {pokemon.name}
      </span>
      <button className={btn} onClick={() => voteForRoundest()}>
        Vote
      </button>
    </div>
  )
}
