import * as React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { calculateValuation, formatIndianCurrency } from "@/lib/valuation-math";
import { ValuationFormValues } from "@/lib/form-schema";

// Register standard fonts
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    paddingHorizontal: 40,
    paddingVertical: 35,
    backgroundColor: "#ffffff",
    color: "#000000",
    lineHeight: 1.3,
  },
  pageNumber: {
    fontSize: 8,
    textAlign: "right",
    color: "#555555",
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerBlock: {
    marginBottom: 10,
  },
  toText: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  toTextIndent: {
    fontWeight: "bold",
    paddingLeft: 15,
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  sectionSubTitle: {
    fontSize: 8,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 8,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableColIndex: {
    width: "6%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    textAlign: "center",
    padding: 3,
    fontWeight: "bold",
  },
  tableColLabel: {
    width: "44%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    padding: 3,
  },
  tableColValue: {
    width: "50%",
    padding: 3,
    fontWeight: "bold",
  },
  tableColValuePlain: {
    width: "50%",
    padding: 3,
  },
  subTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  subTableCol: {
    padding: 3,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  subTableColLast: {
    padding: 3,
    fontSize: 8,
  },
  // Split boundaries/dimensions columns
  sideCol: { width: "25%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, fontWeight: "bold" },
  deedCol: { width: "25%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 },
  deed2Col: { width: "25%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 },
  siteCol: { width: "25%", padding: 3 },
  // Details of Valuation columns
  detColPart: { width: "20%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, fontWeight: "bold" },
  detColPlinth: { width: "11%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center" },
  detColAge: { width: "11%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center" },
  detColDepPct: { width: "11%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center" },
  detColRate: { width: "11%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center" },
  detColCost: { width: "12%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "right" },
  detColDepAmt: { width: "12%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "right" },
  detColNet: { width: "12%", padding: 3, textAlign: "right" },

  // Signatures
  signBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 15,
  },
  signLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderStyle: "dashed",
    textAlign: "center",
    paddingTop: 3,
    fontSize: 8,
  },
  bankCertBlock: {
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#f9f9f9",
    padding: 8,
    marginTop: 12,
  },
  bankCertTitle: {
    fontWeight: "bold",
    fontSize: 8,
    marginBottom: 4,
  },
  bankCertText: {
    fontStyle: "italic",
    fontSize: 8,
    lineHeight: 1.4,
  },
  bankSignRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    fontSize: 7,
  },
  charSNo: { width: "8%", borderRightWidth: 1, borderRightColor: "#000000", textAlign: "center", padding: 3, fontWeight: "bold" },
  charLabel: { width: "42%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 },
  charVal: { width: "50%", padding: 3 },
  
  // Floor specs
  specColSNo: { width: "8%", borderRightWidth: 1, borderRightColor: "#000000", textAlign: "center", padding: 2 },
  specColDesc: { width: "32%", borderRightWidth: 1, borderRightColor: "#000000", padding: 2, fontWeight: "bold" },
  specColG: { width: "30%", borderRightWidth: 1, borderRightColor: "#000000", padding: 2 },
  specColO: { width: "30%", padding: 2 },

  // Image styles
  imageContainer: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    padding: 10,
  },
  img: {
    maxHeight: 320,
    maxWidth: "100%",
    objectFit: "contain",
  },
  annexureFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 8,
    fontSize: 9,
    fontWeight: "bold",
  },
  ethicsHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 2,
    marginTop: 10,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  ethicsRule: {
    fontSize: 8.5,
    marginBottom: 6,
    paddingLeft: 10,
  },
  pageFooter: {
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingTop: 5,
    fontSize: 8,
    color: "#777777",
    textAlign: "center",
  }
});

export function PdfReport({ values }: { values: ValuationFormValues }) {
  const valuation = calculateValuation(values);
  const ownersList = values.owners || [];
  const primaryOwner = ownersList[0] || { ownerName: "", fatherHusbandName: "", mobileNumber: "", address: "" };

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 1 of 11</Text>
            
            <View style={styles.headerBlock}>
              <Text style={styles.toText}>To</Text>
              <Text style={styles.toTextIndent}>The Manager,</Text>
              <Text style={styles.toTextIndent}>Punjab & Sind Bank</Text>
              <Text style={styles.toTextIndent}>BRANCH: <Text style={{ textDecoration: "underline" }}>{values.branchName}</Text></Text>
            </View>

            <Text style={styles.pageTitle}>GENERAL</Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>1.</Text>
                <Text style={styles.tableColLabel}>Purpose for which the valuation is made : Bank Purpose</Text>
                <Text style={styles.tableColValue}>{values.purposeOfValuation}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>2.</Text>
                <Text style={styles.tableColLabel}>a) Date of inspection :{"\n"}b) Date on which the valuation is Made :</Text>
                <Text style={styles.tableColValue}>a) {values.inspectionDate}{"\n"}b) {values.valuationDate}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>3.</Text>
                <Text style={styles.tableColLabel}>List of documents produced for perusal</Text>
                <Text style={[styles.tableColValuePlain, { fontSize: 8 }]}>{values.perusalDocuments}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>4.</Text>
                <Text style={styles.tableColLabel}>Name of the owner(s) and his / their address(es) with Phone no. (details of share of each owner in case of joint ownership)</Text>
                <Text style={[styles.tableColValuePlain, { fontSize: 8 }]}>
                  {ownersList.map((o) => `${o.ownerName} (S/o, W/o ${o.fatherHusbandName}), Share: ${o.ownershipShare}, Ph: ${o.mobileNumber}, Addr: ${o.address}`).join("\n")}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>5.</Text>
                <Text style={styles.tableColLabel}>Brief description of the property (Including leasehold / freehold etc)</Text>
                <Text style={[styles.tableColValuePlain, { fontSize: 8 }]}>{values.propertyDescription}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>6.</Text>
                <Text style={styles.tableColLabel}>Location of property{"\n"}a) Plot No. / Survey No. :{"\n"}b) Door No. :{"\n"}c) T. S. No. / Village :{"\n"}d) Ward / Taluka :{"\n"}e) Mandal / District :</Text>
                <Text style={styles.tableColValue}>{"\n"}a) {values.plotNumber} / {values.surveyNumber}{"\n"}b) {values.doorNumber}{"\n"}c) {values.village}{"\n"}d) {values.taluka}{"\n"}e) {values.district}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>7.</Text>
                <Text style={styles.tableColLabel}>Postal address of the property :</Text>
                <Text style={[styles.tableColValuePlain, { fontSize: 8 }]}>{values.postalAddress}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>8.</Text>
                <Text style={styles.tableColLabel}>City / Town :{"\n"}Residential Area :{"\n"}Commercial Area :{"\n"}Industrial Area :</Text>
                <Text style={styles.tableColValue}>
                  {values.village}{"\n"}
                  {values.propertyType === "Residential" ? "YES" : "NO"}{"\n"}
                  {values.propertyType === "Commercial" ? "YES" : "NO"}{"\n"}
                  {values.propertyType === "Industrial" ? "YES" : "NO"}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>9.</Text>
                <Text style={styles.tableColLabel}>Classification of the area{"\n"}1) High / Middle / Poor :{"\n"}2) Metro / Urban / Semi Urban / Rural :</Text>
                <Text style={styles.tableColValue}>{"\n"}1) {values.areaClassification}{"\n"}2) {values.areaType}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>10.</Text>
                <Text style={styles.tableColLabel}>Coming under Corporation limit / Village Panchayat / Municipality :</Text>
                <Text style={styles.tableColValue}>{values.municipalityType}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>11.</Text>
                <Text style={styles.tableColLabel}>Whether covered under any State / Central Govt. enactments (e.g. Urban Land Ceiling Act) or notified under agency area / scheduled area / cantonment area :</Text>
                <Text style={[styles.tableColValuePlain, { fontSize: 8 }]}>{values.govtEnactments}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>12.</Text>
                <Text style={styles.tableColLabel}>In case it is an agricultural land, any conversion to house site plots is contemplated :</Text>
                <Text style={[styles.tableColValuePlain, { fontSize: 8 }]}>{values.agriculturalConversion}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.tableColIndex}>13.</Text>
                <Text style={styles.tableColLabel}>Boundaries of the property</Text>
                <View style={{ width: "50%", flexDirection: "column" }}>
                  <View style={styles.subTableHeader}>
                    <Text style={[styles.subTableCol, { width: "24%" }]}>Side</Text>
                    <Text style={[styles.subTableCol, { width: "38%" }]}>Deed 1</Text>
                    <Text style={[styles.subTableCol, { width: "38%" }]}>Deed 2</Text>
                    <Text style={[styles.subTableColLast, { width: "38%" }]}>Site</Text>
                  </View>
                  <View style={{ flexDirection: "row", fontSize: 7 }}>
                    <Text style={[styles.subTableCol, { width: "24%", fontWeight: "bold" }]}>North :</Text>
                    <Text style={[styles.subTableCol, { width: "38%" }]}>{values.boundaryNorthDeed}</Text>
                    <Text style={[styles.subTableCol, { width: "38%" }]}>{values.boundaryNorthDeed2}</Text>
                    <Text style={[styles.subTableColLast, { width: "38%" }]}>{values.boundaryNorthSite}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 2 of 11</Text>
            
            {/* South, East, West boundaries split */}
            <View style={[styles.table, { marginBottom: 10 }]}>
              <View style={styles.subTableHeader}>
                <Text style={[styles.subTableCol, { width: "20%" }]}>Side</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>As per Sale Deed 1</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>As per Sale Deed 2</Text>
                <Text style={[styles.subTableColLast, { width: "20%" }]}>As per Site</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "20%", fontWeight: "bold" }]}>South :</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>{values.boundarySouthDeed}</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>{values.boundarySouthDeed2}</Text>
                <Text style={[styles.subTableColLast, { width: "20%" }]}>{values.boundarySouthSite}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "20%", fontWeight: "bold" }]}>East :</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>{values.boundaryEastDeed}</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>{values.boundaryEastDeed2}</Text>
                <Text style={[styles.subTableColLast, { width: "20%" }]}>{values.boundaryEastSite}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.subTableCol, { width: "20%", fontWeight: "bold" }]}>West :</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>{values.boundaryWestDeed}</Text>
                <Text style={[styles.subTableCol, { width: "30%" }]}>{values.boundaryWestDeed2}</Text>
                <Text style={[styles.subTableColLast, { width: "20%" }]}>{values.boundaryWestSite}</Text>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>14.1</Text>
                <Text style={styles.tableColLabel}>Dimensions of the site</Text>
                <View style={{ width: "50%", flexDirection: "column" }}>
                  <View style={styles.subTableHeader}>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>Side</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>A: Deed 1</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>B: Deed 2</Text>
                    <Text style={[styles.subTableColLast, { width: "25%" }]}>C: Actuals</Text>
                  </View>
                  <View style={{ flexDirection: "row", fontSize: 7, borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                    <Text style={[styles.subTableCol, { width: "25%", fontWeight: "bold" }]}>North :</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionNorthDeed}</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionNorthDeed2}</Text>
                    <Text style={[styles.subTableColLast, { width: "25%" }]}>{values.dimensionNorthSite}</Text>
                  </View>
                  <View style={{ flexDirection: "row", fontSize: 7, borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                    <Text style={[styles.subTableCol, { width: "25%", fontWeight: "bold" }]}>South :</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionSouthDeed}</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionSouthDeed2}</Text>
                    <Text style={[styles.subTableColLast, { width: "25%" }]}>{values.dimensionSouthSite}</Text>
                  </View>
                  <View style={{ flexDirection: "row", fontSize: 7, borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                    <Text style={[styles.subTableCol, { width: "25%", fontWeight: "bold" }]}>East :</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionEastDeed}</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionEastDeed2}</Text>
                    <Text style={[styles.subTableColLast, { width: "25%" }]}>{values.dimensionEastSite}</Text>
                  </View>
                  <View style={{ flexDirection: "row", fontSize: 7 }}>
                    <Text style={[styles.subTableCol, { width: "25%", fontWeight: "bold" }]}>West :</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionWestDeed}</Text>
                    <Text style={[styles.subTableCol, { width: "25%" }]}>{values.dimensionWestDeed2}</Text>
                    <Text style={[styles.subTableColLast, { width: "25%" }]}>{values.dimensionWestSite}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>14.2</Text>
                <Text style={styles.tableColLabel}>Latitude, Longitude and Coordinates of the site :</Text>
                <Text style={[styles.tableColValue, { color: "#000000" }]}>Lat: {values.latitude} / Lng: {values.longitude}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>15.</Text>
                <Text style={styles.tableColLabel}>Extent of the site :</Text>
                <Text style={styles.tableColValue}>{values.extentSite}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>16.</Text>
                <Text style={styles.tableColLabel}>Extent of the site considered for valuation (least of deed vs actual) :</Text>
                <Text style={styles.tableColValue}>{values.extentValuation}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.tableColIndex}>17.</Text>
                <Text style={styles.tableColLabel}>Whether occupied by owner / tenant? Rent received per month :</Text>
                <Text style={styles.tableColValuePlain}>{values.occupancyDetails}</Text>
              </View>
            </View>

            <Text style={[styles.pageTitle, { marginTop: 10, marginBottom: 5 }]}>II. CHARACTERISTICS OF THE SITE</Text>
            
            <View style={styles.table}>
              <View style={styles.subTableHeader}>
                <Text style={styles.charSNo}>S.No</Text>
                <Text style={styles.charLabel}>Characteristics Parameter</Text>
                <Text style={styles.charVal}>Observation / Specification Status</Text>
              </View>
              {[
                { sNo: 1, label: "Classification of locality", val: values.charLocality },
                { sNo: 2, label: "Development of surrounding areas", val: values.charDevelopment },
                { sNo: 3, label: "Possibility of frequent flooding / sub-merging", val: values.charFlooding },
                { sNo: 4, label: "Feasibility to Civic amenities (schools, hospital, market)", val: values.charCivicAmenities },
                { sNo: 5, label: "Level of land with topographical conditions", val: values.charLandLevel },
                { sNo: 6, label: "Shape of land", val: values.charLandShape },
                { sNo: 7, label: "Type of use to which it can be put", val: values.charTypeUse },
                { sNo: 8, label: "Any usage restriction", val: values.charUsageRestriction },
                { sNo: 9, label: "Is plot in town planning approved layout?", val: values.charTownPlanning },
                { sNo: 10, label: "Corner plot or intermittent plot?", val: values.charCornerPlot },
                { sNo: 11, label: "Road facilities", val: values.charRoadFacilities },
                { sNo: 12, label: "Type of road available at present", val: values.charRoadType },
                { sNo: 13, label: "Width of road (below or above 20 ft)", val: values.charRoadWidth },
                { sNo: 14, label: "Is it a land-locked land?", val: values.charLandLocked },
                { sNo: 15, label: "Water potentiality", val: values.charWaterPotential },
                { sNo: 16, label: "Underground sewerage system", val: values.charSewerage },
                { sNo: 17, label: "Is power supply available at the site?", val: values.charPowerSupply },
                { sNo: 18, label: "Advantages of the site", val: values.charAdvantages },
                { sNo: 19, label: "Disadvantages of the site", val: values.charDisadvantages },
                { sNo: 20, label: "Special remarks (acquisition threat, CRZ, etc.)", val: values.charSpecialRemarks },
              ].map((row) => (
                <View style={[styles.tableRow, { borderBottomWidth: row.sNo === 20 ? 0 : 1 }]} key={row.sNo}>
                  <Text style={styles.charSNo}>{row.sNo}.</Text>
                  <Text style={styles.charLabel}>{row.label}</Text>
                  <Text style={[styles.charVal, { fontWeight: "bold", textTransform: "uppercase" }]}>{row.val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 3 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 3 of 11</Text>
            
            <Text style={styles.pageTitle}>Part – A (Valuation of land)</Text>
            
            <View style={[styles.table, { marginBottom: 12 }]}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>1.</Text>
                <Text style={styles.tableColLabel}>Size of plot :{"\n"}North & South :{"\n"}East & West :</Text>
                <Text style={styles.tableColValuePlain}>{"\n"}North: {values.dimensionNorthDeed} / South: {values.dimensionSouthDeed}{"\n"}East: {values.dimensionEastDeed} / West: {values.dimensionWestDeed}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>2.</Text>
                <Text style={styles.tableColLabel}>Total extent of the plot :</Text>
                <Text style={styles.tableColValue}>{values.plotArea} Sq Yards</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>3.</Text>
                <Text style={styles.tableColLabel}>Prevailing market rate (two recent sales records) :</Text>
                <Text style={styles.tableColValue}>{formatIndianCurrency(values.marketRate)} / Sq Yard</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>4.</Text>
                <Text style={styles.tableColLabel}>Guideline rate obtained from Registrar’s Office :</Text>
                <Text style={styles.tableColValue}>{formatIndianCurrency(values.guidelineRate)} / Sq Yard</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>5.</Text>
                <Text style={styles.tableColLabel}>Assessed / adopted rate of valuation :</Text>
                <Text style={[styles.tableColValue, { color: "#000000" }]}>{formatIndianCurrency(values.marketRate)} / Sq Yard</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.tableColIndex}>6.</Text>
                <Text style={[styles.tableColLabel, { fontWeight: "bold" }]}>Estimated value of land :</Text>
                <Text style={[styles.tableColValue, { fontSize: 10, color: "#000000" }]}>{formatIndianCurrency(valuation.landValue)}</Text>
              </View>
            </View>

            <Text style={styles.pageTitle}>Part – B (Valuation of Building)</Text>
            
            <View style={[styles.table, { marginBottom: 10 }]}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}>1.</Text>
                <Text style={[styles.tableColLabel, { fontWeight: "bold", width: "94%" }]}>Technical details of the building :</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>a) Type of Building (Residential / Commercial / Industrial) :</Text>
                <Text style={styles.tableColValue}>{values.propertyType}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>b) Type of construction (Load bearing / RCC / Steel Framed) :</Text>
                <Text style={styles.tableColValue}>{values.constructionType}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>c) Year of construction :</Text>
                <Text style={styles.tableColValue}>{values.yearOfConstruction}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>d) Number of floors and height of each floor including basement :</Text>
                <Text style={styles.tableColValue}>{values.numberOfFloors} Floors (Height: ~10 Ft)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>e) Plinth area floor-wise :</Text>
                <Text style={styles.tableColValue}>{values.plinthArea}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>f) Condition of building (Exterior / Interior) :</Text>
                <Text style={styles.tableColValue}>Exterior: {values.conditionExterior} / Interior: {values.conditionInterior}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>g) Date of issue and validity of layout approved plan :</Text>
                <Text style={styles.tableColValuePlain}>{values.layoutApprovalDateValidity}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>h) Approved map plan issuing authority :</Text>
                <Text style={styles.tableColValue}>{values.layoutApprovalAuthority}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>i) Genuineness of approved plan verified? :</Text>
                <Text style={styles.tableColValue}>{values.layoutApprovalGenuineness}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.tableColIndex}></Text>
                <Text style={styles.tableColLabel}>j) Other approved plan comments :</Text>
                <Text style={styles.tableColValuePlain}>{values.layoutApprovalComments}</Text>
              </View>
            </View>

            <Text style={{ fontWeight: "bold", fontSize: 8.5, marginBottom: 4, textTransform: "uppercase" }}>Specifications of construction (Floor-wise) in respect of :</Text>
            
            <View style={styles.table}>
              <View style={styles.subTableHeader}>
                <Text style={styles.specColSNo}>S.No</Text>
                <Text style={styles.specColDesc}>Description</Text>
                <Text style={styles.specColG}>Ground floor</Text>
                <Text style={styles.specColO}>Other floors</Text>
              </View>
              {[
                { sNo: 1, desc: "Foundation", g: values.specFoundationGround, o: values.specFoundationOther },
                { sNo: 2, desc: "Basement", g: values.specBasementGround, o: values.specBasementOther },
                { sNo: 3, desc: "Superstructure", g: values.specSuperstructureGround, o: values.specSuperstructureOther },
                { sNo: 4, desc: "Joinery / Doors & Windows (shutters, timber specie)", g: values.specJoineryGround, o: values.specJoineryOther },
                { sNo: 5, desc: "RCC works", g: values.specRccGround, o: values.specRccOther },
                { sNo: 6, desc: "Plastering", g: values.specPlasteringGround, o: values.specPlasteringOther },
                { sNo: 7, desc: "Flooring, Skirting, dadoing", g: values.specFlooringGround, o: values.specFlooringOther },
                { sNo: 8, desc: "Special finish as marble, granite, wooden paneling, grills", g: values.specSpecialFinishGround, o: values.specSpecialFinishOther },
                { sNo: 9, desc: "Roofing including weather proof course", g: values.specRoofingGround, o: values.specRoofingOther },
              ].map((row) => (
                <View style={[styles.tableRow, { borderBottomWidth: row.sNo === 9 ? 0 : 1 }]} key={row.sNo}>
                  <Text style={styles.specColSNo}>{row.sNo}.</Text>
                  <Text style={styles.specColDesc}>{row.desc}</Text>
                  <Text style={styles.specColG}>{row.g}</Text>
                  <Text style={styles.specColO}>{row.o}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.table, { marginTop: 6 }]}>
              <View style={styles.subTableHeader}>
                <Text style={styles.specColSNo}>S.No</Text>
                <Text style={styles.specColDesc}>Description</Text>
                <Text style={{ width: "60%", padding: 2, fontSize: 8 }}>Details of Ground & Other Floors Combined</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.specColSNo}>1.</Text>
                <Text style={styles.specColDesc}>Compound Wall :</Text>
                <Text style={{ width: "60%", padding: 2 }}>
                  Height: {values.compoundHeight} | Length: {values.compoundLength} | Type: {values.compoundType}
                </Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.specColSNo}>2.</Text>
                <Text style={styles.specColDesc}>Electrical Installation :</Text>
                <Text style={{ width: "60%", padding: 2 }}>
                  Wiring: {values.electricalWiring} | Fitting: {values.electricalFitting} | details: {values.electricalOther}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 4 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 4 of 11</Text>
            
            <View style={styles.table}>
              <View style={styles.subTableHeader}>
                <Text style={[styles.subTableCol, { width: "40%" }]}>Electrical Parameters</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>Observations</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>Number of Light Points :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.electricalLightPoints}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>Fan Point :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.electricalFanPoints}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>Spare plug points :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.electricalPlugs}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>Any other item :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.electricalOther}</Text>
              </View>
              <View style={styles.subTableHeader}>
                <Text style={[styles.subTableCol, { width: "40%" }]}>3. Plumbing Installation</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>Observations</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>a) No. of Water Closets and type :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.plumbingWaterClosets}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>b) No. of Wash basins :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.plumbingWashBasins}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>c) No of Urinals :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.plumbingUrinals}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>d) No. of Bath tubs :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.plumbingBathTubs}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>e) Water meter, taps, etc. :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.plumbingWaterMeter}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.subTableCol, { width: "40%", fontWeight: "bold" }]}>f) Any other fixtures :</Text>
                <Text style={[styles.subTableColLast, { width: "60%" }]}>{values.plumbingOther}</Text>
              </View>
            </View>

            <Text style={[styles.pageTitle, { marginTop: 15, marginBottom: 5 }]}>DETAILS OF VALUATION</Text>
            
            <View style={[styles.table, { marginBottom: 12 }]}>
              <View style={styles.subTableHeader}>
                <Text style={styles.detColPart}>Particular of item</Text>
                <Text style={styles.detColPlinth}>Plinth Area (sft)</Text>
                <Text style={styles.detColAge}>Rem Age (yrs)</Text>
                <Text style={styles.detColDepPct}>Dep %</Text>
                <Text style={styles.detColRate}>Repl Rate</Text>
                <Text style={styles.detColCost}>Repl Cost (₹)</Text>
                <Text style={styles.detColDepAmt}>Dep (₹)</Text>
                <Text style={styles.detColNet}>Net Value (₹)</Text>
              </View>
              {valuation.valuationRows.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.detColPart}>{row.particularOfItem}</Text>
                  <Text style={styles.detColPlinth}>{row.plinthArea}</Text>
                  <Text style={styles.detColAge}>{row.remainingAge}</Text>
                  <Text style={styles.detColDepPct}>{row.depreciationPct}%</Text>
                  <Text style={styles.detColRate}>{row.replacementRate}</Text>
                  <Text style={styles.detColCost}>{row.replacementCost.toLocaleString("en-IN")}</Text>
                  <Text style={styles.detColDepAmt}>{row.depreciationAmount.toLocaleString("en-IN")}</Text>
                  <Text style={[styles.detColNet, { fontWeight: "bold" }]}>{row.netValue.toLocaleString("en-IN")}</Text>
                </View>
              ))}
              <View style={[styles.tableRow, { borderBottomWidth: 0, fontWeight: "bold", backgroundColor: "#f9f9f9" }]}>
                <Text style={[styles.detColPart, { width: "53%", fontWeight: "bold" }]}>Total Net Building Structure Value :</Text>
                <Text style={[styles.detColCost, { width: "12%", fontWeight: "bold" }]}>
                  {valuation.valuationRows.reduce((acc, r) => acc + r.replacementCost, 0).toLocaleString("en-IN")}
                </Text>
                <Text style={[styles.detColDepAmt, { width: "12%", fontWeight: "bold" }]}>
                  {valuation.valuationRows.reduce((acc, r) => acc + r.depreciationAmount, 0).toLocaleString("en-IN")}
                </Text>
                <Text style={[styles.detColNet, { width: "23%", fontWeight: "bold", color: "#000000" }]}>
                  {valuation.buildingNetStructuralValue.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {/* Part C Extra */}
              <View style={{ width: "48%", borderWidth: 1, borderColor: "#000000" }}>
                <Text style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", fontSize: 7.5, padding: 3, textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                  Part C- (Extra Items) (Amount in Rs.)
                </Text>
                <View style={{ padding: 2, fontSize: 7.5 }}>
                  <Text>1. Portico : {values.extraPortico.toLocaleString("en-IN")}</Text>
                  <Text>2. Ornamental door : {values.extraOrnamentalDoor.toLocaleString("en-IN")}</Text>
                  <Text>3. Sit out / Verandah : {values.extraSitOut.toLocaleString("en-IN")}</Text>
                  <Text>4. Overhead water tank : {values.extraOverheadTank.toLocaleString("en-IN")}</Text>
                  <Text>5. Extra steel gates : {values.extraSteelGates.toLocaleString("en-IN")}</Text>
                  <Text style={{ fontWeight: "bold", borderTopWidth: 1, borderTopColor: "#cccccc", marginTop: 2, paddingTop: 2 }}>
                    Total Part C : {valuation.extraItemsTotal.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>

              {/* Part D Amenities */}
              <View style={{ width: "48%", borderWidth: 1, borderColor: "#000000" }}>
                <Text style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", fontSize: 7.5, padding: 3, textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                  Part D- (Amenities) (Amount in Rs.)
                </Text>
                <View style={{ padding: 2, fontSize: 7 }}>
                  <Text>1. Wardrobes : {values.amenityWardrobes.toLocaleString("en-IN")}</Text>
                  <Text>2. Glazed tiles : {values.amenityGlazedTiles.toLocaleString("en-IN")}</Text>
                  <Text>3. Extra sinks/bath tub : {values.amenityExtraSinks.toLocaleString("en-IN")}</Text>
                  <Text>4. Marble flooring : {values.amenityMarbleFlooring.toLocaleString("en-IN")}</Text>
                  <Text>5. Interior decoration : {values.amenityInteriorDecor.toLocaleString("en-IN")}</Text>
                  <Text>6. Arch elevation : {values.amenityArchElevation.toLocaleString("en-IN")}</Text>
                  <Text>7. Paneling works : {values.amenityPaneling.toLocaleString("en-IN")}</Text>
                  <Text>8. Aluminum works : {values.amenityAluminumWorks.toLocaleString("en-IN")}</Text>
                  <Text>9. Aluminum rails : {values.amenityAluminumRails.toLocaleString("en-IN")}</Text>
                  <Text>10. False ceiling : {values.amenityFalseCeiling.toLocaleString("en-IN")}</Text>
                  <Text style={{ fontWeight: "bold", borderTopWidth: 1, borderTopColor: "#cccccc", marginTop: 2, paddingTop: 2 }}>
                    Total Part D : {valuation.amenitiesTotal.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 5 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 5 of 11</Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              {/* Part E */}
              <View style={{ width: "48%", borderWidth: 1, borderColor: "#000000" }}>
                <Text style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", fontSize: 7.5, padding: 3, textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                  Part E- (Miscellaneous) (Amount in Rs.)
                </Text>
                <View style={{ padding: 2, fontSize: 7.5 }}>
                  <Text>1. Separate toilet room : {values.miscToiletRoom.toLocaleString("en-IN")}</Text>
                  <Text>2. Separate lumber room : {values.miscLumberRoom.toLocaleString("en-IN")}</Text>
                  <Text>3. Separate water tank : {values.miscWaterTank.toLocaleString("en-IN")}</Text>
                  <Text>4. Trees, gardening : {values.miscTreesGardening.toLocaleString("en-IN")}</Text>
                  <Text style={{ fontWeight: "bold", borderTopWidth: 1, borderTopColor: "#cccccc", marginTop: 4, paddingTop: 2 }}>
                    Total Part E : {valuation.miscTotal.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>

              {/* Part F */}
              <View style={{ width: "48%", borderWidth: 1, borderColor: "#000000" }}>
                <Text style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", fontSize: 7.5, padding: 3, textAlign: "center", borderBottomWidth: 1, borderBottomColor: "#000000" }}>
                  Part F- (Services) (Amount in Rs.)
                </Text>
                <View style={{ padding: 2, fontSize: 7.5 }}>
                  <Text>1. Water arrangements : {values.serviceWaterSupply.toLocaleString("en-IN")}</Text>
                  <Text>2. Drainage arrangements : {values.serviceDrainage.toLocaleString("en-IN")}</Text>
                  <Text>3. Compound wall cost : {values.serviceCompoundWall.toLocaleString("en-IN")}</Text>
                  <Text>4. C.B. deposits/fittings : {values.serviceCbDeposits.toLocaleString("en-IN")}</Text>
                  <Text>5. Pavement work : {values.servicePavement.toLocaleString("en-IN")}</Text>
                  <Text style={{ fontWeight: "bold", borderTopWidth: 1, borderTopColor: "#cccccc", marginTop: 4, paddingTop: 2 }}>
                    Total Part F : {valuation.servicesTotal.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={{ fontWeight: "bold", fontSize: 8.5, borderBottomWidth: 1, paddingBottom: 2, marginBottom: 4 }}>TOTAL ABSTRACT OF THE ENTIRE PROPERTY</Text>
            <View style={[styles.table, { marginBottom: 10 }]}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColLabel, { width: "65%", fontWeight: "bold" }]}>Part- A Land Value :</Text>
                <Text style={[styles.tableColValue, { width: "35%", textAlign: "right" }]}>{valuation.landValue.toLocaleString("en-IN")}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColLabel, { width: "65%", fontWeight: "bold" }]}>Part- B Building (Structure + Extras C, D, E, F) :</Text>
                <Text style={[styles.tableColValue, { width: "35%", textAlign: "right" }]}>{valuation.buildingValue.toLocaleString("en-IN")}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColLabel, { width: "65%", fontWeight: "bold" }]}>Total Property Security Value :</Text>
                <Text style={[styles.tableColValue, { width: "35%", textAlign: "right", color: "#000000" }]}>{valuation.totalPropertyValue.toLocaleString("en-IN")}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.tableColLabel, { width: "65%", fontWeight: "bold" }]}>Say :</Text>
                <Text style={[styles.tableColValue, { width: "35%", textAlign: "right", color: "#000000" }]}>{valuation.fairMarketValue.toLocaleString("en-IN")}</Text>
              </View>
            </View>

            <View style={{ borderWidth: 1, borderColor: "#000000", padding: 5, backgroundColor: "#fafafa", marginBottom: 8, fontSize: 8 }}>
              <Text style={{ fontWeight: "bold", borderBottomWidth: 1, borderBottomColor: "#dddddd", paddingBottom: 2, marginBottom: 2 }}>Valuer notes & calculations approach:</Text>
              <Text style={{ fontStyle: "italic" }}>{values.valuationCalculationsText}</Text>
            </View>

            <View style={{ fontSize: 7.5, marginBottom: 8 }}>
              <Text>• Photograph of owner/representative with property in background to be enclosed.</Text>
              <Text>• Screen shot of longitude/latitude and co-ordinates of property using GPS/Various Apps/Internet sites to be enclosed.</Text>
              <Text>• Value of the above property in the prevailing condition with aforesaid specifications is as under:</Text>
            </View>

            <View style={[styles.table, { width: "50%", alignSelf: "center", marginBottom: 12 }]}>
              <View style={styles.subTableHeader}>
                <Text style={{ width: "50%", padding: 3, fontWeight: "bold" }}>Value Category</Text>
                <Text style={{ width: "50%", padding: 3, fontWeight: "bold", textAlign: "right" }}>Amount (₹)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={{ width: "50%", padding: 3, fontWeight: "bold" }}>Fair Market value</Text>
                <Text style={{ width: "50%", padding: 3, textAlign: "right", fontWeight: "bold" }}>{valuation.fairMarketValue.toLocaleString("en-IN")}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={{ width: "50%", padding: 3, color: "#000000", fontWeight: "bold" }}>Realizable value</Text>
                <Text style={{ width: "50%", padding: 3, textAlign: "right", color: "#000000", fontWeight: "bold" }}>{valuation.realizableValue.toLocaleString("en-IN")}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={{ width: "50%", padding: 3, color: "#000000", fontWeight: "bold" }}>Distressed value</Text>
                <Text style={{ width: "50%", padding: 3, textAlign: "right", color: "#000000", fontWeight: "bold" }}>{valuation.distressedValue.toLocaleString("en-IN")}</Text>
              </View>
            </View>

            <View style={styles.signBlock}>
              <View>
                <Text>Place : {values.valuerPlace || "Lehra Gaga"}</Text>
                <Text>Date : {values.valuationDate}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.signLine} />
                <Text style={{ fontWeight: "bold" }}>Approved Valuer Sign & Seal</Text>
                <Text style={{ fontSize: 7, color: "#555555" }}>{values.valuerName}</Text>
              </View>
            </View>

            <View style={styles.bankCertBlock}>
              <Text style={styles.bankCertTitle}>CERTIFICATION BY BANK OFFICER (BRANCH IN-CHARGE / LOAN OFFICER)</Text>
              <Text style={styles.bankCertText}>
                It is certified that value given in the Valuation Report the Valuation Report dated {values.valuationDate} By the Bank’s approved valuer Mr./Ms./M/s {values.valuerName} .Is fare and realisable as per discreet and independent enquiries made during my/our visit.
              </Text>
              <View style={styles.bankSignRow}>
                <View>
                  <Text>Office/Manager Signature: _______________________</Text>
                  <Text>Name: {values.bankOfficerName}</Text>
                  <Text>Date: {values.bankVerificationDate}</Text>
                </View>
                <View style={{ textAlign: "right" }}>
                  <Text>Branch in charge Signature: _______________________</Text>
                  <Text>Name: {values.bankManagerName}</Text>
                  <Text>Date: {values.bankVerificationDate}</Text>
                </View>
              </View>
            </View>
            
            <View style={{ fontSize: 7, fontWeight: "bold", marginTop: 5 }}>
              <Text>Encl: 1. Declaration from valuer | 2. Model code of conduct</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 6 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 6 of 11</Text>
            
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#cccccc", paddingBottom: 4, marginBottom: 8, fontSize: 8, fontWeight: "bold" }}>
              <Text>3. Photograph of owner with the property in the background</Text>
              <Text>4. Screen shot (in hard copy) of GPS / Google earth / internet coordinates</Text>
              <Text>5. Layout plan of the area in which the property is located</Text>
              <Text>6. Copy of Circle Rate list</Text>
              <Text>7. Any other relevant documents/extracts.</Text>
            </View>

            <Text style={styles.pageTitle}>DECLARATION FROM VALUERS</Text>
            <Text style={{ fontWeight: "bold", fontSize: 9, marginBottom: 4 }}>I hereby declare that-</Text>
            
            <View style={{ paddingLeft: 10, marginBottom: 10 }}>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>a.</Text> The information furnished in my valuation report dated {values.valuationDate} is true and correct to the best of my knowledge and belief and I have made an impartial and true valuation of the property.</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>b.</Text> I have no direct or indirect interest in the property valued;</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>c.</Text> I have personally inspected the property on {values.inspectionDate}. The work is not sub-contracted to any other valuer and carried out by myself.</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>d.</Text> I have not been convicted of any offence and sentenced to a term of Imprisonment;</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>e.</Text> I have not been found guilty of misconduct in my professional capacity.</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>f.</Text> I have read the Handbook on Policy, Standards and procedure for Real Estate Valuation, 2011 of the IBA and this report is in conformity to the “Standards” enshrined for valuation in the Part-B of the above handbook to the best of my ability.</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>g.</Text> I have read the International Valuation Standards (IVS) and the report submitted to the Bank for the respective asset class is in conformity to the “Standards” as enshrined for valuation in the IVS in “General Standards” and “Asset Standards” as applicable.</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>h.</Text> I abide by the Model Code of Conduct for empanelment of valuer in the Bank. (Annexure III-A signed copy of same to be taken and kept along with this declaration)</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>i.</Text> I am the proprietor / partner / authorized official of the firm / company, who is competent to sign this valuation report.</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.35, marginBottom: 4 }}><Text style={{ fontWeight: "bold" }}>j.</Text> Further, I hereby provide the following information.</Text>
            </View>

            <View style={styles.signBlock}>
              <View>
                <Text>Place : {values.valuerPlace || "Lehra Gaga"}</Text>
                <Text>Date : {values.valuationDate}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.signLine} />
                <Text style={{ fontWeight: "bold" }}>Approved Valuer Sign & Seal</Text>
                <Text style={{ fontSize: 7, color: "#555555" }}>{values.valuerName}</Text>
              </View>
            </View>

            <View style={[styles.table, { marginTop: 12 }]}>
              <View style={styles.subTableHeader}>
                <Text style={{ width: "10%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center" }}>Sr. No.</Text>
                <Text style={{ width: "40%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 }}>Particulars</Text>
                <Text style={{ width: "50%", padding: 3 }}>Valuer comment</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={{ width: "10%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center", fontWeight: "bold" }}>1</Text>
                <Text style={{ width: "40%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 }}>Background information of the asset being valued;</Text>
                <Text style={{ width: "50%", padding: 3 }}>{values.commentsValuer?.[0]}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={{ width: "10%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center", fontWeight: "bold" }}>2</Text>
                <Text style={{ width: "40%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 }}>Purpose of valuation and appointing authority;</Text>
                <Text style={{ width: "50%", padding: 3 }}>{values.commentsValuer?.[1]}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={{ width: "10%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center", fontWeight: "bold" }}>3</Text>
                <Text style={{ width: "40%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 }}>Identity of the valuer and any other experts involved in the valuation;</Text>
                <Text style={{ width: "50%", padding: 3 }}>{values.commentsValuer?.[2]}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 7 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 7 of 11</Text>
            
            <View style={styles.table}>
              <View style={styles.subTableHeader}>
                <Text style={{ width: "10%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center" }}>Sr. No.</Text>
                <Text style={{ width: "40%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 }}>Particulars</Text>
                <Text style={{ width: "50%", padding: 3 }}>Valuer comment</Text>
              </View>
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
                <View style={[styles.tableRow, { borderBottomWidth: row.sNo === 11 ? 0 : 1 }]} key={row.sNo}>
                  <Text style={{ width: "10%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3, textAlign: "center", fontWeight: "bold" }}>{row.sNo}</Text>
                  <Text style={{ width: "40%", borderRightWidth: 1, borderRightColor: "#000000", padding: 3 }}>{row.label}</Text>
                  <Text style={{ width: "50%", padding: 3 }}>{row.val}</Text>
                </View>
              ))}
            </View>

            <View style={styles.signBlock}>
              <View>
                <Text>Place : {values.valuerPlace || "Lehra Gaga"}</Text>
                <Text>Date : {values.valuationDate}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.signLine} />
                <Text style={{ fontWeight: "bold" }}>Approved Valuer Sign & Seal</Text>
                <Text style={{ fontSize: 7, color: "#555555" }}>{values.valuerName}</Text>
              </View>
            </View>

            <Text style={[styles.pageTitle, { marginTop: 12, marginBottom: 2 }]}>MODEL CODE OF CONDUCT FOR VALUERS</Text>
            <Text style={styles.sectionSubTitle}>{"{Adopted in line with Companies (Registered Valuers and Valuation Rules, 2017)}"}</Text>
            
            <Text style={{ fontWeight: "bold", fontSize: 8.5, marginBottom: 5 }}>All valuers empaneled with bank shall strictly adhere to the following code of conduct:</Text>
            
            <Text style={styles.ethicsHeader}>Integrity and Fairness</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>1.</Text> A valuer shall, in the conduct of his/its business, follow high standards of integrity and fairness in all his/its dealings with his/its clients and other valuers.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>2.</Text> A valuer shall maintain integrity by being honest, straightforward, and forthright in all professional relationships.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>3.</Text> A valuer shall endeavor to ensure that he/it provides true and adequate information and shall not misrepresent any facts or situations.</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 8 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 8 of 11</Text>
            
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>4.</Text> A valuer shall refrain from being involved in any action that would bring disrepute to the profession.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>5.</Text> A valuer shall keep public interest foremost while delivering his services.</Text>
            
            <Text style={styles.ethicsHeader}>Professional Competence and Due Care</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>6.</Text> A valuer shall render at all times high standards of service, exercise due diligence, ensure proper care and exercise independent professional judgment.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>7.</Text> A valuer shall carry out professional services in accordance with the relevant technical and professional standards that may be specified from time to time.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>8.</Text> A valuer shall continuously maintain professional knowledge and skill to provide competent professional service based on up-to-date developments in practice, prevailing regulations/guidelines and techniques.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>9.</Text> In the preparation of a valuation report, the valuer shall not disclaim liability for his/its expertise or deny his/its duty of care, except to the extent that the assumptions are based on statements of fact provided by the company or its auditors or consultants or information available in public domain and not generated by the valuer.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>10.</Text> A valuer shall not carry out any instruction of the client insofar as they are incompatible with the requirements of integrity, objectivity and independence.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>11.</Text> A valuer shall clearly state to his client the services that he would be competent to provide and the services for which he would be relying on other valuers or professionals or for which the client can have a separate arrangement with other valuers.</Text>
            
            <Text style={styles.ethicsHeader}>Independence and Disclosure of Interest</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>12.</Text> A valuer shall act with objectivity in his/its professional dealings by ensuring that his/its decisions are made without the presence of any bias, conflict of interest, coercion, or undue influence of any party, whether directly connected to the valuation assignment or not.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>13.</Text> A valuer shall not take up an assignment if he/it or any of his/its relatives or associates is not independent in terms of association to the company.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>14.</Text> A valuer shall maintain complete independence in his/its professional relationships and shall conduct the valuation independent of external influences.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>15.</Text> A valuer shall wherever necessary disclose to the clients, possible sources of conflicts of duties and interests, while providing unbiased services.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>16.</Text> A valuer shall not deal in securities of any subject company after any time when he/it first becomes aware of the possibility of his/its association with the valuation, and in accordance with the SEBI Regulations, 2015 or till the time the valuation report becomes public, whichever is earlier.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>17.</Text> A valuer shall not indulge in “mandate snatching” or offering “convenience valuations” in order to cater to a company or client’s needs.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>18.</Text> As an independent valuer, the valuer shall not charge success fee.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>19.</Text> In any fairness opinion or independent expert opinion submitted by a valuer, if there has been a prior engagement in an unconnected transaction, the valuer shall declare the association with the company during the last five years.</Text>
            
            <Text style={styles.ethicsHeader}>Confidentiality</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>20.</Text> A valuer shall not use or divulge to other clients or any other party any confidential information about the subject company, which has come to his/its knowledge without proper and specific authority or unless there is a legal or professional right or duty to disclose.</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 9 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text style={styles.pageNumber}>Page 9 of 11</Text>
            
            <Text style={styles.ethicsHeader}>Information Management</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>21.</Text> A valuer shall ensure that he/ it maintains written contemporaneous records for any decision taken, the reasons for taking the decision, and the information and evidence in support of such decision. This shall be maintained so as to sufficiently enable a reasonable person to take a view on the appropriateness of his/its decisions and actions.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>22.</Text> A valuer shall appear, co-operate and be available for inspections and investigations carried out by the authority, any person authorized by the authority, the registered valuer’s organization with which he/it is registered or any other statutory regulatory body.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>23.</Text> A valuer shall provide all information and records as may be required by the authority, the Tribunal, Appellate Tribunal, the registered valuer’s organization with which he/it is registered, or any other statutory regulatory body.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>24.</Text> A valuer while respecting the confidentiality of information acquired during the course of performing professional services, shall maintain proper working papers for a period of three years or such longer period as required in its contract for a specific valuation, for production before a regulatory authority or for a peer review.</Text>
            
            <Text style={styles.ethicsHeader}>Gifts and hospitality</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>25.</Text> A valuer or his/its relative shall not accept gifts or hospitality which undermines or affects his independence as a valuer.{"\n"}Explanation. ─ For the purposes of this code the term ‘relative’ shall have the same meaning as defined in clause (77) of Section 2 of the Companies Act, 2013.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>26.</Text> A valuer shall not offer gifts or hospitality or a financial or any other advantage to a public servant or any other person with a view to obtain or retain work for himself/ itself, or to obtain or retain an advantage in the conduct of profession for himself/ itself.</Text>
            
            <Text style={styles.ethicsHeader}>Remuneration and Costs</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>27.</Text> A valuer shall provide services for remuneration which is charged in a transparent manner, is a reasonable reflection of the work necessarily and properly undertaken, and is not inconsistent with the applicable rules.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>28.</Text> A valuer shall not accept any fees or charges other than those which are disclosed in a written contract with the person to whom he would be rendering service.</Text>
            
            <Text style={styles.ethicsHeader}>Occupation, employability and restrictions</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>29.</Text> A valuer shall refrain from accepting too many assignments, if he/it is unlikely to be able to devote adequate time to each of his/ its assignments.</Text>
            <Text style={styles.ethicsRule}><Text style={{ fontWeight: "bold" }}>30.</Text> A valuer shall not conduct business which in the opinion of the authority or the registered valuer organization discredits the profession.</Text>

            <View style={styles.signBlock}>
              <View>
                <Text>Place : {values.valuerPlace || "Lehra Gaga"}</Text>
                <Text>Date : {values.valuationDate}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.signLine} />
                <Text style={{ fontWeight: "bold" }}>Approved Valuer Sign & Seal</Text>
                <Text style={{ fontSize: 7, color: "#555555" }}>{values.valuerName}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 10 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageNumber}>Page 10 of 11</Text>
            
            <Text style={styles.pageTitle}>Google Map of property</Text>
            <Text style={styles.sectionSubTitle}>is Situated at {values.postalAddress}</Text>

            <View style={styles.imageContainer}>
              {values.gmapsScreenshot ? (
                <Image src={values.gmapsScreenshot} style={styles.img} />
              ) : (
                <Text style={{ color: "#888888", fontSize: 9 }}>[Google Maps Satellite Route Annexure Frame]</Text>
              )}
            </View>

            <View style={styles.annexureFooter}>
              <Text>Plot Area :- {values.plotArea} Sq Yards</Text>
              <Text>Covered Area :- {values.coveredArea} Sq Ft</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 11 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageNumber}>Page 11 of 11</Text>
            
            <Text style={styles.pageTitle}>Photograph of property</Text>
            <Text style={styles.sectionSubTitle}>is Situated at {values.postalAddress}</Text>

            <View style={{ flexDirection: "row", flex: 1, gap: 15, marginVertical: 15 }}>
              <View style={[styles.imageContainer, { marginVertical: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 8, marginBottom: 5 }}>1. FRONT ELEVATION PHOTO</Text>
                {values.photoFront ? (
                  <Image src={values.photoFront} style={styles.img} />
                ) : (
                  <Text style={{ color: "#888888", fontSize: 8 }}>[No Elevation Image Uploaded]</Text>
                )}
              </View>

              <View style={[styles.imageContainer, { marginVertical: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 8, marginBottom: 5 }}>2. INTERIOR PHOTO</Text>
                {values.photoInterior ? (
                  <Image src={values.photoInterior} style={styles.img} />
                ) : (
                  <Text style={{ color: "#888888", fontSize: 8 }}>[No Interior Image Uploaded]</Text>
                )}
              </View>
            </View>

            <View style={styles.annexureFooter}>
              <Text>Plot Area :- {values.plotArea} Sq Yards</Text>
              <Text>Covered Area :- {values.coveredArea} Sq Ft</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
