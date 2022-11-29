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
  const {
    data: pokemonPair,
    refetch,
    isLoading,
    isRefetching,
  } = trpc['get-pokemon-pair'].useQuery(undefined, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const voteMutation = trpc['cast-vote'].useMutation()

  const voteForRoundest = (selected: number) => {
    if (!pokemonPair) return

    const { firstPokemon, secondPokemon } = pokemonPair

    if (selected === firstPokemon.id) {
      voteMutation.mutate({
        votedFor: firstPokemon.id,
        votedAgainst: secondPokemon.id,
      })
    } else {
      voteMutation.mutate({
        votedFor: secondPokemon.id,
        votedAgainst: firstPokemon.id,
      })
    }

    refetch()
  }


  return (
    <div className='h-screen w-screen flex flex-col justify-between items-center relative'>
      <div className=' text-2xl text-center pt-8'>
        Which Pokemon is rounder ?
      </div>
      {/* Poke Voting */}
      {!isRefetching && pokemonPair && (
        <div className='border rounded  flex justify-between max-w-3xl items-center p-10 pb-16'>
          <>
            <PokemonListing
              pokemon={pokemonPair.firstPokemon}
              voteForRoundest={() =>
                voteForRoundest(pokemonPair.firstPokemon.id)
              }
            ></PokemonListing>
            <span className='p-8'>Vs</span>
            <PokemonListing
              pokemon={pokemonPair.secondPokemon}
              voteForRoundest={() =>
                voteForRoundest(pokemonPair.secondPokemon.id)
              }
            ></PokemonListing>
          </>
        </div>
      )}
      {isLoading ||
        isRefetching ||
        (!pokemonPair && (
          <Image src='/rings.svg' alt='loading' width={192} height={192} />
        ))}
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

type PokemonFromServer = RouterOutput['get-pokemon-pair']['firstPokemon']

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
