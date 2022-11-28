import { GetStaticProps } from 'next'
import { prisma } from '@/utils/prisma'
import React from 'react'
import type { AsyncReturnType } from '@/utils/ts-helpers'
import Image from 'next/image'

type PokemonOrderedQueryResult = AsyncReturnType<typeof getPokemonInOrder>

type Props = {
  pokemon: PokemonOrderedQueryResult
}

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votesFor: { _count: 'desc' },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votesFor: true,
          votesAgainst: true,
        },
      },
    },
  })
}

const PokemonListing: React.FC<{
  pokemon: PokemonOrderedQueryResult[number]
}> = ({ pokemon }) => {
  return (
    <div className='flex border-b p-2 items-center'>
      <Image
        src={pokemon.spriteUrl || ''}
        alt='pokemon'
        quality={100}
        priority
        width={128}
        height={128}
      />
      <div className='capitalize'>{pokemon.name}</div>
    </div>
  )
}

export default function Results({ pokemon }: Props) {
  return (
    <div className='flex flex-col items-center '>
      <h2 className='text-2xl p-4'>Results</h2>
      <div className='flex flex-col w-full max-w-2xl border'>
        {pokemon?.map((currPoke, index) => (
          <PokemonListing pokemon={currPoke} key={index} />
        ))}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pokemonOrdered = await getPokemonInOrder()
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 }
}
