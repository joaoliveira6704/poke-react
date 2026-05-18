import { Button } from "#/components/ui/button";
import type { Pokemon } from "#/types/Pokemon";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pokemons/$name")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();

  const getPokemon = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    console.log(response);
    return response.json();
  };

  const { data, error, isLoading } = useQuery<Pokemon>({
    queryKey: ["pokemon", name],
    queryFn: getPokemon,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex-1 w-full text-center py-6 px-8 flex flex-col mx-auto">
      <h1 className="text-3xl font-bold">
        {data?.name.charAt(0).toUpperCase() + data?.name.slice(1)}
      </h1>
      <Button className="bg-white w-fit text-black mt-4 mx-auto px-12">
        Buy Pokemon
      </Button>
      <div className="flex justify-center">
        <img
          src={`https://raw.githubusercontent.com/wellrccity/pokedex-html-js/refs/heads/master/assets/img/pokemons/poke_${data.id}.gif`}
          className="w-100 object-cover"
          alt={data?.name}
        />
      </div>
    </div>
  );
}
