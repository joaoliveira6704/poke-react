import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";

export function PokemonCard({ name, idx }: { name: string; idx: number }) {
  const router = useRouter();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idx}.png`;

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 text-black border-2 border-neutral-800 hover:-translate-y-2 transition-transform duration-300">
      <img
        src={imageUrl}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-contain dark:brightness-80 bg-neutral-900"
      />
      <CardHeader>
        <CardTitle className="text-white/90">
          <span className="text-sm text-white/60">#{idx}</span>{" "}
          {name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Button
          className="w-full bg-white/85 text-black/80 hover:bg-white/75 cursor-pointer"
          onClick={() => router.navigate({ to: `/pokemons/${name}`, name })}
        >
          View Pokemon
        </Button>
      </CardFooter>
    </Card>
  );
}
