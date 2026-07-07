const WIDTH = 320;
const HEIGHT = 64;
const GAP = 3;

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Formatea "YYYY-MM-DD" a mano (sin Date/toLocaleDateString) para que el resultado
// sea idéntico sin importar la zona horaria del proceso que renderiza — evita
// mismatches de hidratación por formateo de fecha dependiente del entorno.
function formatDayLabel(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS_ES[month - 1]}`;
}

export function DailyVisitsChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const barWidth = (WIDTH - GAP * (data.length - 1)) / data.length;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={`Visitas diarias de los últimos ${data.length} días`}
    >
      {data.map((d, i) => {
        const h = Math.max((d.count / max) * (HEIGHT - 4), 2);
        const x = i * (barWidth + GAP);
        const y = HEIGHT - h;
        const label = formatDayLabel(d.date);
        return (
          <rect key={d.date} x={x} y={y} width={barWidth} height={h} rx={2} className="fill-accent/70">
            <title>
              {label}: {d.count} {d.count === 1 ? "visita" : "visitas"}
            </title>
          </rect>
        );
      })}
    </svg>
  );
}
