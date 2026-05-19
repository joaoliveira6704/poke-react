import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type Pokemon } from "#/types/Pokemon";
import { PokemonCard } from "#/components/cards/PokemonCard";
import { Paginate } from "#/components/Paginate";
import { PokemonCardSkeleton } from "#/components/cards/PokemonCardSkeleton";

export const Route = createFileRoute("/pokedex/")({
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { page } = Route.useSearch();
  const offset = (page - 1) * 20;

  const getPokemons = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
    );
    return response.json();
  };

  const { data, error, isLoading } = useQuery<{
    results: Pokemon[];
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ["pokemons", page],
    queryFn: getPokemons,
  });

  return (
    <div className="flex-1 w-full text-center py-6 px-8">
      <h1 className="text-3xl font-bold">Pokédex</h1>
      <p className="text-neutral-400 mt-2 text-base">
        Search for your favorite pokemons!
      </p>
      <div className="mt-8">
        {error && <p>Error: {error.message}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading &&
            [...Array(20)].map((_, index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          {data &&
            data?.results.map((pokemon, index) => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                idx={offset + index + 1}
              />
            ))}
        </div>

        {data?.next && <Paginate previous={data.previous} next={data.next} />}
      </div>
    </div>
  );
}
