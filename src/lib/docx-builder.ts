import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { ValuationFormValues } from "./form-schema";
import { calculateValuation, formatIndianCurrency } from "./valuation-math";

// Helper to escape special XML characters
function escapeXml(unsafe: any): string {
  if (unsafe === undefined || unsafe === null) return "";
  const str = String(unsafe);
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Helper to format paragraphs in OpenXML
function makeParagraph(text: string, options?: {
  bold?: boolean;
  italic?: boolean;
  size?: number; // half points (e.g. 18 is 9pt, 22 is 11pt)
  align?: "left" | "center" | "right" | "both";
  color?: string;
  spaceBefore?: number;
  spaceAfter?: number;
}) {
  const size = options?.size || 18;
  const bold = options?.bold ? "<w:b/>" : "";
  const italic = options?.italic ? "<w:i/>" : "";
  const color = options?.color ? `<w:color w:val="${options.color}"/>` : "";
  const align = options?.align ? `<w:jc w:val="${options.align}"/>` : "";
  const before = options?.spaceBefore !== undefined ? ` w:before="${options.spaceBefore}"` : "";
  const after = options?.spaceAfter !== undefined ? ` w:after="${options.spaceAfter}"` : "";
  const spacing = (before || after) ? `<w:spacing${before}${after}/>` : "";

  const escaped = escapeXml(text);
  const runs = escaped.split("\n").map((line, idx) => {
    const br = idx > 0 ? "<w:br/>" : "";
    return `${br}<w:r><w:rPr>${bold}${italic}${color}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${line}</w:t></w:r>`;
  }).join("");

  return `<w:p>
    <w:pPr>
      ${align}
      ${spacing}
    </w:pPr>
    ${runs}
  </w:p>`;
}

// Helper to format table cells in OpenXML
function makeCell(content: string | string[], options?: {
  width?: number; // in dxa
  shading?: string; // hex color e.g. "F1F1F1"
  bold?: boolean;
  italic?: boolean;
  size?: number;
  align?: "left" | "center" | "right" | "both";
  color?: string;
  gridSpan?: number;
  vAlign?: "top" | "center" | "bottom";
}) {
  const wVal = options?.width ? `<w:tcW w:w="${options.width}" w:type="dxa"/>` : "";
  const shd = options?.shading ? `<w:shd w:val="clear" w:color="auto" w:fill="${options.shading}"/>` : "";
  const span = options?.gridSpan ? `<w:gridSpan w:val="${options.gridSpan}"/>` : "";
  const vAlign = options?.vAlign ? `<w:vAlign w:val="${options.vAlign}"/>` : "";

  const tcPr = `<w:tcPr>${wVal}${shd}${span}${vAlign}</w:tcPr>`;
  
  let paragraphsStr = "";
  if (Array.isArray(content)) {
    paragraphsStr = content.join("");
  } else if (content.startsWith("<w:p>")) {
    paragraphsStr = content;
  } else {
    paragraphsStr = makeParagraph(content, {
      bold: options?.bold,
      italic: options?.italic,
      size: options?.size,
      align: options?.align,
      color: options?.color
    });
  }

  return `<w:tc>${tcPr}${paragraphsStr}</w:tc>`;
}

// Helper to format table rows in OpenXML
function makeRow(cells: string[], options?: { cantSplit?: boolean; isHeader?: boolean }) {
  const cantSplit = options?.cantSplit !== false ? "<w:cantSplit/>" : "";
  const tblHeader = options?.isHeader ? "<w:tblHeader/>" : "";
  
  return `<w:tr>
    <w:trPr>
      ${cantSplit}
      ${tblHeader}
    </w:trPr>
    ${cells.join("")}
  </w:tr>`;
}

// Helper to format tables in OpenXML
function makeTable(rows: string[], options?: {
  width?: number; // total width in dxa
  borders?: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
    insideH?: string;
    insideV?: string;
  };
}) {
  const wVal = options?.width || 9020;
  const b = options?.borders || {};
  
  const topBorder = b.top !== "none" ? `<w:top w:val="${b.top || "single"}" w:sz="6" w:space="0" w:color="000000"/>` : "";
  const leftBorder = b.left !== "none" ? `<w:left w:val="${b.left || "single"}" w:sz="6" w:space="0" w:color="000000"/>` : "";
  const bottomBorder = b.bottom !== "none" ? `<w:bottom w:val="${b.bottom || "single"}" w:sz="6" w:space="0" w:color="000000"/>` : "";
  const rightBorder = b.right !== "none" ? `<w:right w:val="${b.right || "single"}" w:sz="6" w:space="0" w:color="000000"/>` : "";
  const insideHBorder = b.insideH !== "none" ? `<w:insideH w:val="${b.insideH || "single"}" w:sz="4" w:space="0" w:color="000000"/>` : "";
  const insideVBorder = b.insideV !== "none" ? `<w:insideV w:val="${b.insideV || "single"}" w:sz="4" w:space="0" w:color="000000"/>` : "";

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="${wVal}" w:type="dxa"/>
      <w:tblBorders>
        ${topBorder}
        ${leftBorder}
        ${bottomBorder}
        ${rightBorder}
        ${insideHBorder}
        ${insideVBorder}
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="80" w:type="dxa"/>
        <w:left w:w="120" w:type="dxa"/>
        <w:bottom w:w="80" w:type="dxa"/>
        <w:right w:w="120" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    ${rows.join("")}
  </w:tbl>`;
}

// Helper to make a page break
function makePageBreak() {
  return `<w:p>
    <w:r>
      <w:br w:type="page"/>
    </w:r>
  </w:p>`;
}

export function generateAndDownloadDocx(values: ValuationFormValues) {
  const valuation = calculateValuation(values);
  const ownersList = values.owners || [];
  const primaryOwner = ownersList[0] || { ownerName: "Property", fatherHusbandName: "", mobileNumber: "", address: "" };

  // Generate XML content block by block matching the 11-page structure
  let xmlBody = "";

  // ----------------------------------------------------
  // PAGE 1: GENERAL (Items 1 to 13)
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 1 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("To", { bold: true });
  xmlBody += makeParagraph("The Manager,", { bold: true, spaceBefore: 0 });
  xmlBody += makeParagraph("Punjab & Sind Bank", { bold: true, spaceBefore: 0 });
  xmlBody += makeParagraph(`BRANCH: ${values.branchName.toUpperCase()}`, { bold: true, spaceBefore: 0, spaceAfter: 200 });
  
  xmlBody += makeParagraph("GENERAL", { bold: true, align: "center", size: 24, spaceAfter: 150 });

  const page1Rows: string[] = [];

  // 1. Purpose
  page1Rows.push(makeRow([
    makeCell("1.", { width: 600, bold: true, align: "center" }),
    makeCell("Purpose for which the valuation is made :", { width: 4000 }),
    makeCell(values.purposeOfValuation || "", { width: 4420, bold: true })
  ]));

  // 2. Dates
  page1Rows.push(makeRow([
    makeCell("2.", { width: 600, bold: true, align: "center" }),
    makeCell("a) Date of inspection :\nb) Date on which the valuation is Made :", { width: 4000 }),
    makeCell(`a) ${values.inspectionDate}\nb) ${values.valuationDate}`, { width: 4420, bold: true })
  ]));

  // 3. Perusal docs
  page1Rows.push(makeRow([
    makeCell("3.", { width: 600, bold: true, align: "center" }),
    makeCell("List of documents produced for perusal", { width: 4000 }),
    makeCell(values.perusalDocuments || "", { width: 4420, size: 16 })
  ]));

  // 4. Owners
  const ownersTextXml = ownersList.map((owner, idx) => {
    return `<w:p><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>${escapeXml(owner.ownerName.toUpperCase())}</w:t></w:r><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t> (S/o, W/o ${escapeXml(owner.fatherHusbandName)})</w:t></w:r></w:p>` +
           `<w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>Share: ${escapeXml(owner.ownershipShare)} | Ph: ${escapeXml(owner.mobileNumber)}</w:t></w:r></w:p>` +
           `<w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>Address: ${escapeXml(owner.address)}</w:t></w:r></w:p>${idx < ownersList.length - 1 ? "<w:p/>" : ""}`;
  }).join("");
  page1Rows.push(makeRow([
    makeCell("4.", { width: 600, bold: true, align: "center" }),
    makeCell("Name of the owner(s) and his / their address(es) with Phone no. (details of share of each owner in case of joint ownership)", { width: 4000 }),
    makeCell(ownersTextXml, { width: 4420 })
  ]));

  // 5. Brief Description
  page1Rows.push(makeRow([
    makeCell("5.", { width: 600, bold: true, align: "center" }),
    makeCell("Brief description of the property (Including leasehold / freehold etc)", { width: 4000 }),
    makeCell(values.propertyDescription || "", { width: 4420, size: 16 })
  ]));

  // 6. Location
  page1Rows.push(makeRow([
    makeCell("6.", { width: 600, bold: true, align: "center" }),
    makeCell("Location of property\na) Plot No. / Survey No. :\nb) Door No. :\nc) T. S. No. / Village :\nd) Ward / Taluka :\ne) Mandal / District :", { width: 4000 }),
    makeCell(`\na) ${values.plotNumber} / ${values.surveyNumber}\nb) ${values.doorNumber}\nc) ${values.village}\nd) ${values.taluka}\ne) ${values.district}`, { width: 4420, bold: true })
  ]));

  // 7. Postal address
  page1Rows.push(makeRow([
    makeCell("7.", { width: 600, bold: true, align: "center" }),
    makeCell("Postal address of the property :", { width: 4000 }),
    makeCell(values.postalAddress || "", { width: 4420, bold: true, size: 16 })
  ]));

  // 8. Type of Area
  page1Rows.push(makeRow([
    makeCell("8.", { width: 600, bold: true, align: "center" }),
    makeCell("City / Town :\nResidential Area :\nCommercial Area :\nIndustrial Area :", { width: 4000 }),
    makeCell(`${values.village}\n${values.propertyType === "Residential" ? "YES" : "NO"}\n${values.propertyType === "Commercial" ? "YES" : "NO"}\n${values.propertyType === "Industrial" ? "YES" : "NO"}`, { width: 4420, bold: true })
  ]));

  // 9. Area classification
  page1Rows.push(makeRow([
    makeCell("9.", { width: 600, bold: true, align: "center" }),
    makeCell("Classification of the area\n1) High / Middle / Poor :\n2) Metro / Urban / Semi Urban / Rural :", { width: 4000 }),
    makeCell(`\n1) ${values.areaClassification}\n2) ${values.areaType}`, { width: 4420, bold: true })
  ]));

  // 10. Municipality type
  page1Rows.push(makeRow([
    makeCell("10.", { width: 600, bold: true, align: "center" }),
    makeCell("Coming under Corporation limit / Village Panchayat / Municipality :", { width: 4000 }),
    makeCell(values.municipalityType || "", { width: 4420, bold: true })
  ]));

  // 11. Govt Enactments
  page1Rows.push(makeRow([
    makeCell("11.", { width: 600, bold: true, align: "center" }),
    makeCell("Whether covered under any State / Central Govt. enactments (e.g. Urban Land Ceiling Act) or notified under agency area / scheduled area / cantonment area :", { width: 4000 }),
    makeCell(values.govtEnactments || "", { width: 4420, size: 16 })
  ]));

  // 12. Agri Conversion
  page1Rows.push(makeRow([
    makeCell("12.", { width: 600, bold: true, align: "center" }),
    makeCell("In case it is an agricultural land, any conversion to house site plots is contemplated :", { width: 4000 }),
    makeCell(values.agriculturalConversion || "", { width: 4420, size: 16 })
  ]));

  // 13. Boundaries (North only on page 1)
  const boundariesHeaderRow = makeRow([
    makeCell("Side", { width: 2000, bold: true, shading: "F1F1F1" }),
    makeCell("As per Sale Deed 1", { width: 2340, bold: true, shading: "F1F1F1" }),
    makeCell("As per Sale Deed 2", { width: 2340, bold: true, shading: "F1F1F1" }),
    makeCell("As per the Site", { width: 2340, bold: true, shading: "F1F1F1" })
  ], { isHeader: true });

  const boundariesNorthRow = makeRow([
    makeCell("North :", { width: 2000, bold: true }),
    makeCell(values.boundaryNorthDeed || "", { width: 2340 }),
    makeCell(values.boundaryNorthDeed2 || "", { width: 2340 }),
    makeCell(values.boundaryNorthSite || "", { width: 2340 })
  ]);

  const innerBoundariesTablePage1 = makeTable([boundariesHeaderRow, boundariesNorthRow]);

  page1Rows.push(makeRow([
    makeCell("13.", { width: 600, bold: true, align: "center" }),
    makeCell("Boundaries of the property", { width: 4000 }),
    makeCell(innerBoundariesTablePage1, { width: 4420 })
  ]));

  xmlBody += makeTable(page1Rows);
  
  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 1", { align: "center", size: 14, color: "888888", spaceBefore: 300 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 2: GENERAL continuation (Boundaries, Dimensions 14-17) & II. CHARACTERISTICS OF THE SITE
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 2 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("GENERAL (Continuation)", { bold: true, align: "center", size: 18, spaceAfter: 150 });

  // Boundaries Table continuation (South, East, West)
  const boundariesContinuationRows = [
    boundariesHeaderRow,
    makeRow([
      makeCell("South :", { width: 2000, bold: true }),
      makeCell(values.boundarySouthDeed || "", { width: 2340 }),
      makeCell(values.boundarySouthDeed2 || "", { width: 2340 }),
      makeCell(values.boundarySouthSite || "", { width: 2340 })
    ]),
    makeRow([
      makeCell("East :", { width: 2000, bold: true }),
      makeCell(values.boundaryEastDeed || "", { width: 2340 }),
      makeCell(values.boundaryEastDeed2 || "", { width: 2340 }),
      makeCell(values.boundaryEastSite || "", { width: 2340 })
    ]),
    makeRow([
      makeCell("West :", { width: 2000, bold: true }),
      makeCell(values.boundaryWestDeed || "", { width: 2340 }),
      makeCell(values.boundaryWestDeed2 || "", { width: 2340 }),
      makeCell(values.boundaryWestSite || "", { width: 2340 })
    ])
  ];
  xmlBody += makeTable(boundariesContinuationRows);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  const page2Rows: string[] = [];

  // 14.1 Dimensions subtable
  const dimensionsHeaderRow = makeRow([
    makeCell("Direction", { width: 2000, bold: true, shading: "F1F1F1" }),
    makeCell("A: Deed 1", { width: 2340, bold: true, shading: "F1F1F1" }),
    makeCell("B: Deed 2", { width: 2340, bold: true, shading: "F1F1F1" }),
    makeCell("C: Actuals", { width: 2340, bold: true, shading: "F1F1F1" })
  ], { isHeader: true });

  const innerDimensionsTable = makeTable([
    dimensionsHeaderRow,
    makeRow([
      makeCell("North :", { width: 2000, bold: true }),
      makeCell(values.dimensionNorthDeed || "", { width: 2340 }),
      makeCell(values.dimensionNorthDeed2 || "", { width: 2340 }),
      makeCell(values.dimensionNorthSite || "", { width: 2340 })
    ]),
    makeRow([
      makeCell("South :", { width: 2000, bold: true }),
      makeCell(values.dimensionSouthDeed || "", { width: 2340 }),
      makeCell(values.dimensionSouthDeed2 || "", { width: 2340 }),
      makeCell(values.dimensionSouthSite || "", { width: 2340 })
    ]),
    makeRow([
      makeCell("East :", { width: 2000, bold: true }),
      makeCell(values.dimensionEastDeed || "", { width: 2340 }),
      makeCell(values.dimensionEastDeed2 || "", { width: 2340 }),
      makeCell(values.dimensionEastSite || "", { width: 2340 })
    ]),
    makeRow([
      makeCell("West :", { width: 2000, bold: true }),
      makeCell(values.dimensionWestDeed || "", { width: 2340 }),
      makeCell(values.dimensionWestDeed2 || "", { width: 2340 }),
      makeCell(values.dimensionWestSite || "", { width: 2340 })
    ])
  ]);

  page2Rows.push(makeRow([
    makeCell("14.1", { width: 600, bold: true, align: "center" }),
    makeCell("Dimensions of the site", { width: 4000 }),
    makeCell(innerDimensionsTable, { width: 4420 })
  ]));

  // 14.2 Coordinates
  page2Rows.push(makeRow([
    makeCell("14.2", { width: 600, bold: true, align: "center" }),
    makeCell("Latitude, Longitude and Coordinates of the site :", { width: 4000 }),
    makeCell(`Lat: ${values.latitude} / Lng: ${values.longitude}`, { width: 4420, bold: true, color: "4F46E5" })
  ]));

  // 15. Extent of site
  page2Rows.push(makeRow([
    makeCell("15.", { width: 600, bold: true, align: "center" }),
    makeCell("Extent of the site :", { width: 4000 }),
    makeCell(values.extentSite || "", { width: 4420, bold: true })
  ]));

  // 16. Extent for valuation
  page2Rows.push(makeRow([
    makeCell("16.", { width: 600, bold: true, align: "center" }),
    makeCell("Extent of the site considered for valuation (least of 14 A & 14 B) :", { width: 4000 }),
    makeCell(values.extentValuation || "", { width: 4420, bold: true })
  ]));

  // 17. Occupancy details
  page2Rows.push(makeRow([
    makeCell("17.", { width: 600, bold: true, align: "center" }),
    makeCell("Whether occupied by the owner / tenant? If occupied by tenant, since how long? Rent received per month. :", { width: 4000 }),
    makeCell(values.occupancyDetails || "", { width: 4420, size: 16 })
  ]));

  xmlBody += makeTable(page2Rows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  // Characteristics Header
  xmlBody += makeParagraph("II. CHARACTERISTICS OF THE SITE", { bold: true, align: "center", size: 20, spaceAfter: 150 });

  const charRows = [
    makeRow([
      makeCell("S.No", { width: 600, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Characteristics Parameter", { width: 4200, bold: true, shading: "F1F1F1" }),
      makeCell("Observation / Specification Status", { width: 4220, bold: true, shading: "F1F1F1" })
    ], { isHeader: true })
  ];

  const charList = [
    { sNo: 1, label: "Classification of locality", val: values.charLocality },
    { sNo: 2, label: "Development of surrounding areas", val: values.charDevelopment },
    { sNo: 3, label: "Possibility of frequent flooding / sub-merging", val: values.charFlooding },
    { sNo: 4, label: "Feasibility to the Civic amenities like school, hospital, bus stop, market etc.", val: values.charCivicAmenities },
    { sNo: 5, label: "Level of land with topographical conditions", val: values.charLandLevel },
    { sNo: 6, label: "Shape of land", val: values.charLandShape },
    { sNo: 7, label: "Type of use to which it can be put", val: values.charTypeUse },
    { sNo: 8, label: "Any usage restriction", val: values.charUsageRestriction },
    { sNo: 9, label: "Is plot in town planning approved layout?", val: values.charTownPlanning },
    { sNo: 10, label: "Corner plot or intermittent plot?", val: values.charCornerPlot },
    { sNo: 11, label: "Road facilities", val: values.charRoadFacilities },
    { sNo: 12, label: "Type of road available at present", val: values.charRoadType },
    { sNo: 13, label: "Width of road - is it below 20 ft. or more than 20 ft.", val: values.charRoadWidth },
    { sNo: 14, label: "Is it a land – locked land?", val: values.charLandLocked },
    { sNo: 15, label: "Water potentiality", val: values.charWaterPotential },
    { sNo: 16, label: "Underground sewerage system", val: values.charSewerage },
    { sNo: 17, label: "Is power supply available at the site?", val: values.charPowerSupply },
    { sNo: 18, label: "Advantages of the site", val: values.charAdvantages },
    { sNo: 19, label: "Disadvantages of the site", val: values.charDisadvantages },
    { sNo: 20, label: "Special remarks, if any (threat of acquisition, road widening, CRZ provisions etc.)", val: values.charSpecialRemarks }
  ];

  charList.forEach((row) => {
    charRows.push(makeRow([
      makeCell(`${row.sNo}.`, { width: 600, bold: true, align: "center" }),
      makeCell(row.label, { width: 4200 }),
      makeCell((row.val || "").toUpperCase(), { width: 4220, size: 16 })
    ]));
  });

  xmlBody += makeTable(charRows);

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 2", { align: "center", size: 14, color: "888888", spaceBefore: 300 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 3: Part-A Land & Part-B Building Specs & Compound Wall / Elec.
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 3 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("Part – A (Valuation of land)", { bold: true, align: "center", size: 20, spaceAfter: 150 });

  const partARows = [
    makeRow([
      makeCell("1.", { width: 600, bold: true, align: "center" }),
      makeCell("Size of plot :\nNorth & South :\nEast & West :", { width: 4200 }),
      makeCell(`\nNorth: ${values.dimensionNorthDeed} / South: ${values.dimensionSouthDeed}\nEast: ${values.dimensionEastDeed} / West: ${values.dimensionWestDeed}`, { width: 4220 })
    ]),
    makeRow([
      makeCell("2.", { width: 600, bold: true, align: "center" }),
      makeCell("Total extent of the plot :", { width: 4200 }),
      makeCell(`${values.plotArea} Sq Yards`, { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("3.", { width: 600, bold: true, align: "center" }),
      makeCell("Prevailing market rate (Along with details /reference of at least two latest deals/transactions with respect to adjacent properties in the areas) :", { width: 4200 }),
      makeCell(`${formatIndianCurrency(values.marketRate)} / Sq Yard`, { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("4.", { width: 600, bold: true, align: "center" }),
      makeCell("Guideline rate obtained from the Registrar’s Office (an evidence thereof to be enclosed) :", { width: 4200 }),
      makeCell(`${formatIndianCurrency(values.guidelineRate)} / Sq Yard`, { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("5.", { width: 600, bold: true, align: "center" }),
      makeCell("Assessed / adopted rate of valuation :", { width: 4200 }),
      makeCell(`${formatIndianCurrency(values.marketRate)} / Sq Yard`, { width: 4220, bold: true, color: "4F46E5" })
    ]),
    makeRow([
      makeCell("6.", { width: 600, bold: true, align: "center", color: "4F46E5" }),
      makeCell("Estimated value of land :", { width: 4200, bold: true, color: "4F46E5" }),
      makeCell(formatIndianCurrency(valuation.landValue), { width: 4220, bold: true, color: "4F46E5", size: 20 })
    ])
  ];

  xmlBody += makeTable(partARows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  xmlBody += makeParagraph("Part – B (Valuation of Building)", { bold: true, align: "center", size: 20, spaceAfter: 150 });

  const partBRows = [
    makeRow([
      makeCell("1.", { width: 600, bold: true, align: "center" }),
      makeCell("Technical details of the building :", { width: 8420, bold: true, gridSpan: 3 })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("a) Type of Building (Residential / Commercial / Industrial) :", { width: 4200 }),
      makeCell((values.propertyType || "").toUpperCase(), { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("b) Type of construction (Load bearing / RCC / Steel Framed) :", { width: 4200 }),
      makeCell((values.constructionType || "").toUpperCase(), { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("c) Year of construction :", { width: 4200 }),
      makeCell(values.yearOfConstruction || "", { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("d) Number of floors and height of each floor including basement, if any :", { width: 4200 }),
      makeCell(`${values.numberOfFloors} Floors (Height: ~10 Ft per floor)`, { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("e) Plinth area floor-wise :", { width: 4200 }),
      makeCell(values.plinthArea || "", { width: 4220, bold: true, size: 16 })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("f) Condition of the building (Exterior / Interior) :", { width: 4200 }),
      makeCell(`Exterior: ${values.conditionExterior} / Interior: ${values.conditionInterior}`, { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("g) Date of issue and validity of layout of approved map / plan :", { width: 4200 }),
      makeCell(values.layoutApprovalDateValidity || "", { width: 4220, size: 16 })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("h) Approved map / plan issuing authority :", { width: 4200 }),
      makeCell((values.layoutApprovalAuthority || "").toUpperCase(), { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("i) Whether genuineness or authenticity of approved map / plan is verified :", { width: 4200 }),
      makeCell(values.layoutApprovalGenuineness || "", { width: 4220, bold: true })
    ]),
    makeRow([
      makeCell("", { width: 600 }),
      makeCell("j) Any other comments on authentic of approved plan :", { width: 4200 }),
      makeCell(values.layoutApprovalComments || "", { width: 4220, size: 16 })
    ])
  ];

  xmlBody += makeTable(partBRows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  xmlBody += makeParagraph("Specifications of construction (Floor-wise) in respect of :", { bold: true, size: 18, spaceAfter: 100 });

  const specsRows = [
    makeRow([
      makeCell("S.No", { width: 600, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Description", { width: 3000, bold: true, shading: "F1F1F1" }),
      makeCell("Ground floor", { width: 2710, bold: true, shading: "F1F1F1" }),
      makeCell("Other floors", { width: 2710, bold: true, shading: "F1F1F1" })
    ], { isHeader: true })
  ];

  const specList = [
    { sNo: 1, desc: "Foundation", g: values.specFoundationGround, o: values.specFoundationOther },
    { sNo: 2, desc: "Basement", g: values.specBasementGround, o: values.specBasementOther },
    { sNo: 3, desc: "Superstructure", g: values.specSuperstructureGround, o: values.specSuperstructureOther },
    { sNo: 4, desc: "Joinery / Doors & Windows (timbers, shutters, frames etc.)", g: values.specJoineryGround, o: values.specJoineryOther },
    { sNo: 5, desc: "RCC works", g: values.specRccGround, o: values.specRccOther },
    { sNo: 6, desc: "Plastering", g: values.specPlasteringGround, o: values.specPlasteringOther },
    { sNo: 7, desc: "Flooring, Skirting, dadoing", g: values.specFlooringGround, o: values.specFlooringOther },
    { sNo: 8, desc: "Special finish as marble, granite, wooden paneling, grills, etc", g: values.specSpecialFinishGround, o: values.specSpecialFinishOther },
    { sNo: 9, desc: "Roofing including weather proof course", g: values.specRoofingGround, o: values.specRoofingOther }
  ];

  specList.forEach((row) => {
    specsRows.push(makeRow([
      makeCell(`${row.sNo}.`, { width: 600, bold: true, align: "center" }),
      makeCell(row.desc, { width: 3000, bold: true }),
      makeCell(row.g || "", { width: 2710, size: 16 }),
      makeCell(row.o || "", { width: 2710, size: 16 })
    ]));
  });

  xmlBody += makeTable(specsRows);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  // Compound Wall & Electrical Installation
  const extraSpecsRows = [
    makeRow([
      makeCell("S.No", { width: 600, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Description", { width: 3000, bold: true, shading: "F1F1F1" }),
      makeCell("Ground Floor & Other Floor Specification", { width: 5420, bold: true, shading: "F1F1F1" })
    ], { isHeader: true }),
    makeRow([
      makeCell("1.", { width: 600, bold: true, align: "center" }),
      makeCell("Compound Wall :", { width: 3000, bold: true }),
      makeCell(`Height: ${values.compoundHeight}\nLength: ${values.compoundLength}\nType of Construction: ${values.compoundType}`, { width: 5420, bold: true })
    ]),
    makeRow([
      makeCell("2.", { width: 600, bold: true, align: "center" }),
      makeCell("Electrical Installation", { width: 3000, bold: true }),
      makeCell(`Wiring: ${values.electricalWiring}\nFitting: ${values.electricalFitting}\nOther specs: ${values.electricalOther}`, { width: 5420 })
    ])
  ];

  xmlBody += makeTable(extraSpecsRows);

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 3", { align: "center", size: 14, color: "888888", spaceBefore: 300 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 4: Electrical Params, Plumbing, Details of Valuation Table, Part C, Part D
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 4 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("Part – B (Valuation of Building - Continued)", { bold: true, align: "center", size: 18, spaceAfter: 150 });

  // Electrical details sub-table
  const electricalPlumbingRows = [
    makeRow([
      makeCell("Electrical Parameters", { width: 4510, bold: true, shading: "F1F1F1" }),
      makeCell("Specification observations", { width: 4510, bold: true, shading: "F1F1F1" })
    ], { isHeader: true }),
    makeRow([
      makeCell("Number of Light Points :", { width: 4510, bold: true }),
      makeCell(values.electricalLightPoints || "", { width: 4510, bold: true })
    ]),
    makeRow([
      makeCell("Fan Point :", { width: 4510, bold: true }),
      makeCell(values.electricalFanPoints || "", { width: 4510, bold: true })
    ]),
    makeRow([
      makeCell("Spare plug points :", { width: 4510, bold: true }),
      makeCell(values.electricalPlugs || "", { width: 4510, bold: true })
    ]),
    makeRow([
      makeCell("Any other item :", { width: 4510, bold: true }),
      makeCell(values.electricalOther || "", { width: 4510, size: 16 })
    ]),
    makeRow([
      makeCell("3. Plumbing Installation", { width: 4510, bold: true, shading: "F1F1F1" }),
      makeCell("Specification observations", { width: 4510, bold: true, shading: "F1F1F1" })
    ], { isHeader: true }),
    makeRow([
      makeCell("a) No. of Water Closets and their type :", { width: 4510, bold: true }),
      makeCell(values.plumbingWaterClosets || "", { width: 4510, size: 16 })
    ]),
    makeRow([
      makeCell("b) No. of Wash basins :", { width: 4510, bold: true }),
      makeCell(values.plumbingWashBasins || "", { width: 4510, size: 16 })
    ]),
    makeRow([
      makeCell("c) No of Urinals :", { width: 4510, bold: true }),
      makeCell(values.plumbingUrinals || "", { width: 4510, size: 16 })
    ]),
    makeRow([
      makeCell("d) No. of Bath tubs :", { width: 4510, bold: true }),
      makeCell(values.plumbingBathTubs || "", { width: 4510, size: 16 })
    ]),
    makeRow([
      makeCell("e) Water meter, taps, etc. :", { width: 4510, bold: true }),
      makeCell(values.plumbingWaterMeter || "", { width: 4510, size: 16 })
    ]),
    makeRow([
      makeCell("f) Any other fixtures :", { width: 4510, bold: true }),
      makeCell(values.plumbingOther || "", { width: 4510, size: 16 })
    ])
  ];

  xmlBody += makeTable(electricalPlumbingRows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  xmlBody += makeParagraph("DETAILS OF VALUATION", { bold: true, align: "center", size: 20, spaceAfter: 150 });

  // Details of Valuation Table
  const valuationTableRows = [
    makeRow([
      makeCell("Particular of item", { width: 1800, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Plinth Area (sft)", { width: 900, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Rem. age of bldg", { width: 900, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("dep. %", { width: 900, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Est. rate (₹)", { width: 900, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Replacement cost (₹)", { width: 1200, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Depreciation (₹)", { width: 1200, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Net value (₹)", { width: 1220, bold: true, align: "center", shading: "F1F1F1" })
    ], { isHeader: true })
  ];

  valuation.valuationRows.forEach((row) => {
    valuationTableRows.push(makeRow([
      makeCell(row.particularOfItem, { width: 1800, bold: true }),
      makeCell(String(row.plinthArea), { width: 900, align: "center" }),
      makeCell(String(row.remainingAge), { width: 900, align: "center" }),
      makeCell(`${row.depreciationPct}%`, { width: 900, align: "center" }),
      makeCell(String(row.replacementRate), { width: 900, align: "center" }),
      makeCell(row.replacementCost.toLocaleString("en-IN"), { width: 1200, align: "right", bold: true }),
      makeCell(row.depreciationAmount.toLocaleString("en-IN"), { width: 1200, align: "right", color: "EF4444" }),
      makeCell(row.netValue.toLocaleString("en-IN"), { width: 1220, align: "right", bold: true, color: "4F46E5" })
    ]));
  });

  // Total Row
  const totalCost = valuation.valuationRows.reduce((acc, r) => acc + r.replacementCost, 0);
  const totalDep = valuation.valuationRows.reduce((acc, r) => acc + r.depreciationAmount, 0);

  valuationTableRows.push(makeRow([
    makeCell("Total Net Building Structure Value :", { width: 5400, bold: true, gridSpan: 5 }),
    makeCell(totalCost.toLocaleString("en-IN"), { width: 1200, align: "right", bold: true }),
    makeCell(totalDep.toLocaleString("en-IN"), { width: 1200, align: "right", bold: true, color: "EF4444" }),
    makeCell(valuation.buildingNetStructuralValue.toLocaleString("en-IN"), { width: 1220, align: "right", bold: true, size: 20, color: "4F46E5" })
  ]));

  xmlBody += makeTable(valuationTableRows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  // Parts C & D (Extra Items & Amenities) Stacked layout for word (looks extremely professional)
  xmlBody += makeParagraph("Part C - (Extra Items)", { bold: true, size: 18, spaceAfter: 80 });
  const partCRows = [
    makeRow([
      makeCell("Item Component Details", { width: 6000, bold: true, shading: "F1F1F1" }),
      makeCell("Assessed Amount (Rs.)", { width: 3020, bold: true, shading: "F1F1F1", align: "right" })
    ], { isHeader: true }),
    makeRow([
      makeCell("1. Portico :", { width: 6000 }),
      makeCell(values.extraPortico.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("2. Ornamental front door :", { width: 6000 }),
      makeCell(values.extraOrnamentalDoor.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("3. Sit out/ Verandah with steel grills :", { width: 6000 }),
      makeCell(values.extraSitOut.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("4. Overhead water tank :", { width: 6000 }),
      makeCell(values.extraOverheadTank.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("5. Extra steel/ collapsible gates :", { width: 6000 }),
      makeCell(values.extraSteelGates.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("Total Part C (Extra Items Value):", { width: 6000, bold: true, shading: "EEF2FF" }),
      makeCell(valuation.extraItemsTotal.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true, color: "4F46E5", shading: "EEF2FF" })
    ])
  ];
  xmlBody += makeTable(partCRows);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  xmlBody += makeParagraph("Part D - (Amenities)", { bold: true, size: 18, spaceAfter: 80 });
  const partDRows = [
    makeRow([
      makeCell("Amenities Component Details", { width: 6000, bold: true, shading: "F1F1F1" }),
      makeCell("Assessed Amount (Rs.)", { width: 3020, bold: true, shading: "F1F1F1", align: "right" })
    ], { isHeader: true }),
    makeRow([
      makeCell("1. Wardrobes :", { width: 6000 }),
      makeCell(values.amenityWardrobes.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("2. Glazed tiles :", { width: 6000 }),
      makeCell(values.amenityGlazedTiles.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("3. Extra sinks and bath tub :", { width: 6000 }),
      makeCell(values.amenityExtraSinks.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("4. Marble / ceramic tiles flooring :", { width: 6000 }),
      makeCell(values.amenityMarbleFlooring.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("5. Interior decorations :", { width: 6000 }),
      makeCell(values.amenityInteriorDecor.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("6. Architectural elevation works :", { width: 6000 }),
      makeCell(values.amenityArchElevation.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("7. Paneling works :", { width: 6000 }),
      makeCell(values.amenityPaneling.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("8. Aluminum works :", { width: 6000 }),
      makeCell(values.amenityAluminumWorks.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("9. Aluminum hand rails :", { width: 6000 }),
      makeCell(values.amenityAluminumRails.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("10. False ceiling :", { width: 6000 }),
      makeCell(values.amenityFalseCeiling.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("Total Part D (Amenities Value):", { width: 6000, bold: true, shading: "EEF2FF" }),
      makeCell(valuation.amenitiesTotal.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true, color: "4F46E5", shading: "EEF2FF" })
    ])
  ];
  xmlBody += makeTable(partDRows);

  xmlBody += makeParagraph("Part E- (Miscellaneous) & Part F- (Services) Tables detailed overleaf.", { italic: true, align: "right", size: 16, spaceBefore: 100 });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 4", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 5: Part E, Part F, Abstract Table, Discussion, Place/Date, Bank Certification (with Typo)
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 5 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  
  xmlBody += makeParagraph("Part E - (Miscellaneous)", { bold: true, size: 18, spaceAfter: 80 });
  const partERows = [
    makeRow([
      makeCell("Miscellaneous Component Details", { width: 6000, bold: true, shading: "F1F1F1" }),
      makeCell("Assessed Amount (Rs.)", { width: 3020, bold: true, shading: "F1F1F1", align: "right" })
    ], { isHeader: true }),
    makeRow([
      makeCell("1. Separate toilet room :", { width: 6000 }),
      makeCell(values.miscToiletRoom.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("2. Separate lumber room :", { width: 6000 }),
      makeCell(values.miscLumberRoom.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("3. Separate water tank/ sump :", { width: 6000 }),
      makeCell(values.miscWaterTank.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("4. Trees, gardening :", { width: 6000 }),
      makeCell(values.miscTreesGardening.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("Total Part E (Miscellaneous Value):", { width: 6000, bold: true, shading: "EEF2FF" }),
      makeCell(valuation.miscTotal.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true, color: "4F46E5", shading: "EEF2FF" })
    ])
  ];
  xmlBody += makeTable(partERows);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  xmlBody += makeParagraph("Part F - (Services)", { bold: true, size: 18, spaceAfter: 80 });
  const partFRows = [
    makeRow([
      makeCell("Services Component Details", { width: 6000, bold: true, shading: "F1F1F1" }),
      makeCell("Assessed Amount (Rs.)", { width: 3020, bold: true, shading: "F1F1F1", align: "right" })
    ], { isHeader: true }),
    makeRow([
      makeCell("1. Water supply arrangements :", { width: 6000 }),
      makeCell(values.serviceWaterSupply.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("2. Drainage arrangements :", { width: 6000 }),
      makeCell(values.serviceDrainage.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("3. Compound wall :", { width: 6000 }),
      makeCell(values.serviceCompoundWall.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("4. C. B. deposits, fittings etc. :", { width: 6000 }),
      makeCell(values.serviceCbDeposits.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("5. Pavement :", { width: 6000 }),
      makeCell(values.servicePavement.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("Total Part F (Services Value):", { width: 6000, bold: true, shading: "EEF2FF" }),
      makeCell(valuation.servicesTotal.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true, color: "4F46E5", shading: "EEF2FF" })
    ])
  ];
  xmlBody += makeTable(partFRows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  // Abstract Table
  xmlBody += makeParagraph("Total abstract of the entire property", { bold: true, align: "center", size: 20, spaceAfter: 100 });
  const abstractRows = [
    makeRow([
      makeCell("Part- A Land Value :", { width: 6000, bold: true }),
      makeCell(valuation.landValue.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("Part- B Building (Structure + Extra C + D + E + F) :", { width: 6000, bold: true }),
      makeCell(valuation.buildingValue.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true })
    ]),
    makeRow([
      makeCell("Total property security value :", { width: 6000, bold: true, shading: "F1F1F1" }),
      makeCell(valuation.totalPropertyValue.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true, color: "4F46E5", shading: "F1F1F1" })
    ]),
    makeRow([
      makeCell("Say :", { width: 6000, bold: true }),
      makeCell(valuation.fairMarketValue.toLocaleString("en-IN"), { width: 3020, align: "right", bold: true, size: 22, color: "4F46E5" })
    ])
  ];
  xmlBody += makeTable(abstractRows);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  // Methodology Notes box
  const discussionParagraphs = [
    makeParagraph("Valuation approach, methodology & notes:", { bold: true, size: 16 }),
    makeParagraph(values.valuationCalculationsText || "", { italic: true, size: 15 })
  ];
  const discussionOuterTable = makeTable([
    makeRow([
      makeCell(discussionParagraphs.join(""), { width: 9020, shading: "FAFAFA" })
    ])
  ]);
  xmlBody += discussionOuterTable;
  xmlBody += makeParagraph("", { spaceBefore: 100 });

  // Assessed summary notes
  xmlBody += makeParagraph("• Photograph of owner/representative with property in background to be enclosed.", { bold: true, size: 15 });
  xmlBody += makeParagraph("• Screen shot of longitude/latitude and co-ordinates of property using GPS/Various Apps/Internet sites to be enclosed.", { bold: true, size: 15 });
  xmlBody += makeParagraph("• As a result of my appraisal and analysis, it is my considered opinion that the value of the above property in the prevailing condition with aforesaid specifications is as under:", { bold: true, size: 15, spaceAfter: 150 });

  // Value Summary Table
  const valSummaryRows = [
    makeRow([
      makeCell("Value Category", { width: 4510, bold: true, shading: "F1F1F1" }),
      makeCell("Amount (₹)", { width: 4510, bold: true, shading: "F1F1F1", align: "right" })
    ], { isHeader: true }),
    makeRow([
      makeCell("Fair Market value :", { width: 4510, bold: true }),
      makeCell(valuation.fairMarketValue.toLocaleString("en-IN"), { width: 4510, align: "right", bold: true, color: "4F46E5" })
    ]),
    makeRow([
      makeCell("Realizable value (85% of FMV) :", { width: 4510, bold: true, shading: "ECFDF5" }),
      makeCell(valuation.realizableValue.toLocaleString("en-IN"), { width: 4510, align: "right", bold: true, color: "065F46", shading: "ECFDF5" })
    ]),
    makeRow([
      makeCell("Distressed value (72% of FMV) :", { width: 4510, bold: true, shading: "FEF2F2" }),
      makeCell(valuation.distressedValue.toLocaleString("en-IN"), { width: 4510, align: "right", bold: true, color: "991B1B", shading: "FEF2F2" })
    ])
  ];
  xmlBody += makeTable(valSummaryRows);
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  // Place/Date & Signature Block
  const valuerSignText = `<w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Signature</w:t></w:r></w:p>` +
                         `<w:p><w:r><w:rPr><w:sz w:val="14"/><w:color w:val="555555"/></w:rPr><w:t>(Name and Official seal of Approved Valuer)</w:t></w:r></w:p>` +
                         `<w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="333333"/></w:rPr><w:t>${escapeXml(values.valuerName.toUpperCase())}</w:t></w:r></w:p>` +
                         `<w:p><w:r><w:rPr><w:sz w:val="14"/></w:rPr><w:t>Regd No: ${escapeXml(values.valuerRegNo)}</w:t></w:r></w:p>` +
                         `<w:p><w:r><w:rPr><w:sz w:val="14"/></w:rPr><w:t>${escapeXml(values.valuerAddress)}</w:t></w:r></w:p>`;

  const placeDateValText = `<w:p><w:r><w:sz w:val="18"/><w:t>Place: </w:t></w:r><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(values.valuerPlace || "Lehra Gaga")}</w:t></w:r></w:p>` +
                           `<w:p><w:r><w:sz w:val="18"/><w:t>Date: </w:t></w:r><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(values.valuationDate)}</w:t></w:r></w:p>`;

  xmlBody += makeTable([
    makeRow([
      makeCell(placeDateValText, { width: 4510 }),
      makeCell(valuerSignText, { width: 4510, align: "center" })
    ])
  ], { borders: { top: "none", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } });
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  // Bank certification block with the required typo: ".Is fare and realisable"
  const certParagraphs = [
    makeParagraph("CERTIFICATION BY BANK OFFICER (BRANCH IN-CHARGE / LOAN OFFICER)", { bold: true, size: 16 }),
    makeParagraph(`It is certified that value given in the Valuation Report the Valuation Report dated ${values.valuationDate} By the Bank’s approved valuer Mr./Ms./M/s ${values.valuerName.toUpperCase()} .Is fare and realisable as per discreet and independent enquiries made during my/our visit.`, { italic: true, size: 16 }),
    makeParagraph("", { spaceBefore: 250 }),
    makeTable([
      makeRow([
        makeCell(`Office/Manager Signature: _______________________\nName: ${escapeXml(values.bankOfficerName.toUpperCase())}\nDate: ${escapeXml(values.bankVerificationDate)}`, { width: 4510, size: 14 }),
        makeCell(`Branch in charge Signature: _______________________\nName: ${escapeXml(values.bankManagerName.toUpperCase())}\nDate: ${escapeXml(values.bankVerificationDate)}`, { width: 4510, size: 14 })
      ])
    ], { borders: { top: "none", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } })
  ];

  xmlBody += makeTable([
    makeRow([
      makeCell(certParagraphs.join(""), { width: 9020, shading: "FAFAFA" })
    ])
  ]);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  // Enclosures 1 & 2
  xmlBody += makeParagraph("Encl:", { bold: true });
  xmlBody += makeParagraph("1. Declaration from the valuer", { bold: true, spaceBefore: 0 });
  xmlBody += makeParagraph("2. Model code of conduct for valuer", { bold: true, spaceBefore: 0 });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 5", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 6: Encls 3-7 & DECLARATION FROM VALUERS (a-j) & Sign & Comments 1-3
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 6 of 11", { align: "right", bold: true, size: 16, color: "555555" });

  xmlBody += makeParagraph("3. Photograph of owner with the property in the background", { bold: true, size: 16 });
  xmlBody += makeParagraph("4. Screen shot (in hard copy) of Global Positioning System (GPS)/Various Applications (Apps)/Internet sites (eg Google earth)/etc", { bold: true, size: 16, spaceBefore: 0 });
  xmlBody += makeParagraph("5. Layout plan of the area in which the property is located", { bold: true, size: 16, spaceBefore: 0 });
  xmlBody += makeParagraph("6. Copy of Circle Rate list", { bold: true, size: 16, spaceBefore: 0 });
  xmlBody += makeParagraph("7. Any other relevant documents/extracts.", { bold: true, size: 16, spaceBefore: 0, spaceAfter: 200 });

  xmlBody += makeParagraph("DECLARATION FROM VALUERS", { bold: true, align: "center", size: 20, spaceAfter: 150 });
  xmlBody += makeParagraph("I hereby declare that-", { bold: true });

  const declarations = [
    { key: "a", text: `The information furnished in my valuation report dated ${values.valuationDate} is true and correct to the best of my knowledge and belief and I have made an impartial and true valuation of the property.` },
    { key: "b", text: "I have no direct or indirect interest in the property valued;" },
    { key: "c", text: `I have personally inspected the property on ${values.inspectionDate}. The work is not sub-contracted to any other valuer and carried out by myself.` },
    { key: "d", text: "I have not been convicted of any offence and sentenced to a term of Imprisonment;" },
    { key: "e", text: "I have not been found guilty of misconduct in my professional capacity." },
    { key: "f", text: "I have read the Handbook on Policy, Standards and procedure for Real Estate Valuation, 2011 of the IBA and this report is in conformity to the “Standards” enshrined for valuation in the Part-B of the above handbook to the best of my ability." },
    { key: "g", text: "I have read the International Valuation Standards (IVS) and the report submitted to the Bank for the respective asset class is in conformity to the “Standards” as enshrined for valuation in the IVS in “General Standards” and “Asset Standards” as applicable." },
    { key: "h", text: "I abide by the Model Code of Conduct for empanelment of valuer in the Bank. (Annexure III-A signed copy of same to be taken and kept along with this declaration)" },
    { key: "i", text: "I am the proprietor / partner / authorized official of the firm / company, who is competent to sign this valuation report." },
    { key: "j", text: "Further, I hereby provide the following information." }
  ];

  declarations.forEach((decl) => {
    xmlBody += makeParagraph(`${decl.key}. ${decl.text}`, { size: 16, spaceBefore: 80 });
  });

  xmlBody += makeParagraph("", { spaceBefore: 150 });
  // Signature block
  xmlBody += makeTable([
    makeRow([
      makeCell(placeDateValText, { width: 4510 }),
      makeCell(valuerSignText, { width: 4510, align: "center" })
    ])
  ], { borders: { top: "none", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } });
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  // Valuer Comment Table (1-3)
  const comments1_3Rows = [
    makeRow([
      makeCell("Sr. No.", { width: 600, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Particulars", { width: 3400, bold: true, shading: "F1F1F1" }),
      makeCell("Valuer comment", { width: 5020, bold: true, shading: "F1F1F1" })
    ], { isHeader: true }),
    makeRow([
      makeCell("1", { width: 600, bold: true, align: "center" }),
      makeCell("Background information of the asset being valued;", { width: 3400 }),
      makeCell(values.commentsValuer?.[0] || "", { width: 5020, size: 16 })
    ]),
    makeRow([
      makeCell("2", { width: 600, bold: true, align: "center" }),
      makeCell("Purpose of valuation and appointing authority", { width: 3400 }),
      makeCell(values.commentsValuer?.[1] || "", { width: 5020, size: 16 })
    ]),
    makeRow([
      makeCell("3", { width: 600, bold: true, align: "center" }),
      makeCell("Identity of the valuer and any other experts involved in the valuation;", { width: 3400 }),
      makeCell(values.commentsValuer?.[2] || "", { width: 5020, size: 16 })
    ])
  ];
  xmlBody += makeTable(comments1_3Rows);

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 6", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 7: Valuer Comments 4-11, Sign, Code of conduct 1-3
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 7 of 11", { align: "right", bold: true, size: 16, color: "555555" });

  const comments4_11Rows = [
    makeRow([
      makeCell("Sr. No.", { width: 600, bold: true, align: "center", shading: "F1F1F1" }),
      makeCell("Particulars", { width: 3400, bold: true, shading: "F1F1F1" }),
      makeCell("Valuer comment", { width: 5020, bold: true, shading: "F1F1F1" })
    ], { isHeader: true })
  ];

  const commentLabels = [
    { sNo: 4, label: "Disclosure of valuer interest or conflict, if any;", val: values.commentsValuer?.[3] },
    { sNo: 5, label: "Date of appointment, valuation date and date of report;", val: values.commentsValuer?.[4] },
    { sNo: 6, label: "Inspections and/or investigations undertaken;", val: values.commentsValuer?.[5] },
    { sNo: 7, label: "Nature and sources of the information used or relied upon;", val: values.commentsValuer?.[6] },
    { sNo: 8, label: "Procedures adopted in carrying out the valuation and valuation standards followed;", val: values.commentsValuer?.[7] },
    { sNo: 9, label: "Restrictions on use of the report, if any;", val: values.commentsValuer?.[8] },
    { sNo: 10, label: "Major factors that were taken into account during the valuation;", val: values.commentsValuer?.[9] },
    { sNo: 11, label: "Caveats, limitations and disclaimers to the extent they explain or elucidate the limitations faced by valuer, which shall not be for the purpose of limiting his responsibility for the valuation report.", val: values.commentsValuer?.[10] }
  ];

  commentLabels.forEach((row) => {
    comments4_11Rows.push(makeRow([
      makeCell(String(row.sNo), { width: 600, bold: true, align: "center" }),
      makeCell(row.label, { width: 3400 }),
      makeCell(row.val || "", { width: 5020, size: 16 })
    ]));
  });

  xmlBody += makeTable(comments4_11Rows);
  xmlBody += makeParagraph("", { spaceBefore: 150 });

  // Signature Block
  xmlBody += makeTable([
    makeRow([
      makeCell(placeDateValText, { width: 4510 }),
      makeCell(valuerSignText, { width: 4510, align: "center" })
    ])
  ], { borders: { top: "none", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } });
  xmlBody += makeParagraph("", { spaceBefore: 200 });

  xmlBody += makeParagraph("MODEL CODE OF CONDUCT FOR VALUERS", { bold: true, align: "center", size: 20, spaceAfter: 50 });
  xmlBody += makeParagraph("{Adopted in line with Companies (Registered Valuers and Valuation Rules, 2017)}", { italic: true, align: "center", size: 16, spaceAfter: 150 });

  xmlBody += makeParagraph("All valuers empaneled with bank shall strictly adhere to the following code of conduct:", { bold: true, size: 16 });
  xmlBody += makeParagraph("Integrity and Fairness", { bold: true, size: 16, color: "4F46E5", spaceBefore: 100 });

  xmlBody += makeParagraph("1. A valuer shall, in the conduct of his/its business, follow high standards of integrity and fairness in all his/its dealings with his/its clients and other valuers.", { size: 16, spaceBefore: 50 });
  xmlBody += makeParagraph("2. A valuer shall maintain integrity by being honest, straightforward, and forthright in all professional relationships.", { size: 16, spaceBefore: 50 });
  xmlBody += makeParagraph("3. A valuer shall endeavor to ensure that he/it provides true and adequate information and shall not misrepresent any facts or situations.", { size: 16, spaceBefore: 50 });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 7", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 8: Code of conduct (4-20)
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 8 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("MODEL CODE OF CONDUCT (Continued)", { bold: true, align: "center", size: 18, spaceAfter: 150 });

  const ethicsPage8 = [
    "4. A valuer shall refrain from being involved in any action that would bring disrepute to the profession.",
    "5. A valuer shall keep public interest foremost while delivering his services.",
    "\nProfessional Competence and Due Care",
    "6. A valuer shall render at all times high standards of service, exercise due diligence, ensure proper care and exercise independent professional judgment.",
    "7. A valuer shall carry out professional services in accordance with the relevant technical and professional standards that may be specified from time to time.",
    "8. A valuer shall continuously maintain professional knowledge and skill to provide competent professional service based on up-to-date developments in practice, prevailing regulations/guidelines and techniques.",
    "9. In the preparation of a valuation report, the valuer shall not disclaim liability for his/its expertise or deny his/its duty of care, except to the extent that the assumptions are based on statements of fact provided by the company or its auditors or consultants or information available in public domain and not generated by the valuer.",
    "10. A valuer shall not carry out any instruction of the client insofar as they are incompatible with the requirements of integrity, objectivity and independence.",
    "11. A valuer shall clearly state to his client the services that he would be competent to provide and the services for which he would be relying on other valuers or professionals or for which the client can have a separate arrangement with other valuers.",
    "\nIndependence and Disclosure of Interest",
    "12. A valuer shall act with objectivity in his/its professional dealings by ensuring that his/its decisions are made without the presence of any bias, conflict of interest, coercion, or undue influence of any party, whether directly connected to the valuation assignment or not.",
    "13. A valuer shall not take up an assignment if he/it or any of his/its relatives or associates is not independent in terms of association to the company.",
    "14. A valuer shall maintain complete independence in his/its professional relationships and shall conduct the valuation independent of external influences.",
    "15. A valuer shall wherever necessary disclose to the clients, possible sources of conflicts of duties and interests, while providing unbiased services.",
    "16. A valuer shall not deal in securities of any subject company after any time when he/it first becomes aware of the possibility of his/its association with the valuation, and in accordance with the SEBI (Prohibition of Insider Trading) Regulations, 2015 or till the time the valuation report becomes public, whichever is earlier.",
    "17. A valuer shall not indulge in “mandate snatching” or offering “convenience valuations” in order to cater to a company or client’s needs.",
    "18. As an independent valuer, the valuer shall not charge success fee (Success fees may be defined as a compensation / incentive paid to any third party for successful closure of transaction. In this case, approval of credit proposals).",
    "19. In any fairness opinion or independent expert opinion submitted by a valuer, if there has been a prior engagement in an unconnected transaction, the valuer shall declare the association with the company during the last five years.",
    "\nConfidentiality",
    "20. A valuer shall not use or divulge to other clients or any other party any confidential information about the subject company, which has come to his/its knowledge without proper and specific authority or unless there is a legal or professional right or duty to disclose."
  ];

  ethicsPage8.forEach((text) => {
    if (text.startsWith("\n")) {
      xmlBody += makeParagraph(text.trim(), { bold: true, size: 16, color: "4F46E5", spaceBefore: 120 });
    } else {
      xmlBody += makeParagraph(text, { size: 16, spaceBefore: 60 });
    }
  });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 8", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 9: Code of conduct (21-30) & Valuer Sign
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 9 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("MODEL CODE OF CONDUCT (Continued)", { bold: true, align: "center", size: 18, spaceAfter: 150 });

  const ethicsPage9 = [
    "Information Management",
    "21. A valuer shall ensure that he/ it maintains written contemporaneous records for any decision taken, the reasons for taking the decision, and the information and evidence in support of such decision. This shall be maintained so as to sufficiently enable a reasonable person to take a view on the appropriateness of his/its decisions and actions.",
    "22. A valuer shall appear, co-operate and be available for inspections and investigations carried out by the authority, any person authorized by the authority, the registered valuer’s organization with which he/it is registered or any other statutory regulatory body.",
    "23. A valuer shall provide all information and records as may be required by the authority, the Tribunal, Appellate Tribunal, the registered valuer’s organization with which he/it is registered, or any other statutory regulatory body.",
    "24. A valuer while respecting the confidentiality of information acquired during the course of performing professional services, shall maintain proper working papers for a period of three years or such longer period as required in its contract for a specific valuation, for production before a regulatory authority or for a peer review.",
    "\nGifts and hospitality",
    "25. A valuer or his/its relative shall not accept gifts or hospitality which undermines or affects his independence as a valuer.\nExplanation: For the purposes of this code the term ‘relative’ shall have the same meaning as defined in clause (77) of Section 2 of the Companies Act, 2013.",
    "26. A valuer shall not offer gifts or hospitality or a financial or any other advantage to a public servant or any other person with a view to obtain or retain work for himself/ itself, or to obtain or retain an advantage in the conduct of profession for himself/ itself.",
    "\nRemuneration and Costs",
    "27. A valuer shall provide services for remuneration which is charged in a transparent manner, is a reasonable reflection of the work necessarily and properly undertaken, and is not inconsistent with the applicable rules.",
    "28. A valuer shall not accept any fees or charges other than those which are disclosed in a written contract with the person to whom he would be rendering service.",
    "\nOccupation, employability and restrictions",
    "29. A valuer shall refrain from accepting too many assignments, if he/it is unlikely to be able to devote adequate time to each of his/ its assignments.",
    "30. A valuer shall not conduct business which in the opinion of the authority or the registered valuer organization discredits the profession."
  ];

  ethicsPage9.forEach((text) => {
    if (text === "Information Management" || text.startsWith("\n")) {
      xmlBody += makeParagraph(text.trim(), { bold: true, size: 16, color: "4F46E5", spaceBefore: 120 });
    } else {
      xmlBody += makeParagraph(text, { size: 16, spaceBefore: 60 });
    }
  });

  xmlBody += makeParagraph("", { spaceBefore: 200 });
  // Signature block
  xmlBody += makeTable([
    makeRow([
      makeCell(placeDateValText, { width: 4510 }),
      makeCell(valuerSignText, { width: 4510, align: "center" })
    ])
  ], { borders: { top: "none", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 9", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 10: Google Map route visual box
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 10 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("Google Map of property", { bold: true, align: "center", size: 22 });
  xmlBody += makeParagraph(`is Situated at ${values.postalAddress.toUpperCase()}`, { italic: true, align: "center", size: 16, spaceAfter: 200 });

  // Draw a beautiful map frame table in Word
  const mapFrameParagraphs = [
    makeParagraph("Google Maps Screenshot Annexure Frame", { align: "center", bold: true, size: 18, color: "555555" }),
    makeParagraph("\n[A high resolution route screenshot is mapped in this frame during digital submission]", { align: "center", italic: true, size: 15, color: "888888" }),
    makeParagraph("\nGPS Location Coordinates:", { align: "center", bold: true, size: 16 }),
    makeParagraph(`Latitude: ${values.latitude}  |  Longitude: ${values.longitude}`, { align: "center", bold: true, size: 18, color: "4F46E5" }),
    makeParagraph(`\nProperty Address: ${values.postalAddress}`, { align: "center", size: 15 })
  ];

  xmlBody += makeTable([
    makeRow([
      makeCell(mapFrameParagraphs.join(""), { width: 9020, shading: "FAFAFA", vAlign: "center" })
    ])
  ], { width: 9020 });

  xmlBody += makeParagraph("", { spaceBefore: 200 });
  
  // Footer meta rows
  const mapFooterRows = [
    makeRow([
      makeCell(`Plot Area :- ${values.plotArea} Sq Yards`, { width: 4510, bold: true, size: 16 }),
      makeCell(`Covered Area :- ${values.coveredArea} Sq Ft`, { width: 4510, bold: true, size: 16, align: "right" })
    ])
  ];
  xmlBody += makeTable(mapFooterRows, { borders: { top: "single", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 10", { align: "center", size: 14, color: "888888", spaceBefore: 200 });
  xmlBody += makePageBreak();

  // ----------------------------------------------------
  // PAGE 11: Photographs visual box
  // ----------------------------------------------------
  xmlBody += makeParagraph("Page 11 of 11", { align: "right", bold: true, size: 16, color: "555555" });
  xmlBody += makeParagraph("Photograph of property", { bold: true, align: "center", size: 22 });
  xmlBody += makeParagraph(`is Situated at ${values.postalAddress.toUpperCase()}`, { italic: true, align: "center", size: 16, spaceAfter: 200 });

  // Two beautiful photo frames side-by-side (rendered as stack in Word for compatibility)
  const frontPhotoFrameParagraphs = [
    makeParagraph("1. Front Elevation View Photograph", { align: "center", bold: true, size: 16 }),
    makeParagraph("\n[Photographic evidence of front facade with valuer / representative in the background is annexed here]", { align: "center", italic: true, size: 14, color: "888888" })
  ];

  const interiorPhotoFrameParagraphs = [
    makeParagraph("2. Interior View / Lobby Photograph", { align: "center", bold: true, size: 16 }),
    makeParagraph("\n[Photographic evidence of internal construction quality, fixtures and finish is annexed here]", { align: "center", italic: true, size: 14, color: "888888" })
  ];

  xmlBody += makeTable([
    makeRow([
      makeCell(frontPhotoFrameParagraphs.join(""), { width: 9020, shading: "FAFAFA", vAlign: "center" })
    ]),
    makeRow([
      makeCell(interiorPhotoFrameParagraphs.join(""), { width: 9020, shading: "FAFAFA", vAlign: "center" })
    ])
  ]);

  xmlBody += makeParagraph("", { spaceBefore: 200 });

  xmlBody += makeTable([
    makeRow([
      makeCell(`Plot Area :- ${values.plotArea} Sq Yards`, { width: 4510, bold: true, size: 16 }),
      makeCell(`Covered Area :- ${values.coveredArea} Sq Ft`, { width: 4510, bold: true, size: 16, align: "right" })
    ])
  ], { borders: { top: "single", left: "none", bottom: "none", right: "none", insideH: "none", insideV: "none" } });

  // Footer
  xmlBody += makeParagraph("Punjab & Sind Bank Valuation Template - Page 11", { align: "center", size: 14, color: "888888", spaceBefore: 200 });

  // ----------------------------------------------------
  // ASSEMBLE OPENXML ZIP STRUCTURE
  // ----------------------------------------------------
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${xmlBody}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const zip = new PizZip();
  zip.file("word/document.xml", documentXml);
  zip.file("[Content_Types].xml", contentTypesXml);
  zip.file("_rels/.rels", relsXml);

  const out = zip.generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(out, `Valuation_Report_${primaryOwner.ownerName.replace(/\s+/g, "_")}.docx`);
}
