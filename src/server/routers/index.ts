import { z } from 'zod'
import { procedure, router } from '../trpc'
import { prisma } from '@/utils/prisma'
import { TRPCError } from '@trpc/server'
import { getOptionsForVote } from '@/utils/getRandomPokemon'

export const appRouter = router({
  'get-pokemon-pair': procedure.query(async () => {
    const [first, second] = getOptionsForVote()

    const bothPokemon = await prisma.pokemon.findMany({
      where: { id: { in: [first, second] } },
    })

    if (bothPokemon.length !== 2)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find two Pokemon, please try again.',
      })
    return { firstPokemon: bothPokemon[0], secondPokemon: bothPokemon[1] }
  }),

  'cast-vote': procedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      })

      return { success: true }
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
