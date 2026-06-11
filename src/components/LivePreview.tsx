import * as React from "react";
import { useWatch, Control } from "react-hook-form";
import { FileText, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { calculateValuation, formatIndianCurrency } from "@/lib/valuation-math";
import { ValuationFormValues } from "@/lib/form-schema";
import { Button } from "./ui/button";

interface LivePreviewProps {
  control: Control<ValuationFormValues>;
  hideHeader?: boolean;
  theme?: "dark" | "light" | "warm";
}

export function LivePreview({ control, hideHeader = false, theme = "dark" }: LivePreviewProps) {
  const [zoom, setZoom] = React.useState(0.75);

  const values = useWatch({ control }) as ValuationFormValues;
  
  if (!values) return null;

  const valuation = calculateValuation(values);
  const ownersList = values.owners || [];
  const primaryOwner = ownersList[0] || { ownerName: "", fatherHusbandName: "", mobileNumber: "", address: "" };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.4));
  const resetZoom = () => setZoom(0.75);

  // Background and styling overrides based on theme
  const containerBg = theme === "warm" 
    ? "bg-[#e6e2da]" 
    : theme === "light" 
      ? "bg-slate-100" 
      : "bg-slate-900";

  const workspaceBg = theme === "warm"
    ? "bg-[#e6e2da]"
    : theme === "light"
      ? "bg-slate-100"
      : "bg-slate-950/80";

  const mainBorder = theme === "warm"
    ? "border-none"
    : "border dark:border-slate-800 rounded-xl shadow-2xl";

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden relative ${containerBg} ${mainBorder}`}>
      {/* Zoom / Controls Header */}
      {!hideHeader && (
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Punjab & Sind Bank - 11 Page Template Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={zoomOut}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[10px] text-slate-400 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={zoomIn}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={resetZoom}>
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Zoom controls when standard header is hidden */}
      {hideHeader && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-900/90 text-white backdrop-blur px-3 py-1.5 rounded-full shadow-lg border border-slate-800">
          <button type="button" className="p-1 text-slate-400 hover:text-white transition-colors" onClick={zoomOut} title="Zoom Out">
            <ZoomOut className="h-3 w-3" />
          </button>
          <span className="text-[10px] text-slate-300 font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
          <button type="button" className="p-1 text-slate-400 hover:text-white transition-colors" onClick={zoomIn} title="Zoom In">
            <ZoomIn className="h-3 w-3" />
          </button>
          <button type="button" className="p-1 text-slate-400 hover:text-white transition-colors" onClick={resetZoom} title="Reset Zoom">
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Pages Workspace (Scrollable) */}
      <div className={`flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6 ${workspaceBg}`}>
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          className="transition-transform duration-200 ease-out origin-top flex flex-col gap-6"
        >
          
          {/* PAGE 1 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 1 of 11</div>
              
              <div className="space-y-1 mb-6">
                <p className="font-bold">To</p>
                <p className="font-bold pl-4">The Manager,</p>
                <p className="font-bold pl-4">Punjab & Sind Bank</p>
                <p className="font-bold pl-4">BRANCH: <span className="underline uppercase">{values.branchName}</span></p>
              </div>

              <h2 className="text-center font-bold text-sm underline decoration-1 uppercase mb-3">GENERAL</h2>

              <table className="w-full border border-black border-collapse text-left">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">1.</td>
                    <td className="w-1/2 border-r border-black p-1">Purpose for which the valuation is made :</td>
                    <td className="p-1 font-bold uppercase">{values.purposeOfValuation}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">2.</td>
                    <td className="border-r border-black p-1">
                      a) Date of inspection :<br />
                      b) Date on which the valuation is Made :
                    </td>
                    <td className="p-1">
                      a) <span className="font-bold">{values.inspectionDate}</span><br />
                      b) <span className="font-bold">{values.valuationDate}</span>
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">3.</td>
                    <td className="border-r border-black p-1">List of documents produced for perusal</td>
                    <td className="p-1 whitespace-pre-wrap font-sans text-[10px]">{values.perusalDocuments}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">4.</td>
                    <td className="border-r border-black p-1">
                      Name of the owner(s) and his / their address(es) with Phone no. (details of share of each owner in case of joint ownership)
                    </td>
                    <td className="p-1 font-sans text-[10px]">
                      {ownersList.map((owner, idx) => (
                        <div key={idx} className="border-b last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                          <span className="font-bold uppercase">{owner.ownerName}</span> (S/o, W/o {owner.fatherHusbandName})<br />
                          Share: <span className="font-bold">{owner.ownershipShare}</span> | Ph: {owner.mobileNumber}<br />
                          Address: {owner.address}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">5.</td>
                    <td className="border-r border-black p-1">Brief description of the property (Including leasehold / freehold etc)</td>
                    <td className="p-1 whitespace-pre-wrap font-sans text-[10px]">{values.propertyDescription}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">6.</td>
                    <td className="border-r border-black p-1">
                      Location of property<br />
                      a) Plot No. / Survey No. :<br />
                      b) Door No. :<br />
                      c) T. S. No. / Village :<br />
                      d) Ward / Taluka :<br />
                      e) Mandal / District :
                    </td>
                    <td className="p-1 font-bold uppercase">
                      <br />
                      a) {values.plotNumber} / {values.surveyNumber}<br />
                      b) {values.doorNumber}<br />
                      c) {values.village}<br />
                      d) {values.taluka}<br />
                      e) {values.district}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">7.</td>
                    <td className="border-r border-black p-1">Postal address of the property :</td>
                    <td className="p-1 uppercase font-sans text-[10px]">{values.postalAddress}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">8.</td>
                    <td className="border-r border-black p-1">
                      City / Town :<br />
                      Residential Area :<br />
                      Commercial Area :<br />
                      Industrial Area :
                    </td>
                    <td className="p-1 uppercase">
                      {values.village}<br />
                      {values.propertyType === "Residential" ? "YES" : "NO"}<br />
                      {values.propertyType === "Commercial" ? "YES" : "NO"}<br />
                      {values.propertyType === "Industrial" ? "YES" : "NO"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">9.</td>
                    <td className="border-r border-black p-1">
                      Classification of the area<br />
                      1) High / Middle / Poor :<br />
                      2) Metro / Urban / Semi Urban / Rural :
                    </td>
                    <td className="p-1 uppercase font-bold">
                      <br />
                      1) {values.areaClassification}<br />
                      2) {values.areaType}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">10.</td>
                    <td className="border-r border-black p-1">Coming under Corporation limit / Village Panchayat / Municipality :</td>
                    <td className="p-1 uppercase font-bold">{values.municipalityType}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">11.</td>
                    <td className="border-r border-black p-1">
                      Whether covered under any State / Central Govt. enactments (e.g. Urban Land Ceiling Act) or notified under agency area / scheduled area / cantonment area :
                    </td>
                    <td className="p-1 font-sans text-[10px]">{values.govtEnactments}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">12.</td>
                    <td className="border-r border-black p-1">In case it is an agricultural land, any conversion to house site plots is contemplated :</td>
                    <td className="p-1 font-sans text-[10px]">{values.agriculturalConversion}</td>
                  </tr>
                  <tr className="border-b-0">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">13.</td>
                    <td className="border-r border-black p-1">
                      Boundaries of the property
                    </td>
                    <td className="p-0">
                      <table className="w-full border-0 text-[10px] border-collapse">
                        <thead>
                          <tr className="border-b border-black bg-slate-50 font-bold">
                            <td className="p-1 border-r border-black w-24">Side</td>
                            <td className="p-1 border-r border-black">As per Sale Deed 1</td>
                            <td className="p-1 border-r border-black">As per Sale Deed 2</td>
                            <td className="p-1">As per the Site</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-black">
                            <td className="p-1 border-r border-black font-bold">North :</td>
                            <td className="p-1 border-r border-black">{values.boundaryNorthDeed}</td>
                            <td className="p-1 border-r border-black">{values.boundaryNorthDeed2}</td>
                            <td className="p-1">{values.boundaryNorthSite}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGE 2 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 2 of 11</div>

              <div className="border border-black">
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-black bg-slate-50 font-bold">
                      <td className="p-1 border-r border-black w-32">Side</td>
                      <td className="p-1 border-r border-black">As per Sale Deed 1</td>
                      <td className="p-1 border-r border-black">As per Sale Deed 2</td>
                      <td className="p-1">As per the Site</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">South :</td>
                      <td className="p-1 border-r border-black">{values.boundarySouthDeed}</td>
                      <td className="p-1 border-r border-black">{values.boundarySouthDeed2}</td>
                      <td className="p-1">{values.boundarySouthSite}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">East :</td>
                      <td className="p-1 border-r border-black">{values.boundaryEastDeed}</td>
                      <td className="p-1 border-r border-black">{values.boundaryEastDeed2}</td>
                      <td className="p-1">{values.boundaryEastSite}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold">West :</td>
                      <td className="p-1 border-r border-black">{values.boundaryWestDeed}</td>
                      <td className="p-1 border-r border-black">{values.boundaryWestDeed2}</td>
                      <td className="p-1">{values.boundaryWestSite}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <table className="w-full border border-black border-collapse text-left">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">14.1</td>
                    <td className="w-1/2 border-r border-black p-1">
                      Dimensions of the site
                    </td>
                    <td className="p-0">
                      <table className="w-full border-0 text-[10px] border-collapse">
                        <thead>
                          <tr className="border-b border-black bg-slate-50 font-bold">
                            <td className="p-1 border-r border-black w-20">Direction</td>
                            <td className="p-1 border-r border-black">A: Deed 1</td>
                            <td className="p-1 border-r border-black">B: Deed 2</td>
                            <td className="p-1">C: Actuals</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-black">
                            <td className="p-1 border-r border-black font-bold">North :</td>
                            <td className="p-1 border-r border-black">{values.dimensionNorthDeed}</td>
                            <td className="p-1 border-r border-black">{values.dimensionNorthDeed2}</td>
                            <td className="p-1">{values.dimensionNorthSite}</td>
                          </tr>
                          <tr className="border-b border-black">
                            <td className="p-1 border-r border-black font-bold">South :</td>
                            <td className="p-1 border-r border-black">{values.dimensionSouthDeed}</td>
                            <td className="p-1 border-r border-black">{values.dimensionSouthDeed2}</td>
                            <td className="p-1">{values.dimensionSouthSite}</td>
                          </tr>
                          <tr className="border-b border-black">
                            <td className="p-1 border-r border-black font-bold">East :</td>
                            <td className="p-1 border-r border-black">{values.dimensionEastDeed}</td>
                            <td className="p-1 border-r border-black">{values.dimensionEastDeed2}</td>
                            <td className="p-1">{values.dimensionEastSite}</td>
                          </tr>
                          <tr className="border-b-0">
                            <td className="p-1 border-r border-black font-bold">West :</td>
                            <td className="p-1 border-r border-black">{values.dimensionWestDeed}</td>
                            <td className="p-1 border-r border-black">{values.dimensionWestDeed2}</td>
                            <td className="p-1">{values.dimensionWestSite}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">14.2</td>
                    <td className="border-r border-black p-1">Latitude, Longitude and Coordinates of the site :</td>
                    <td className="p-1 font-bold text-black">Lat: {values.latitude} / Lng: {values.longitude}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">15.</td>
                    <td className="border-r border-black p-1">Extent of the site :</td>
                    <td className="p-1 font-bold">{values.extentSite}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">16.</td>
                    <td className="border-r border-black p-1">Extent of the site considered for valuation (least of 14 A & 14 B) :</td>
                    <td className="p-1 font-bold">{values.extentValuation}</td>
                  </tr>
                  <tr className="border-b-0">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">17.</td>
                    <td className="border-r border-black p-1">Whether occupied by the owner / tenant? If occupied by tenant, since how long? Rent received per month. :</td>
                    <td className="p-1 font-sans text-[10px]">{values.occupancyDetails}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-center font-bold text-sm underline decoration-1 uppercase mt-4 mb-2">II. CHARACTERISTICS OF THE SITE</h2>
              
              <table className="w-full border border-black border-collapse text-left text-[9px]">
                <thead>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="w-8 border-r border-black p-1 text-center">S.No</td>
                    <td className="w-1/2 border-r border-black p-1">Characteristics Parameter</td>
                    <td className="p-1">Observation / Specification Status</td>
                  </tr>
                </thead>
                <tbody>
                  {[
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
                    { sNo: 20, label: "Special remarks, if any (threat of acquisition, road widening, CRZ provisions etc.)", val: values.charSpecialRemarks },
                  ].map((row) => (
                    <tr key={row.sNo} className="border-b border-black last:border-0">
                      <td className="border-r border-black p-1 text-center font-bold">{row.sNo}.</td>
                      <td className="border-r border-black p-1">{row.label}</td>
                      <td className="p-1 font-sans text-[9px] uppercase">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGE 3 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 3 of 11</div>

              <h2 className="text-center font-bold text-sm underline decoration-1 uppercase mb-2">Part – A (Valuation of land)</h2>
              
              <table className="w-full border border-black border-collapse text-left">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1.5 text-center font-bold">1.</td>
                    <td className="w-1/2 border-r border-black p-1.5">
                      Size of plot :<br />
                      North & South :<br />
                      East & West :
                    </td>
                    <td className="p-1.5 font-sans text-[10px]">
                      <br />
                      North: {values.dimensionNorthDeed} / South: {values.dimensionSouthDeed}<br />
                      East: {values.dimensionEastDeed} / West: {values.dimensionWestDeed}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1.5 text-center font-bold">2.</td>
                    <td className="border-r border-black p-1.5">Total extent of the plot :</td>
                    <td className="p-1.5 font-bold">{values.plotArea} Sq Yards</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1.5 text-center font-bold">3.</td>
                    <td className="border-r border-black p-1.5">Prevailing market rate (Along with details /reference of at least two latest deals/transactions with respect to adjacent properties in the areas) :</td>
                    <td className="p-1.5 font-bold">{formatIndianCurrency(values.marketRate)} / Sq Yard</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1.5 text-center font-bold">4.</td>
                    <td className="border-r border-black p-1.5">Guideline rate obtained from the Registrar’s Office (an evidence thereof to be enclosed) :</td>
                    <td className="p-1.5 font-bold">{formatIndianCurrency(values.guidelineRate)} / Sq Yard</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1.5 text-center font-bold">5.</td>
                    <td className="border-r border-black p-1.5">Assessed / adopted rate of valuation :</td>
                    <td className="p-1.5 font-bold text-black">{formatIndianCurrency(values.marketRate)} / Sq Yard</td>
                  </tr>
                  <tr className="border-b-0">
                    <td className="w-8 border-r border-black p-1.5 text-center font-bold">6.</td>
                    <td className="border-r border-black p-1.5 text-black font-bold">Estimated value of land :</td>
                    <td className="p-1.5 font-bold text-black text-xs">{formatIndianCurrency(valuation.landValue)}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-center font-bold text-sm underline decoration-1 uppercase mt-4 mb-2">Part – B (Valuation of Building)</h2>
              
              <table className="w-full border border-black border-collapse text-left text-[10px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1 text-center font-bold">1.</td>
                    <td className="border-r border-black p-1" colSpan={2}>Technical details of the building :</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="w-1/2 border-r border-black p-1">a) Type of Building (Residential / Commercial / Industrial) :</td>
                    <td className="p-1 font-bold uppercase">{values.propertyType}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">b) Type of construction (Load bearing / RCC / Steel Framed) :</td>
                    <td className="p-1 font-bold uppercase">{values.constructionType}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">c) Year of construction :</td>
                    <td className="p-1 font-bold">{values.yearOfConstruction}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">d) Number of floors and height of each floor including basement, if any :</td>
                    <td className="p-1 font-bold">{values.numberOfFloors} Floors (Height: ~10 Ft per floor)</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">e) Plinth area floor-wise :</td>
                    <td className="p-1 font-sans text-[9px] font-bold">{values.plinthArea}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">f) Condition of the building (Exterior / Interior) :</td>
                    <td className="p-1">Exterior: <span className="font-bold">{values.conditionExterior}</span> / Interior: <span className="font-bold">{values.conditionInterior}</span></td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">g) Date of issue and validity of layout of approved map / plan :</td>
                    <td className="p-1 font-sans text-[9px]">{values.layoutApprovalDateValidity}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">h) Approved map / plan issuing authority :</td>
                    <td className="p-1 font-bold uppercase">{values.layoutApprovalAuthority}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">i) Whether genuineness or authenticity of approved map / plan is verified :</td>
                    <td className="p-1 font-bold">{values.layoutApprovalGenuineness}</td>
                  </tr>
                  <tr className="border-b-0">
                    <td className="w-8 border-r border-black p-1"></td>
                    <td className="border-r border-black p-1">j) Any other comments on authentic of approved plan :</td>
                    <td className="p-1 font-sans text-[9px]">{values.layoutApprovalComments}</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="font-bold text-[10px] uppercase mt-2">Specifications of construction (Floor-wise) in respect of :</h3>
              
              <table className="w-full border border-black border-collapse text-left text-[9px]">
                <thead>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="w-8 border-r border-black p-1 text-center">S.No</td>
                    <td className="w-1/3 border-r border-black p-1">Description</td>
                    <td className="border-r border-black p-1 w-1/3">Ground floor</td>
                    <td className="p-1 w-1/3">Other floors</td>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sNo: 1, desc: "Foundation", g: values.specFoundationGround, o: values.specFoundationOther },
                    { sNo: 2, desc: "Basement", g: values.specBasementGround, o: values.specBasementOther },
                    { sNo: 3, desc: "Superstructure", g: values.specSuperstructureGround, o: values.specSuperstructureOther },
                    { sNo: 4, desc: "Joinery / Doors & Windows (timbers, shutters, frames etc.)", g: values.specJoineryGround, o: values.specJoineryOther },
                    { sNo: 5, desc: "RCC works", g: values.specRccGround, o: values.specRccOther },
                    { sNo: 6, desc: "Plastering", g: values.specPlasteringGround, o: values.specPlasteringOther },
                    { sNo: 7, desc: "Flooring, Skirting, dadoing", g: values.specFlooringGround, o: values.specFlooringOther },
                    { sNo: 8, desc: "Special finish as marble, granite, wooden paneling, grills, etc", g: values.specSpecialFinishGround, o: values.specSpecialFinishOther },
                    { sNo: 9, desc: "Roofing including weather proof course", g: values.specRoofingGround, o: values.specRoofingOther },
                  ].map((row) => (
                    <tr key={row.sNo} className="border-b border-black last:border-b-0">
                      <td className="border-r border-black p-1 text-center font-bold">{row.sNo}.</td>
                      <td className="border-r border-black p-1 font-bold">{row.desc}</td>
                      <td className="border-r border-black p-1 font-sans text-[8px] whitespace-pre-wrap">{row.g}</td>
                      <td className="p-1 font-sans text-[8px] whitespace-pre-wrap">{row.o}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border border-black border-collapse text-left text-[9px] mt-2">
                <tbody>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="w-8 border-r border-black p-1 text-center">S.No</td>
                    <td className="w-1/3 border-r border-black p-1">Description</td>
                    <td className="border-r border-black p-1 w-1/3">Ground Floor</td>
                    <td className="p-1 w-1/3">Other Floor</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-center font-bold" rowSpan={4}>1.</td>
                    <td className="border-r border-black p-1 font-bold">Compound Wall :</td>
                    <td className="border-r border-black p-1" rowSpan={4} colSpan={2}>
                      Height: <span className="font-bold">{values.compoundHeight}</span><br />
                      Length: <span className="font-bold">{values.compoundLength}</span><br />
                      Type of Construction: <span className="font-bold">{values.compoundType}</span>
                    </td>
                  </tr>
                  <tr className="border-b border-black"><td className="border-r border-black p-1 text-slate-400">Height</td></tr>
                  <tr className="border-b border-black"><td className="border-r border-black p-1 text-slate-400">Length</td></tr>
                  <tr className="border-b border-black"><td className="border-r border-black p-1 text-slate-400">Type of Construction</td></tr>

                  <tr className="border-0">
                    <td className="border-r border-black p-1 text-center font-bold">2.</td>
                    <td className="border-r border-black p-1 font-bold">Electrical Installation</td>
                    <td className="border-r border-black p-1">
                      Wiring: <span className="font-bold">{values.electricalWiring}</span><br />
                      Fitting: <span className="font-bold">{values.electricalFitting}</span>
                    </td>
                    <td className="p-1 font-sans text-[8px]">{values.electricalOther}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGE 4 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 4 of 11</div>

              <table className="w-full border border-black border-collapse text-[10px]">
                <tbody>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="p-1 border-r border-black w-1/3">Electrical Parameters</td>
                    <td className="p-1">Specification observations</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">Number of Light Points :</td>
                    <td className="p-1 font-bold">{values.electricalLightPoints}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">Fan Point :</td>
                    <td className="p-1 font-bold">{values.electricalFanPoints}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">Spare plug points :</td>
                    <td className="p-1 font-bold">{values.electricalPlugs}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">Any other item :</td>
                    <td className="p-1 font-sans text-[9px]">{values.electricalOther}</td>
                  </tr>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="p-1 border-r border-black">3. Plumbing Installation</td>
                    <td className="p-1">Specification observations</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">a) No. of Water Closets and their type :</td>
                    <td className="p-1 font-sans text-[9px]">{values.plumbingWaterClosets}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">b) No. of Wash basins :</td>
                    <td className="p-1 font-sans text-[9px]">{values.plumbingWashBasins}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">c) No of Urinals :</td>
                    <td className="p-1 font-sans text-[9px]">{values.plumbingUrinals}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">d) No. of Bath tubs :</td>
                    <td className="p-1 font-sans text-[9px]">{values.plumbingBathTubs}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-bold">e) Water meter, taps, etc. :</td>
                    <td className="p-1 font-sans text-[9px]">{values.plumbingWaterMeter}</td>
                  </tr>
                  <tr className="border-0">
                    <td className="p-1 border-r border-black font-bold">f) Any other fixtures :</td>
                    <td className="p-1 font-sans text-[9px]">{values.plumbingOther}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-center font-bold text-xs underline decoration-1 uppercase mt-4 mb-2">DETAILS OF VALUATION</h2>
              
              <table className="w-full border border-black border-collapse text-[9px] text-center font-serif">
                <thead>
                  <tr className="border-b border-black bg-slate-100 font-bold">
                    <td className="p-1 border-r border-black w-24">Particular of item</td>
                    <td className="p-1 border-r border-black">Plinth Area (sft)</td>
                    <td className="p-1 border-r border-black">Remaining age of building</td>
                    <td className="p-1 border-r border-black">depreciation %</td>
                    <td className="p-1 border-r border-black">Est. replacement rate</td>
                    <td className="p-1 border-r border-black">Replacement cost (₹)</td>
                    <td className="p-1 border-r border-black">Depreciation (₹)</td>
                    <td className="p-1">Net value after (₹)</td>
                  </tr>
                </thead>
                <tbody>
                  {valuation.valuationRows.map((row, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="p-1 border-r border-black font-bold text-left">{row.particularOfItem}</td>
                      <td className="p-1 border-r border-black font-sans">{row.plinthArea}</td>
                      <td className="p-1 border-r border-black font-sans">{row.remainingAge}</td>
                      <td className="p-1 border-r border-black font-sans">{row.depreciationPct}%</td>
                      <td className="p-1 border-r border-black font-sans">{row.replacementRate}</td>
                      <td className="p-1 border-r border-black font-sans font-bold">{row.replacementCost.toLocaleString("en-IN")}</td>
                      <td className="p-1 border-r border-black font-sans text-black">{row.depreciationAmount.toLocaleString("en-IN")}</td>
                      <td className="p-1 font-sans font-bold text-black">{row.netValue.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                  <tr className="border-b-0 font-bold bg-slate-50 text-black">
                    <td className="p-1 border-r border-black text-left" colSpan={5}>Total Net Building Structure Value :</td>
                    <td className="p-1 border-r border-black font-sans">
                      {valuation.valuationRows.reduce((acc, r) => acc + r.replacementCost, 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-1 border-r border-black font-sans text-black">
                      {valuation.valuationRows.reduce((acc, r) => acc + r.depreciationAmount, 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-1 font-sans text-xs">
                      {valuation.buildingNetStructuralValue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-4 mt-4 text-[10px]">
                {/* Part C */}
                <div className="border border-black">
                  <div className="bg-slate-50 font-bold p-1 border-b border-black uppercase text-center text-[9px]">
                    Part C- (Extra Items) (Amount in Rs.)
                  </div>
                  <table className="w-full text-[9px] border-collapse text-left">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black w-2/3">1. Portico :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.extraPortico.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">2. Ornamental front door :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.extraOrnamentalDoor.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">3. Sit out/ Verandah with steel grills :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.extraSitOut.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">4. Overhead water tank :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.extraOverheadTank.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">5. Extra steel/ collapsible gates :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.extraSteelGates.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-1 border-r border-black uppercase">Total Part C:</td>
                        <td className="p-1 font-mono text-right text-black">{valuation.extraItemsTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Part D */}
                <div className="border border-black">
                  <div className="bg-slate-50 font-bold p-1 border-b border-black uppercase text-center text-[9px]">
                    Part D- (Amenities) (Amount in Rs.)
                  </div>
                  <table className="w-full text-[8.5px] border-collapse text-left">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black w-2/3">1. Wardrobes :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityWardrobes.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">2. Glazed tiles :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityGlazedTiles.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">3. Extra sinks and bath tub :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityExtraSinks.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">4. Marble / ceramic tiles flooring :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityMarbleFlooring.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">5. Interior decorations :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityInteriorDecor.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">6. Architectural elevation works :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityArchElevation.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">7. Paneling works :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityPaneling.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">8. Aluminum works :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityAluminumWorks.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">9. Aluminum hand rails :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityAluminumRails.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-0.5 border-r border-black">10. False ceiling :</td>
                        <td className="p-0.5 font-mono font-bold text-right">{values.amenityFalseCeiling.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-0.5 border-r border-black uppercase">Total Part D:</td>
                        <td className="p-0.5 font-mono text-right text-black">{valuation.amenitiesTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] pt-2">
                <span className="font-bold">Part E- (Miscellaneous) & Part F- (Services) Tables detailed overleaf.</span>
              </div>
            </div>
          </div>

          {/* PAGE 5 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 5 of 11</div>

              <div className="grid grid-cols-2 gap-4 text-[10px]">
                {/* Part E */}
                <div className="border border-black">
                  <div className="bg-slate-50 font-bold p-1 border-b border-black uppercase text-center text-[9px]">
                    Part E- (Miscellaneous) (Amount in Rs.)
                  </div>
                  <table className="w-full text-[9px] border-collapse text-left">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black w-2/3">1. Separate toilet room :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.miscToiletRoom.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">2. Separate lumber room :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.miscLumberRoom.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">3. Separate water tank/ sump :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.miscWaterTank.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">4. Trees, gardening :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.miscTreesGardening.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-1 border-r border-black uppercase">Total Part E:</td>
                        <td className="p-1 font-mono text-right text-black">{valuation.miscTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Part F */}
                <div className="border border-black">
                  <div className="bg-slate-50 font-bold p-1 border-b border-black uppercase text-center text-[9px]">
                    Part F- (Services) (Amount in Rs.)
                  </div>
                  <table className="w-full text-[9px] border-collapse text-left">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black w-2/3">1. Water supply arrangements :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.serviceWaterSupply.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">2. Drainage arrangements :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.serviceDrainage.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">3. Compound wall :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.serviceCompoundWall.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">4. C. B. deposits, fittings etc. :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.serviceCbDeposits.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 border-r border-black">5. Pavement :</td>
                        <td className="p-1 font-mono font-bold text-right">{values.servicePavement.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-1 border-r border-black uppercase">Total Part F:</td>
                        <td className="p-1 font-mono text-right text-black">{valuation.servicesTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Abstract Table */}
              <div className="border border-black mt-3">
                <div className="bg-slate-900 text-white font-bold p-1 text-center text-[10px] uppercase">
                  Total abstract of the entire property
                </div>
                <table className="w-full text-[10px] border-collapse text-left">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-1.5 border-r border-black font-bold w-2/3 uppercase">Part- A Land Value :</td>
                      <td className="p-1.5 font-mono font-bold text-right text-xs">{valuation.landValue.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1.5 border-r border-black font-bold uppercase">Part- B Building (Structure + Extra C + D + E + F) :</td>
                      <td className="p-1.5 font-mono font-bold text-right text-xs">{valuation.buildingValue.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="border-b border-black bg-slate-50 font-black">
                      <td className="p-1.5 border-r border-black uppercase">Total property security value :</td>
                      <td className="p-1.5 font-mono text-right text-xs text-black">{valuation.totalPropertyValue.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="p-1.5 border-r border-black uppercase">Say :</td>
                      <td className="p-1.5 font-mono text-right text-sm text-black">{valuation.fairMarketValue.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Discussion block */}
              <div className="border border-black p-2 bg-slate-50 text-[9px] leading-relaxed">
                <p className="font-bold text-[9px] uppercase border-b pb-1 mb-1">Valuation approach, methodology & notes:</p>
                <p className="italic whitespace-pre-wrap font-sans text-slate-800">{values.valuationCalculationsText}</p>
              </div>

              <div className="text-[9px] space-y-1 font-bold">
                <p>• Photograph of owner/representative with property in background to be enclosed.</p>
                <p>• Screen shot of longitude/latitude and co-ordinates of property using GPS/Various Apps/Internet sites to be enclosed.</p>
                <p>• As a result of my appraisal and analysis, it is my considered opinion that the value of the above property in the prevailing condition with aforesaid specifications is as under:</p>
              </div>

              {/* Value Summary Table */}
              <table className="w-1/2 border border-black border-collapse text-left text-[10px] mx-auto">
                <thead>
                  <tr className="border-b border-black bg-slate-100 font-bold">
                    <td className="p-1 border-r border-black uppercase">Value Category</td>
                    <td className="p-1 text-right uppercase">Amount (₹)</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black font-bold">
                    <td className="p-1 border-r border-black">Fair Market value</td>
                    <td className="p-1 font-mono text-right text-black">{valuation.fairMarketValue.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="border-b border-black font-bold text-black bg-slate-50">
                    <td className="p-1 border-r border-black">Realizable value</td>
                    <td className="p-1 font-mono text-right">{valuation.realizableValue.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="font-bold text-black bg-slate-50">
                    <td className="p-1 border-r border-black">Distressed value</td>
                    <td className="p-1 font-mono text-right">{valuation.distressedValue.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>

              {/* Valuer Place / Signature */}
              <div className="flex justify-between items-end pt-4 text-[9px]">
                <div>
                  <p>Place : <span className="font-bold uppercase">{values.valuerPlace || "Lehra Gaga"}</span></p>
                  <p>Date : <span className="font-bold">{values.valuationDate}</span></p>
                </div>
                <div className="text-center w-56 border-t border-black border-dashed pt-1">
                  <p className="font-bold uppercase">Signature</p>
                  <p className="text-[8px] text-slate-500">(Name and Official seal of Approved Valuer)</p>
                  <p className="font-bold uppercase text-slate-800">{values.valuerName}</p>
                </div>
              </div>

              {/* Bank Certification Block with exact typo */}
              <div className="border border-black p-2 bg-slate-50/50 text-[9px] leading-snug">
                <p className="font-bold uppercase mb-1">CERTIFICATION BY BANK OFFICER (BRANCH IN-CHARGE / LOAN OFFICER)</p>
                <p className="italic">
                  It is certified that value given in the Valuation Report the Valuation Report dated <span className="font-bold">{values.valuationDate}</span> By the Bank’s approved valuer Mr./Ms./M/s <span className="font-bold uppercase">{values.valuerName}</span> .Is fare and realisable as per discreet and independent enquiries made during my/our visit.
                </p>
                <div className="flex justify-between pt-6 text-[8px] font-bold">
                  <div>
                    <p>Office/Manager Signature: _______________________</p>
                    <p className="mt-1">Name: <span className="uppercase">{values.bankOfficerName}</span></p>
                    <p>Date: {values.bankVerificationDate}</p>
                  </div>
                  <div className="text-right">
                    <p>Branch in charge Signature: _______________________</p>
                    <p className="mt-1">Name: <span className="uppercase">{values.bankManagerName}</span></p>
                    <p>Date: {values.bankVerificationDate}</p>
                  </div>
                </div>
              </div>

              {/* Enclosures 1 & 2 */}
              <div className="text-[9px] font-bold">
                <p>Encl:</p>
                <p className="pl-4">1. Declaration from the valuer</p>
                <p className="pl-4">2. Model code of conduct for valuer</p>
              </div>
            </div>
          </div>

          {/* PAGE 6 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[10.5px] leading-relaxed relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 6 of 11</div>
              
              <div className="text-[9px] font-bold pb-2 border-b">
                <p className="pl-4">3. Photograph of owner with the property in the background</p>
                <p className="pl-4">4. Screen shot (in hard copy) of Global Positioning System (GPS)/Various Applications (Apps)/Internet sites (eg Google earth)/etc</p>
                <p className="pl-4">5. Layout plan of the area in which the property is located</p>
                <p className="pl-4">6. Copy of Circle Rate list</p>
                <p className="pl-4">7. Any other relevant documents/extracts.</p>
              </div>

              <h2 className="text-center font-bold text-sm underline decoration-1 uppercase my-2">DECLARATION FROM VALUERS</h2>
              
              <p className="font-bold">I hereby declare that-</p>
              <div className="space-y-2 pl-4 text-[9.5px]">
                <p><span className="font-bold">a.</span> The information furnished in my valuation report dated <span className="font-bold">{values.valuationDate}</span> is true and correct to the best of my knowledge and belief and I have made an impartial and true valuation of the property.</p>
                <p><span className="font-bold">b.</span> I have no direct or indirect interest in the property valued;</p>
                <p><span className="font-bold">c.</span> I have personally inspected the property on <span className="font-bold">{values.inspectionDate}</span>. The work is not sub-contracted to any other valuer and carried out by myself.</p>
                <p><span className="font-bold">d.</span> I have not been convicted of any offence and sentenced to a term of Imprisonment;</p>
                <p><span className="font-bold">e.</span> I have not been found guilty of misconduct in my professional capacity.</p>
                <p><span className="font-bold">f.</span> I have read the Handbook on Policy, Standards and procedure for Real Estate Valuation, 2011 of the IBA and this report is in conformity to the “Standards” enshrined for valuation in the Part-B of the above handbook to the best of my ability.</p>
                <p><span className="font-bold">g.</span> I have read the International Valuation Standards (IVS) and the report submitted to the Bank for the respective asset class is in conformity to the “Standards” as enshrined for valuation in the IVS in “General Standards” and “Asset Standards” as applicable.</p>
                <p><span className="font-bold">h.</span> I abide by the Model Code of Conduct for empanelment of valuer in the Bank. (Annexure III-A signed copy of same to be taken and kept along with this declaration)</p>
                <p><span className="font-bold">i.</span> I am the proprietor / partner / authorized official of the firm / company, who is competent to sign this valuation report.</p>
                <p><span className="font-bold">j.</span> Further, I hereby provide the following information.</p>
              </div>

              <div className="flex justify-between items-end pt-2 text-[9px]">
                <div>
                  <p>Place : <span className="font-bold uppercase">{values.valuerPlace || "Lehra Gaga"}</span></p>
                  <p>Date : <span className="font-bold">{values.valuationDate}</span></p>
                </div>
                <div className="text-center w-56 border-t border-black border-dashed pt-1">
                  <p className="font-bold uppercase">Signature</p>
                  <p className="text-[8px] text-slate-500">(Name and Official seal of Approved Valuer)</p>
                  <p className="font-bold uppercase text-slate-800">{values.valuerName}</p>
                </div>
              </div>

              <table className="w-full border border-black border-collapse text-left text-[9px] mt-4">
                <thead>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="w-10 border-r border-black p-1 text-center">Sr. No.</td>
                    <td className="w-2/5 border-r border-black p-1">Particulars</td>
                    <td className="p-1">Valuer comment</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-center font-bold">1</td>
                    <td className="border-r border-black p-1">Background information of the asset being valued;</td>
                    <td className="p-1 font-sans text-[8.5px]">{values.commentsValuer?.[0]}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-center font-bold">2</td>
                    <td className="border-r border-black p-1">Purpose of valuation and appointing authority</td>
                    <td className="p-1 font-sans text-[8.5px]">{values.commentsValuer?.[1]}</td>
                  </tr>
                  <tr className="border-0">
                    <td className="border-r border-black p-1 text-center font-bold">3</td>
                    <td className="border-r border-black p-1">Identity of the valuer and any other experts involved in the valuation;</td>
                    <td className="p-1 font-sans text-[8.5px]">{values.commentsValuer?.[2]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGE 7 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[10.5px] leading-relaxed relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 7 of 11</div>

              <table className="w-full border border-black border-collapse text-left text-[9px]">
                <thead>
                  <tr className="border-b border-black bg-slate-50 font-bold">
                    <td className="w-10 border-r border-black p-1 text-center">Sr. No.</td>
                    <td className="w-2/5 border-r border-black p-1">Particulars</td>
                    <td className="p-1">Valuer comment</td>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sNo: 4, label: "Disclosure of valuer interest or conflict, if any;", val: values.commentsValuer?.[3] },
                    { sNo: 5, label: "Date of appointment, valuation date and date of report;", val: values.commentsValuer?.[4] },
                    { sNo: 6, label: "Inspections and/or investigations undertaken;", val: values.commentsValuer?.[5] },
                    { sNo: 7, label: "Nature and sources of the information used or relied upon;", val: values.commentsValuer?.[6] },
                    { sNo: 8, label: "Procedures adopted in carrying out the valuation and valuation standards followed;", val: values.commentsValuer?.[7] },
                    { sNo: 9, label: "Restrictions on use of the report, if any;", val: values.commentsValuer?.[8] },
                    { sNo: 10, label: "Major factors that were taken into account during the valuation;", val: values.commentsValuer?.[9] },
                    { sNo: 11, label: "Caveats, limitations and disclaimers to the extent they explain or elucidate the limitations faced by valuer, which shall not be for the purpose of limiting his responsibility for the valuation report.", val: values.commentsValuer?.[10] },
                  ].map((row) => (
                    <tr key={row.sNo} className="border-b border-black last:border-0">
                      <td className="border-r border-black p-1 text-center font-bold">{row.sNo}</td>
                      <td className="border-r border-black p-1">{row.label}</td>
                      <td className="p-1 font-sans text-[8.5px]">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-end pt-2 text-[9px]">
                <div>
                  <p>Place : <span className="font-bold uppercase">{values.valuerPlace || "Lehra Gaga"}</span></p>
                  <p>Date : <span className="font-bold">{values.valuationDate}</span></p>
                </div>
                <div className="text-center w-56 border-t border-black border-dashed pt-1">
                  <p className="font-bold uppercase">Signature</p>
                  <p className="text-[8px] text-slate-500">(Name and Official seal of Approved Valuer)</p>
                  <p className="font-bold uppercase text-slate-800">{values.valuerName}</p>
                </div>
              </div>

              <h2 className="text-center font-bold text-xs underline decoration-1 uppercase mt-4 mb-2">MODEL CODE OF CONDUCT FOR VALUERS</h2>
              <p className="text-center text-[9px] italic mb-2">{"{Adopted in line with Companies (Registered Valuers and Valuation Rules, 2017)}"}</p>
              
              <p className="font-bold text-[9.5px]">All valuers empaneled with bank shall strictly adhere to the following code of conduct:</p>
              
              <div className="space-y-2 text-[9px]">
                <p className="font-bold uppercase border-b pb-0.5 mt-1 text-black">Integrity and Fairness</p>
                <p><span className="font-bold">1.</span> A valuer shall, in the conduct of his/its business, follow high standards of integrity and fairness in all his/its dealings with his/its clients and other valuers.</p>
                <p><span className="font-bold">2.</span> A valuer shall maintain integrity by being honest, straightforward, and forthright in all professional relationships.</p>
                <p><span className="font-bold">3.</span> A valuer shall endeavor to ensure that he/it provides true and adequate information and shall not misrepresent any facts or situations.</p>
              </div>
            </div>
          </div>

          {/* PAGE 8 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[10.5px] leading-relaxed relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 8 of 11</div>

              <div className="space-y-2.5 text-[9.5px]">
                <p><span className="font-bold">4.</span> A valuer shall refrain from being involved in any action that would bring disrepute to the profession.</p>
                <p><span className="font-bold">5.</span> A valuer shall keep public interest foremost while delivering his services.</p>
                
                <p className="font-bold uppercase border-b pb-0.5 mt-3 text-black">Professional Competence and Due Care</p>
                <p><span className="font-bold">6.</span> A valuer shall render at all times high standards of service, exercise due diligence, ensure proper care and exercise independent professional judgment.</p>
                <p><span className="font-bold">7.</span> A valuer shall carry out professional services in accordance with the relevant technical and professional standards that may be specified from time to time.</p>
                <p><span className="font-bold">8.</span> A valuer shall continuously maintain professional knowledge and skill to provide competent professional service based on up-to-date developments in practice, prevailing regulations/guidelines and techniques.</p>
                <p><span className="font-bold">9.</span> In the preparation of a valuation report, the valuer shall not disclaim liability for his/its expertise or deny his/its duty of care, except to the extent that the assumptions are based on statements of fact provided by the company or its auditors or consultants or information available in public domain and not generated by the valuer.</p>
                <p><span className="font-bold">10.</span> A valuer shall not carry out any instruction of the client insofar as they are incompatible with the requirements of integrity, objectivity and independence.</p>
                <p><span className="font-bold">11.</span> A valuer shall clearly state to his client the services that he would be competent to provide and the services for which he would be relying on other valuers or professionals or for which the client can have a separate arrangement with other valuers.</p>
                
                <p className="font-bold uppercase border-b pb-0.5 mt-3 text-black">Independence and Disclosure of Interest</p>
                <p><span className="font-bold">12.</span> A valuer shall act with objectivity in his/its professional dealings by ensuring that his/its decisions are made without the presence of any bias, conflict of interest, coercion, or undue influence of any party, whether directly connected to the valuation assignment or not.</p>
                <p><span className="font-bold">13.</span> A valuer shall not take up an assignment if he/it or any of his/its relatives or associates is not independent in terms of association to the company.</p>
                <p><span className="font-bold">14.</span> A valuer shall maintain complete independence in his/its professional relationships and shall conduct the valuation independent of external influences.</p>
                <p><span className="font-bold">15.</span> A valuer shall wherever necessary disclose to the clients, possible sources of conflicts of duties and interests, while providing unbiased services.</p>
                <p><span className="font-bold">16.</span> A valuer shall not deal in securities of any subject company after any time when he/it first becomes aware of the possibility of his/its association with the valuation, and in accordance with the SEBI (Prohibition of Insider Trading) Regulations, 2015 or till the time the valuation report becomes public, whichever is earlier.</p>
                <p><span className="font-bold">17.</span> A valuer shall not indulge in “mandate snatching” or offering “convenience valuations” in order to cater to a company or client’s needs.</p>
                <p><span className="font-bold">18.</span> As an independent valuer, the valuer shall not charge success fee (Success fees may be defined as a compensation / incentive paid to any third party for successful closure of transaction. In this case, approval of credit proposals).</p>
                <p><span className="font-bold">19.</span> In any fairness opinion or independent expert opinion submitted by a valuer, if there has been a prior engagement in an unconnected transaction, the valuer shall declare the association with the company during the last five years.</p>
                
                <p className="font-bold uppercase border-b pb-0.5 mt-3 text-black">Confidentiality</p>
                <p><span className="font-bold">20.</span> A valuer shall not use or divulge to other clients or any other party any confidential information about the subject company, which has come to his/its knowledge without proper and specific authority or unless there is a legal or professional right or duty to disclose.</p>
              </div>
            </div>
          </div>

          {/* PAGE 9 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[10.5px] leading-relaxed relative flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 9 of 11</div>

              <div className="space-y-2.5 text-[9.5px]">
                <p className="font-bold uppercase border-b pb-0.5 mt-1 text-black">Information Management</p>
                <p><span className="font-bold">21.</span> A valuer shall ensure that he/ it maintains written contemporaneous records for any decision taken, the reasons for taking the decision, and the information and evidence in support of such decision. This shall be maintained so as to sufficiently enable a reasonable person to take a view on the appropriateness of his/its decisions and actions.</p>
                <p><span className="font-bold">22.</span> A valuer shall appear, co-operate and be available for inspections and investigations carried out by the authority, any person authorized by the authority, the registered valuer’s organization with which he/it is registered or any other statutory regulatory body.</p>
                <p><span className="font-bold">23.</span> A valuer shall provide all information and records as may be required by the authority, the Tribunal, Appellate Tribunal, the registered valuer’s organization with which he/it is registered, or any other statutory regulatory body.</p>
                <p><span className="font-bold">24.</span> A valuer while respecting the confidentiality of information acquired during the course of performing professional services, shall maintain proper working papers for a period of three years or such longer period as required in its contract for a specific valuation, for production before a regulatory authority or for a peer review.</p>
                
                <p className="font-bold uppercase border-b pb-0.5 mt-3 text-black">Gifts and hospitality</p>
                <p><span className="font-bold">25.</span> A valuer or his/its relative shall not accept gifts or hospitality which undermines or affects his independence as a valuer.<br /><span className="italic">Explanation:</span> For the purposes of this code the term ‘relative’ shall have the same meaning as defined in clause (77) of Section 2 of the Companies Act, 2013.</p>
                <p><span className="font-bold">26.</span> A valuer shall not offer gifts or hospitality or a financial or any other advantage to a public servant or any other person with a view to obtain or retain work for himself/ itself, or to obtain or retain an advantage in the conduct of profession for himself/ itself.</p>
                
                <p className="font-bold uppercase border-b pb-0.5 mt-3 text-black">Remuneration and Costs</p>
                <p><span className="font-bold">27.</span> A valuer shall provide services for remuneration which is charged in a transparent manner, is a reasonable reflection of the work necessarily and properly undertaken, and is not inconsistent with the applicable rules.</p>
                <p><span className="font-bold">28.</span> A valuer shall not accept any fees or charges other than those which are disclosed in a written contract with the person to whom he would be rendering service.</p>
                
                <p className="font-bold uppercase border-b pb-0.5 mt-3 text-black">Occupation, employability and restrictions</p>
                <p><span className="font-bold">29.</span> A valuer shall refrain from accepting too many assignments, if he/it is unlikely to be able to devote adequate time to each of his/ its assignments.</p>
                <p><span className="font-bold">30.</span> A valuer shall not conduct business which in the opinion of the authority or the registered valuer organization discredits the profession.</p>
              </div>

              <div className="flex justify-between items-end pt-12 text-[9px]">
                <div>
                  <p>Place : <span className="font-bold uppercase">{values.valuerPlace || "Lehra Gaga"}</span></p>
                  <p>Date : <span className="font-bold">{values.valuationDate}</span></p>
                </div>
                <div className="text-center w-56 border-t border-black border-dashed pt-1">
                  <p className="font-bold uppercase">Signature</p>
                  <p className="text-[8px] text-slate-500">(Name and Official seal of Approved Valuer)</p>
                  <p className="font-bold uppercase text-slate-800">{values.valuerName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 10 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 10 of 11</div>

              <h2 className="text-center font-bold text-sm uppercase mb-1">Google Map of property</h2>
              <p className="text-center italic text-slate-600 border-b pb-2">is Situated at <span className="font-bold uppercase">{values.postalAddress}</span></p>
              
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl my-6 min-h-[400px]">
                {values.gmapsScreenshot ? (
                  <img src={values.gmapsScreenshot} alt="Google Maps Route" className="max-h-[500px] max-w-full object-contain rounded shadow-md border" />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <FileText className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p className="font-mono text-xs">Google Maps Screenshot Annexure Frame</p>
                    <p className="text-[10px] mt-1 italic">[Upload screenshot in Step 8 to render here]</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs font-bold font-mono border-t pt-4">
                <span>Plot Area :- {values.plotArea} Sq Yards</span>
                <span>Covered Area :- {values.coveredArea} Sq Ft</span>
              </div>
            </div>
          </div>

          {/* PAGE 11 */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl font-serif text-[11px] leading-normal relative flex flex-col justify-between select-none">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-right text-[10px] font-bold text-slate-500">Page 11 of 11</div>

              <h2 className="text-center font-bold text-sm uppercase mb-1">Photograph of property</h2>
              <p className="text-center italic text-slate-600 border-b pb-2">is Situated at <span className="font-bold uppercase">{values.postalAddress}</span></p>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 min-h-[400px]">
                {/* Photo 1: Front Elevation */}
                <div className="border border-dashed border-slate-300 rounded-xl bg-slate-50 p-4 flex flex-col items-center justify-center text-center">
                  <p className="font-bold text-xs uppercase mb-2">1. Front Elevation View</p>
                  {values.photoFront ? (
                    <img src={values.photoFront} alt="Property Front Elevation" className="max-h-[200px] object-contain rounded border shadow" />
                  ) : (
                    <div className="text-slate-400">
                      <FileText className="h-10 w-10 mx-auto mb-1 opacity-50" />
                      <p className="text-[10px] italic">[Upload photo in Step 8]</p>
                    </div>
                  )}
                </div>

                {/* Photo 2: Interior View */}
                <div className="border border-dashed border-slate-300 rounded-xl bg-slate-50 p-4 flex flex-col items-center justify-center text-center">
                  <p className="font-bold text-xs uppercase mb-2">2. Interior View / Lobby</p>
                  {values.photoInterior ? (
                    <img src={values.photoInterior} alt="Property Interior View" className="max-h-[200px] object-contain rounded border shadow" />
                  ) : (
                    <div className="text-slate-400">
                      <FileText className="h-10 w-10 mx-auto mb-1 opacity-50" />
                      <p className="text-[10px] italic">[Upload photo in Step 8]</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold font-mono border-t pt-4">
                <span>Plot Area :- {values.plotArea} Sq Yards</span>
                <span>Covered Area :- {values.coveredArea} Sq Ft</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
