import type { ScanResult } from "@eathigh/shared";
import RatingBar from "./RatingBar";
import AISummary from "./AISummary";
import "../styles/product.css";

interface ProductCardProps {
  result: ScanResult;
  onScanAnother: () => void;
}

export default function ProductCard({ result, onScanAnother }: ProductCardProps) {
  const { product, healthScore, aiSummary, cached } = result;

  return (
    <div className="product-card">
      {product.image_front_small_url && (
        <div className="product-card__image-wrapper">
          <img
            src={product.image_front_small_url}
            alt={product.product_name}
            className="product-card__image"
          />
        </div>
      )}

      <div className="product-card__content">
        <h3 className="product-card__name">
          {product.product_name || "Unknown Product"}
        </h3>
        {product.brands && (
          <p className="product-card__brand">{product.brands}</p>
        )}

        <RatingBar score={healthScore} />
        <AISummary summary={aiSummary} cached={cached} />

        <div className="product-card__nutrition">
          <h4 className="product-card__section-title">Nutrition per 100g</h4>
          <div className="nutrition-grid">
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

        <button className="btn btn--primary" onClick={onScanAnother}>
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
    <div className="nutrient-item">
      <span className="nutrient-item__label">{label}</span>
      <span className="nutrient-item__value">
        {value !== undefined ? `${value} ${unit}` : "—"}
      </span>
    </div>
  );
}
