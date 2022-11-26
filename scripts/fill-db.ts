import { PokemonClient } from 'pokenode-ts'
import { prisma } from '../src/utils/prisma'

const doBackfill = async () => {
  const pokeApi = new PokemonClient()

  const allPokemon = await pokeApi.listPokemons(0, 493)

  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }))

  await prisma.pokemon.createMany({ data: formattedPokemon })
}

doBackfill()
