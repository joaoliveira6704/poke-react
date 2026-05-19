import { Button } from "#/components/ui/button";
import type { Pokemon } from "#/types/Pokemon";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { TYPE_COLORS, FALLBACK_COLORS } from "#/constants/colors";
import FallbackImage from "#/components/images/FallbackImage";

export const Route = createFileRoute("/pokedex/$name")({
  component: RouteComponent,
});

function StatBar({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  const max = maxValue;
  const pct = Math.round((value / max) * 100);
  const color =
    value >= 100
      ? "bg-green-500"
      : value >= 60
        ? "bg-yellow-400"
        : "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0">
        {label}
      </span>
      <span className="w-8 text-sm font-bold text-gray-700 text-right shrink-0">
        {value}
      </span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RouteComponent() {
  const { name } = Route.useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<Pokemon>({
    queryKey: ["pokemon", name],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) throw new Error("Pokémon not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading Pokédex data…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-red-500 font-semibold text-lg">Pokémon not found</p>
        <Button onClick={() => navigate({ to: "/pokedex" })}>
          <ArrowLeft />
          Back to Pokédex
        </Button>
      </div>
    );
  }

  const primaryType = data.types?.[0]?.type?.name ?? "";
  const colors = TYPE_COLORS[primaryType] ?? FALLBACK_COLORS;

  const id = String(data.id).padStart(4, "0");
  const sprite =
    data.sprites?.other?.["official-artwork"]?.front_default ??
    data.sprites?.front_default;

  const stats = data.stats ?? [];
  const statLabels: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };

  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div
        className={`relative bg-linear-to-br ${colors.bg} overflow-hidden md:rounded-tl-xl`}
      >
        <img
          src="/pokeball.png"
          className="absolute -right-10 -top-10 w-72 opacity-10 select-none pointer-events-none"
          aria-hidden="true"
          alt=""
        />
        <div className="relative z-10 pt-6 px-6">
          <button
            onClick={() => navigate({ to: "/pokedex" })}
            className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft /> Pokédex
          </button>
        </div>

        <div className="relative z-10 px-6 pt-3 pb-4 flex items-end justify-between">
          <div>
            <p className="text-white/60 text-sm font-semibold tracking-widest uppercase">
              #{id}
            </p>
            <h1 className="text-white text-4xl font-extrabold capitalize tracking-tight leading-none mt-0.5">
              {data.name}
            </h1>
            <div className="flex gap-2 mt-3">
              {data.types?.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-3 py-0.5 rounded-full bg-white/25 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center pb-0 h-48">
          <FallbackImage
            src={`https://raw.githubusercontent.com/wellrccity/pokedex-html-js/refs/heads/master/assets/img/pokemons/poke_${data.id}.gif`}
            fallBackSrc={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${data.id.toString().padStart(3, "0")}.png`}
            alt={name}
            className="z-20 w-full h-full object-contain dark:brightness-80"
            //                                     ^ drop `absolute top-0 left-20` too
          />
        </div>
      </div>
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 relative z-20 px-6 pt-8 pb-10 shadow-lg">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Height", value: `${heightM} m` },
            { label: "Weight", value: `${weightKg} kg` },
            {
              label: "Abilities",
              value:
                data.abilities
                  ?.slice(0, 1)
                  .map((a) => a.ability.name.replace("-", " "))
                  .join(", ") ?? "—",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className={`${colors.light} rounded-2xl p-3 flex flex-col items-center gap-1`}
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}
              </span>
              <span className="text-sm font-bold text-gray-800 capitalize text-center">
                {value}
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-base font-extrabold text-gray-800 mb-4 uppercase tracking-widest">
          Base Stats
        </h2>
        <div className="flex flex-col gap-3">
          {stats.map((s) => (
            <StatBar
              key={s.stat.name}
              label={statLabels[s.stat.name] ?? s.stat.name}
              value={s.base_stat}
              maxValue={100}
            />
          ))}
          <StatBar
            label="Total"
            value={stats.reduce((acc, s) => acc + s.base_stat, 0)}
            maxValue={600}
          />
        </div>
        {data.moves && data.moves.length > 0 && (
          <>
            <h2 className="text-base font-extrabold text-gray-800 mt-8 mb-4 uppercase tracking-widest">
              Moves
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.moves.slice(0, 12).map(({ move }) => (
                <span
                  key={move.name}
                  className={`${colors.badge} ${colors.text} text-xs font-semibold capitalize px-3 py-1 rounded-full`}
                >
                  {move.name.replace("-", " ")}
                </span>
              ))}
              {data.moves.length > 12 && (
                <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
                  +{data.moves.length - 12} more
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
