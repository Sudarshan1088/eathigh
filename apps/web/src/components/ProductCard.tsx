import type { ScanResult } from "@eathigh/shared";
import RatingBar from "./RatingBar";
import AISummary from "./AISummary";

interface ProductCardProps {
  result: ScanResult;
  onScanAnother: () => void;
}

export default function ProductCard({ result, onScanAnother }: ProductCardProps) {
  const { product, healthScore, aiSummary, cached } = result;

  return (
    <div className="w-full mx-auto bg-white/60 backdrop-blur-xl border border-earth-olive-dark/20 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
      
      {/* Left Column: Image, Title, Action */}
      <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left gap-6 border-b md:border-b-0 md:border-r border-earth-olive-dark/10 pb-8 md:pb-0 md:pr-8">
        
        {product.image_front_small_url && (
          <div className="w-full flex justify-center bg-white/50 rounded-2xl p-4 border border-earth-olive-dark/5 shadow-sm">
            <img
              src={product.image_front_small_url}
              alt={product.product_name}
              className="max-h-48 rounded-xl object-contain drop-shadow-md"
            />
          </div>
        )}

        <div className="w-full">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-earth-olive-dark mb-2 leading-tight">
            {product.product_name || "Unknown Product"}
          </h3>
          {product.brands && (
            <p className="text-sm text-earth-olive-dark/70 font-medium">{product.brands}</p>
          )}
        </div>

        <div className="mt-auto pt-2 w-full">
          <button 
            className="w-full py-3.5 px-6 font-bold text-earth-light bg-earth-olive rounded-xl hover:bg-earth-olive-light shadow-[0_0_20px_rgba(106,153,78,0.4)] hover:shadow-[0_0_25px_rgba(167,201,87,0.5)] hover:scale-[1.02] transition-all"
            onClick={onScanAnother}
          >
            Scan Another
          </button>
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <RatingBar score={healthScore} />
        
        <div className="flex flex-col gap-6">
          <AISummary summary={aiSummary} cached={cached} />

          <div className="bg-white/40 rounded-3xl p-6 border border-earth-olive-dark/10 shadow-sm">
            <h4 className="text-xs font-bold text-earth-olive-dark/50 uppercase tracking-widest mb-5">
              Nutrition per 100g
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <NutrientItem
                label="Calories"
                value={product.nutriments["energy-kcal_100g"]}
                unit="kcal"
              />
              <NutrientItem label="Fat" value={product.nutriments.fat_100g} unit="g" />
              <NutrientItem 
                label="Sugar" 
                value={product.nutriments.sugars_100g} 
                unit="g" 
                threshold={{ low: 5, high: 15 }}
              />
              <NutrientItem label="Protein" value={product.nutriments.proteins_100g} unit="g" />
              <NutrientItem label="Fiber" value={product.nutriments.fiber_100g} unit="g" />
              <NutrientItem 
                label="Sodium" 
                value={product.nutriments.sodium_100g} 
                unit="g" 
                threshold={{ low: 0.12, high: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function NutrientItem({
  label,
  value,
  unit,
  threshold,
}: {
  label: string;
  value?: number;
  unit: string;
  threshold?: { low: number; high: number };
}) {
  const isDefined = value !== undefined && value !== null;
  const formattedValue = isDefined ? Number(value).toFixed(1) : "—";
  
  let statusColor = "bg-earth-olive-dark/20"; // default neutral
  let indicatorWidth = "0%";
  
  if (isDefined && threshold) {
    const numValue = Number(value);
    const percentage = Math.min((numValue / (threshold.high * 1.5)) * 100, 100);
    indicatorWidth = `${percentage}%`;
    
    if (numValue <= threshold.low) {
      statusColor = "bg-earth-olive";
    } else if (numValue > threshold.high) {
      statusColor = "bg-earth-crimson";
    } else {
      statusColor = "bg-earth-olive-light";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-earth-olive-dark/70">{label}</span>
        <span className="font-bold text-earth-olive-dark">
          {formattedValue}{isDefined && unit}
        </span>
      </div>
      
      {threshold && isDefined && (
        <div className="h-1.5 w-full bg-earth-olive-dark/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${statusColor} transition-all duration-500`}
            style={{ width: indicatorWidth }}
          />
        </div>
      )}
    </div>
  );
}
