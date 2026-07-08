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
    <div className="w-full max-w-lg mx-auto bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      {product.image_front_small_url && (
        <div className="flex justify-center mb-6">
          <img
            src={product.image_front_small_url}
            alt={product.product_name}
            className="max-h-40 rounded-xl object-contain drop-shadow-lg"
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1">
            {product.product_name || "Unknown Product"}
          </h3>
          {product.brands && (
            <p className="text-sm text-neutral-400 font-medium">{product.brands}</p>
          )}
        </div>

        <RatingBar score={healthScore} />
        <AISummary summary={aiSummary} cached={cached} />

        <div>
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
            Nutrition per 100g
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <NutrientItem
              label="Calories"
              value={product.nutriments["energy-kcal_100g"]}
              unit="kcal"
            />
            <NutrientItem label="Fat" value={product.nutriments.fat_100g} unit="g" />
            <NutrientItem label="Sugar" value={product.nutriments.sugars_100g} unit="g" />
            <NutrientItem label="Protein" value={product.nutriments.proteins_100g} unit="g" />
            <NutrientItem label="Fiber" value={product.nutriments.fiber_100g} unit="g" />
            <NutrientItem label="Sodium" value={product.nutriments.sodium_100g} unit="g" />
          </div>
        </div>

        <button 
          className="w-full mt-2 py-3.5 px-6 font-semibold text-neutral-950 bg-primary-DEFAULT rounded-xl hover:bg-primary-hover shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:scale-[1.02] transition-all"
          onClick={onScanAnother}
        >
          Scan Another
        </button>
      </div>
    </div>
  );
}

function NutrientItem({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit: string;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-neutral-950/50 border border-neutral-800/80 rounded-xl">
      <span className="text-xs font-medium text-neutral-400">{label}</span>
      <span className="text-sm font-bold text-white">
        {value !== undefined ? `${value}${unit}` : "—"}
      </span>
    </div>
  );
}
