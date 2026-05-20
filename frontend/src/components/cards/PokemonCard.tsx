import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import type { Pokemon } from "#/types/Pokemon";
import { useRouter } from "@tanstack/react-router";
import { TYPE_COLORS, FALLBACK_COLORS } from "#/constants/colors";
import FallbackImage from "../images/FallbackImage";

export function PokemonCard({ name, idx }: { name: string; idx: number }) {
  const imageUrl = `https://raw.githubusercontent.com/wellrccity/pokedex-html-js/refs/heads/master/assets/img/pokemons/poke_${idx}.gif`;
  const router = useRouter();
  const { data, isLoading } = useQuery<Pokemon>({
    queryKey: ["pokemon", name],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const primaryType = data?.types?.[0]?.type?.name ?? "";
  const colors = TYPE_COLORS[primaryType] ?? FALLBACK_COLORS;

  return (
    <button
      onClick={() => router.navigate({ to: `/pokedex/${name}`, name })}
      className="relative mx-auto w-full max-w-sm cursor-pointer text-black border-2 border-neutral-800 hover:-translate-y-2 transition-transform duration-300 rounded-xl overflow-hidden"
    >
      <div
        className={`relative aspect-video w-full bg-linear-to-br  ${colors.bg}`}
      >
        <img
          src="/pokeball.png"
          alt="pokeball"
          className="absolute bottom-15 left-30 w-full h-full object-contain opacity-20"
        />
        <FallbackImage
          src={imageUrl}
          fallBackSrc={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${idx.toString().padStart(3, "0")}.png`}
          alt={name}
          className="z-20 absolute top-0 left-20 w-full h-full object-contain dark:brightness-80"
        />
        <div className="absolute bottom-0 left-0 p-3 bg-transparent flex flex-col items-start ">
          <span className="text-black/80 font-bold text-sm">
            #{String(idx).padStart(4, "0")}
          </span>
          <span className="capitalize text-white font-bold text-xl">
            {name}
          </span>
        </div>
      </div>

      {!isLoading && (
        <div className="absolute top-4 left-3 flex gap-1">
          {data?.types?.map((t: any) => (
            <Badge className="bg-white text-black" key={t.type.name}>
              {t.type.name}
            </Badge>
          ))}
        </div>
      )}
    </button>
  );
}
