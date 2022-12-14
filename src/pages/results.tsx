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


const generateCountPercent = (pokemon: PokemonOrderedQueryResult[number]) => {
  const { votesAgainst, votesFor } = pokemon._count
  if (votesFor + votesAgainst === 0) return 0
  return (votesFor / (votesFor + votesAgainst)) * 100
}

const PokemonListing: React.FC<{
  pokemon: PokemonOrderedQueryResult[number]
}> = ({ pokemon }) => {
  return (
    <div className='flex border-b p-2 items-center justify-between'>
      <div className='flex items-center '>
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
      <div className='pr-4'>
        {generateCountPercent(pokemon).toFixed(2) + '%'}
      </div>
    </div>
  )
}

export default function Results({ pokemon }: Props) {
  return (
    <div className='flex flex-col items-center '>
      <h2 className='text-2xl p-4'>Results</h2>
      <div className='flex flex-col w-full max-w-2xl border'>
        {pokemon
          ?.sort((a, b) => {
            const difference = generateCountPercent(b) - generateCountPercent(a)

            if (difference === 0) {
              return b._count.votesFor - a._count.votesFor
            }

            return difference
          })
          .map((currPoke, index) => (
            <PokemonListing pokemon={currPoke} key={index} />
          ))}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const DAY_IN_SECONDS = 60 * 60 * 24
  const pokemonOrdered = await getPokemonInOrder()
  return { props: { pokemon: pokemonOrdered }, revalidate: DAY_IN_SECONDS }
}
