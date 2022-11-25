import { z } from 'zod';
import { procedure, router } from '../trpc';
import {PokemonClient} from 'pokenode-ts'


export const appRouter = router({
  'get-pokemon-by-id': procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ input }) => {
      const api = new PokemonClient()
      const pokemon =  api.getPokemonById(input.id)
      return pokemon
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;