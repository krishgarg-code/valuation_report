import { numberToWordsIndian } from "./num-to-words";
import { ValuationFormValues } from "./form-schema";

export interface ValuationOutputRow {
  particularOfItem: string;
  plinthArea: number;
  remainingAge: number;
  depreciationPct: number;
  replacementRate: number;
  replacementCost: number;
  depreciationAmount: number;
  netValue: number;
}

export interface ValuationOutput {
  landValue: number;
  buildingNetStructuralValue: number;
  
  extraItemsTotal: number;
  amenitiesTotal: number;
  miscTotal: number;
  servicesTotal: number;
  
  buildingValue: number; // sum of Net structural + C + D + E + F
  totalPropertyValue: number; // land + building
  
  fairMarketValue: number;
  realizableValue: number;
  distressedValue: number;

  valuationRows: ValuationOutputRow[];

  landValueWords: string;
  buildingValueWords: string;
  totalPropertyValueWords: string;
  fairMarketValueWords: string;
  realizableValueWords: string;
  distressedValueWords: string;
}

export function formatIndianCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const str = rounded.toString();
  if (str.length <= 3) return "Rs. " + str;
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `Rs. ${formattedOther},${lastThree}`;
}

export function calculateValuation(values: Partial<ValuationFormValues>): ValuationOutput {
  const plotArea = values.plotArea || 0;
  const marketRate = values.marketRate || 0;
  
  // Part A Land Value
  const landValue = Math.round(plotArea * marketRate);

  // Part B Building Structural rows
  const inputRows = values.valuationDetailsRows || [];
  let buildingNetStructuralValue = 0;
  
  const valuationRows: ValuationOutputRow[] = inputRows.map((row) => {
    const plinthArea = row.plinthArea || 0;
    const replacementRate = row.replacementRate || 0;
    const depreciationPct = row.depreciationPct || 0;
    
    const replacementCost = Math.round(plinthArea * replacementRate);
    const depreciationAmount = Math.round(replacementCost * (depreciationPct / 100));
    const netValue = Math.round(replacementCost - depreciationAmount);
    
    buildingNetStructuralValue += netValue;

    return {
      particularOfItem: row.particularOfItem || "",
      plinthArea,
      remainingAge: row.remainingAge || 0,
      depreciationPct,
      replacementRate,
      replacementCost,
      depreciationAmount,
      netValue,
    };
  });

  // Part C Extra Items
  const extraItemsTotal = Math.round(
    (values.extraPortico || 0) +
    (values.extraOrnamentalDoor || 0) +
    (values.extraSitOut || 0) +
    (values.extraOverheadTank || 0) +
    (values.extraSteelGates || 0)
  );

  // Part D Amenities
  const amenitiesTotal = Math.round(
    (values.amenityWardrobes || 0) +
    (values.amenityGlazedTiles || 0) +
    (values.amenityExtraSinks || 0) +
    (values.amenityMarbleFlooring || 0) +
    (values.amenityInteriorDecor || 0) +
    (values.amenityArchElevation || 0) +
    (values.amenityPaneling || 0) +
    (values.amenityAluminumWorks || 0) +
    (values.amenityAluminumRails || 0) +
    (values.amenityFalseCeiling || 0)
  );

  // Part E Miscellaneous
  const miscTotal = Math.round(
    (values.miscToiletRoom || 0) +
    (values.miscLumberRoom || 0) +
    (values.miscWaterTank || 0) +
    (values.miscTreesGardening || 0)
  );

  // Part F Services
  const servicesTotal = Math.round(
    (values.serviceWaterSupply || 0) +
    (values.serviceDrainage || 0) +
    (values.serviceCompoundWall || 0) +
    (values.serviceCbDeposits || 0) +
    (values.servicePavement || 0)
  );

  // Building Value sum (Part-B Structural + C + D + E + F)
  const buildingValue = Math.round(buildingNetStructuralValue + extraItemsTotal + amenitiesTotal + miscTotal + servicesTotal);

  // Total Security Value
  const totalPropertyValue = Math.round(landValue + buildingValue);

  // Round FMV to nearest thousand
  const fairMarketValue = Math.round(totalPropertyValue / 1000) * 1000;

  // Realizable Value is 85% of FMV
  const realizableValue = Math.round((fairMarketValue * 0.85) / 1000) * 1000;

  // Distressed Value is 72% of FMV
  const distressedValue = Math.round((fairMarketValue * 0.72) / 1000) * 1000;

  return {
    landValue,
    buildingNetStructuralValue,
    extraItemsTotal,
    amenitiesTotal,
    miscTotal,
    servicesTotal,
    buildingValue,
    totalPropertyValue,
    fairMarketValue,
    realizableValue,
    distressedValue,
    valuationRows,
    landValueWords: numberToWordsIndian(landValue),
    buildingValueWords: numberToWordsIndian(buildingValue),
    totalPropertyValueWords: numberToWordsIndian(totalPropertyValue),
    fairMarketValueWords: numberToWordsIndian(fairMarketValue),
    realizableValueWords: numberToWordsIndian(realizableValue),
    distressedValueWords: numberToWordsIndian(distressedValue),
  };
}
