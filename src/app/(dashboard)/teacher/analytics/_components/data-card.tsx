import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
}

export const DataCard = ({
  value,
  label,
  shouldFormat,
}: DataCardProps) => {
  return (
    <Card className="glass-card border-white/10 rounded-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {shouldFormat ? formatPrice(value) : value}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
