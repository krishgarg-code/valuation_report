import * as React from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, MapPin, Sparkles, Upload, FileText, CheckCircle2, RefreshCw, Wand2, Compass } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { parseGmapsUrlOrCoords } from "@/lib/gmaps-parser";
import { calculateValuation, formatIndianCurrency } from "@/lib/valuation-math";
import { ValuationFormValues } from "@/lib/form-schema";
import { STATES, DISTRICTS_BY_STATE } from "@/lib/india-location-data";

// STEP 1: Bank Details & Documents
export function Step1BankDetails() {
  const { register, formState: { errors } } = useFormContext<ValuationFormValues>();
  
  return (
    <div className="space-y-4">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bankName">Lending Institution / Bank</Label>
          <Select
            id="bankName"
            {...register("bankName")}
            options={[
              { label: "Punjab & Sind Bank", value: "Punjab & Sind Bank" },
              { label: "State Bank of India (Coming Soon)", value: "State Bank of India" },
              { label: "HDFC Bank (Coming Soon)", value: "HDFC Bank" },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="branchName">Branch Name & Address</Label>
          <Input
            id="branchName"
            placeholder="e.g. Lehra Gaga Branch, Sangrur"
            {...register("branchName")}
          />
          {errors.branchName && (
            <p className="text-xs text-red-500">{errors.branchName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purposeOfValuation">Purpose of Valuation</Label>
          <Select
            id="purposeOfValuation"
            {...register("purposeOfValuation")}
            options={[
              { label: "Bank Purpose (Mortgage/LAP)", value: "Bank Purpose" },
              { label: "Housing / Construction Loan", value: "Housing Loan" },
              { label: "NPA Valuation", value: "NPA Valuation" },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inspectionDate">Date of Inspection</Label>
          <Input
            id="inspectionDate"
            type="date"
            {...register("inspectionDate")}
          />
          {errors.inspectionDate && (
            <p className="text-xs text-red-500">{errors.inspectionDate.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="valuationDate">Date of Report Valuation</Label>
          <Input
            id="valuationDate"
            type="date"
            {...register("valuationDate")}
          />
          {errors.valuationDate && (
            <p className="text-xs text-red-500">{errors.valuationDate.message}</p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="perusalDocuments">List of Documents Produced for Perusal (One per line)</Label>
          <Textarea
            id="perusalDocuments"
            rows={3}
            placeholder="e.g.&#10;1) Sale Deed No. 1024 dated 14/05/2013&#10;2) Approved Layout Plan"
            {...register("perusalDocuments")}
          />
        </div>
      </div>
    </div>
  );
}

// STEP 2: Owner Details
export function Step2OwnerDetails() {
  const { register, control, formState: { errors } } = useFormContext<ValuationFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end pb-3 border-b border-[#1c281a]/12 dark:border-slate-800 mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              ownerName: "",
              fatherHusbandName: "",
              mobileNumber: "",
              ownershipShare: "100%",
              address: "",
            })
          }
          className="flex items-center gap-1.5 text-xs"
        >
          <Plus className="h-4 w-4" /> Add Owner
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="border border-[#1c281a]/20 dark:border-slate-800 bg-[#fcfbfa] dark:bg-slate-900/30 rounded-none shadow-none">
            <CardContent className="p-6 relative">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="absolute right-3 top-3 text-[#1c281a]/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-none"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1c281a] mb-4">
                Owner #{index + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`owners.${index}.ownerName`}>Owner Name</Label>
                  <Input
                    id={`owners.${index}.ownerName`}
                    placeholder="Full Name"
                    {...register(`owners.${index}.ownerName` as const)}
                  />
                  {errors.owners?.[index]?.ownerName && (
                    <p className="text-xs text-red-500">{errors.owners[index]?.ownerName?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`owners.${index}.fatherHusbandName`}>Father's / Husband's Name</Label>
                  <Input
                    id={`owners.${index}.fatherHusbandName`}
                    placeholder="S/o or W/o Name"
                    {...register(`owners.${index}.fatherHusbandName` as const)}
                  />
                  {errors.owners?.[index]?.fatherHusbandName && (
                    <p className="text-xs text-red-500">{errors.owners[index]?.fatherHusbandName?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`owners.${index}.mobileNumber`}>Mobile Number</Label>
                  <Input
                    id={`owners.${index}.mobileNumber`}
                    placeholder="10-digit mobile"
                    {...register(`owners.${index}.mobileNumber` as const)}
                  />
                  {errors.owners?.[index]?.mobileNumber && (
                    <p className="text-xs text-red-500">{errors.owners[index]?.mobileNumber?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`owners.${index}.ownershipShare`}>Ownership Share</Label>
                  <Input
                    id={`owners.${index}.ownershipShare`}
                    placeholder="e.g. 100%, 50%"
                    {...register(`owners.${index}.ownershipShare` as const)}
                  />
                  {errors.owners?.[index]?.ownershipShare && (
                    <p className="text-xs text-red-500">{errors.owners[index]?.ownershipShare?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`owners.${index}.address`}>Residential Address</Label>
                  <Textarea
                    id={`owners.${index}.address`}
                    rows={2}
                    placeholder="Complete residential address of the owner"
                    {...register(`owners.${index}.address` as const)}
                  />
                  {errors.owners?.[index]?.address && (
                    <p className="text-xs text-red-500">{errors.owners[index]?.address?.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// STEP 3: Property Details
export function Step3PropertyDetails() {
  const { register, setValue, formState: { errors } } = useFormContext<ValuationFormValues>();
  
  // Google Maps state variables
  const [mapUrl, setMapUrl] = React.useState("");
  const [isLoadingGmaps, setIsLoadingGmaps] = React.useState(false);
  const [gmapsMessage, setGmapsMessage] = React.useState({ text: "", type: "" });

  // Pincode state variables
  const [isPincodeLoading, setIsPincodeLoading] = React.useState(false);
  const [pincodeError, setPincodeError] = React.useState("");

  // Dropdown manual toggles
  const [isManualState, setIsManualState] = React.useState(false);
  const [isManualDistrict, setIsManualDistrict] = React.useState(false);

  // Watch state and district for cascading dropdowns
  const selectedState = useWatch({ name: "state" });
  const selectedDistrict = useWatch({ name: "district" });
  const plotNumber = useWatch({ name: "plotNumber" });
  const village = useWatch({ name: "village" });
  const taluka = useWatch({ name: "taluka" });
  const pincode = useWatch({ name: "pincode" });

  const isStateInDropdown = STATES.includes(selectedState || "");
  const availableDistricts = selectedState ? (DISTRICTS_BY_STATE[selectedState] || []) : [];
  const isDistrictInDropdown = availableDistricts.includes(selectedDistrict || "");

  const showStateInput = isManualState || (selectedState && !isStateInDropdown);
  const showDistrictInput = isManualDistrict || (selectedDistrict && !isDistrictInDropdown);

  // Auto-Fetch GPS and Reverse Geocoding from Nominatim API
  const handleFetchGmapsDetails = async () => {
    setGmapsMessage({ text: "", type: "" });
    if (!mapUrl.trim()) {
      setGmapsMessage({ text: "Please paste a Google Maps URL first.", type: "error" });
      return;
    }
    setIsLoadingGmaps(true);
    try {
      const result = parseGmapsUrlOrCoords(mapUrl);
      if (!result.success) {
        setGmapsMessage({ text: result.message, type: "error" });
        return;
      }

      setValue("latitude", result.latitude, { shouldValidate: true });
      setValue("longitude", result.longitude, { shouldValidate: true });
      setValue("gmapsUrl", mapUrl, { shouldValidate: true });

      // Call Nominatim Reverse Geocoding API (using free OpenStreetMap endpoint)
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${result.latitude}&lon=${result.longitude}&accept-language=en`, {
        headers: {
          "User-Agent": "PunjabSindValuationReportApp/1.0"
        }
      });
      
      if (!res.ok) {
        setGmapsMessage({
          text: `Coordinates parsed (Lat: ${result.latitude}, Lng: ${result.longitude}), but address fetch failed: ${res.statusText}.`,
          type: "success"
        });
        return;
      }
      
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const stateName = addr.state || "";
        const districtName = addr.county || addr.state_district || addr.district || "";
        const cityName = addr.village || addr.town || addr.city || addr.suburb || addr.neighbourhood || "";
        const pcode = addr.postcode || "";
        const displayName = data.display_name || "";

        // Dynamically auto-fill fields if they exist
        if (stateName) {
          setValue("state", stateName, { shouldValidate: true });
          // If the fetched state is standard, turn off manual override
          if (STATES.includes(stateName)) setIsManualState(false);
        }
        if (districtName) {
          // Clean Nominatim "District" suffix if present
          const cleanDistrict = districtName.replace(/\s+District$/gi, "").trim();
          setValue("district", cleanDistrict, { shouldValidate: true });
          const relatedDistricts = DISTRICTS_BY_STATE[stateName] || [];
          if (relatedDistricts.includes(cleanDistrict)) setIsManualDistrict(false);
        }
        if (cityName) setValue("village", cityName, { shouldValidate: true });
        if (pcode) setValue("pincode", pcode, { shouldValidate: true });
        if (displayName) setValue("postalAddress", displayName, { shouldValidate: true });

        setGmapsMessage({
          text: `Successfully resolved details! Coordinates: ${result.latitude}, ${result.longitude}. Address fields auto-filled.`,
          type: "success"
        });
      } else {
        setGmapsMessage({
          text: `Coordinates parsed (Lat: ${result.latitude}, Lng: ${result.longitude}), but details could not be resolved from map data.`,
          type: "success"
        });
      }
    } catch (err: any) {
      console.error(err);
      setGmapsMessage({
        text: `Network issue: Coordinates auto-filled. Address lookup fell back to manual input.`,
        type: "success"
      });
    } finally {
      setIsLoadingGmaps(false);
    }
  };

  // Fetch location details from Pincode using api.postalpincode.in API
  const handleFetchPincodeDetails = async (code: string) => {
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      setPincodeError("Please enter a valid 6-digit number.");
      return;
    }
    setIsPincodeLoading(true);
    setPincodeError("");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const stateName = postOffice.State;
        const districtName = postOffice.District;
        const blockName = postOffice.Block !== "NA" ? postOffice.Block : postOffice.Name;

        setValue("state", stateName, { shouldValidate: true });
        if (STATES.includes(stateName)) setIsManualState(false);

        setValue("district", districtName, { shouldValidate: true });
        const relatedDistricts = DISTRICTS_BY_STATE[stateName] || [];
        if (relatedDistricts.includes(districtName)) setIsManualDistrict(false);

        // Fill village and taluka only if currently empty
        setValue("village", blockName, { shouldValidate: true });
        setValue("taluka", postOffice.Block !== "NA" ? postOffice.Block : (postOffice.Taluka || ""), { shouldValidate: true });
      } else {
        setPincodeError("No post office match found for this pincode.");
      }
    } catch (err: any) {
      console.error(err);
      setPincodeError("Failed to resolve pincode details. Enter manually.");
    } finally {
      setIsPincodeLoading(false);
    }
  };

  // Listen to pincode changes and auto-trigger on 6 digits
  const onPincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("pincode", val, { shouldValidate: true });
    if (val.length === 6) {
      handleFetchPincodeDetails(val);
    }
  };

  // Generate mailing address automatically to eliminate redundant typing
  const handleGenerateAddress = () => {
    const parts = [
      plotNumber ? plotNumber : "",
      village ? village : "",
      taluka ? "Tehsil: " + taluka : "",
      selectedDistrict ? "District: " + selectedDistrict : "",
      selectedState ? selectedState : "",
      pincode ? pincode : ""
    ].map(s => s.trim()).filter(Boolean);
    
    if (parts.length > 0) {
      setValue("postalAddress", parts.join(", "), { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-5">


      {/* Google Maps Auto-Fetch widget at the top */}
      <div className="mt-2 mb-6 border border-[#1c281a] rounded-none overflow-hidden shadow-sm">
        <div className="bg-[#ede9df] px-4 py-2.5 border-b border-[#1c281a] flex items-center gap-2">
          <Compass className="h-4 w-4 animate-spin-slow text-[#1c281a]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200">
            Intelligent Location Resolver
          </h4>
        </div>
        <div className="p-5 space-y-4 bg-[#ede9df]/10 dark:bg-slate-950">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="Paste Google Maps URL here (e.g. https://www.google.com/maps/place/...)"
              className="flex-1 rounded-none border-[#c8c5bc]"
            />
            <Button
              type="button"
              variant="default"
              disabled={isLoadingGmaps}
              onClick={handleFetchGmapsDetails}
              className="flex items-center justify-center gap-1.5 text-xs h-10 px-5 shrink-0 rounded-none bg-[#1c281a] hover:bg-[#2a3c27] text-white font-black tracking-widest uppercase border border-[#1c281a]"
            >
              {isLoadingGmaps ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Resolve Location
            </Button>
          </div>
          {gmapsMessage.text && (
            <div className={`text-xs font-medium px-2.5 py-1.5 rounded-none w-fit flex items-center gap-1.5 ${
              gmapsMessage.type === "success" 
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
                : "text-red-600 dark:text-red-400 bg-red-500/10"
            }`}>
              {gmapsMessage.type === "success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              {gmapsMessage.text}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select
            id="propertyType"
            {...register("propertyType")}
            options={[
              { label: "Residential Property", value: "Residential" },
              { label: "Commercial Property", value: "Commercial" },
              { label: "Industrial Property", value: "Industrial" },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ownershipType">Tenure / Ownership</Label>
          <Select
            id="ownershipType"
            {...register("ownershipType")}
            options={[
              { label: "Freehold", value: "Freehold" },
              { label: "Leasehold", value: "Leasehold" },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mortgageStatus">Mortgage Proposal</Label>
          <Input
            id="mortgageStatus"
            placeholder="e.g. Proposed to be mortgaged with Punjab & Sind Bank"
            {...register("mortgageStatus")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="plotNumber">Plot / Shop / House No.</Label>
          <Input
            id="plotNumber"
            placeholder="e.g. Plot No. 35"
            {...register("plotNumber")}
          />
          {errors.plotNumber && (
            <p className="text-xs text-red-500">{errors.plotNumber.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="surveyNumber">Khasra / Khata / Survey Number</Label>
          <Input
            id="surveyNumber"
            placeholder="e.g. Khata No. 450/41, Khasra No. 1245"
            {...register("surveyNumber")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="doorNumber">Municipal Door / Assessment Number</Label>
          <Input
            id="doorNumber"
            placeholder="e.g. MC Door No. 125-A"
            {...register("doorNumber")}
          />
        </div>

        {/* Pincode with Auto Fetch */}
        <div className="space-y-1.5">
          <Label htmlFor="pincode">Pincode</Label>
          <div className="relative">
            <Input
              id="pincode"
              maxLength={6}
              placeholder="6-digit Indian Pincode (e.g. 148031)"
              {...register("pincode")}
              onChange={onPincodeChange}
            />
            {isPincodeLoading && (
              <span className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center">
                <RefreshCw className="h-4 w-4 animate-spin text-[#1c281a]/70" />
              </span>
            )}
          </div>
          {pincodeError && <p className="text-xs text-red-500 font-medium">{pincodeError}</p>}
        </div>

        {/* State Selection with Dropdown / Manual Toggle */}
        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          {showStateInput ? (
            <div className="flex gap-2 items-center">
              <Input
                id="state"
                placeholder="e.g. Punjab"
                {...register("state")}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsManualState(false);
                  setValue("state", "Punjab", { shouldValidate: true });
                }}
                className="h-10 text-xs px-3.5 shrink-0"
              >
                Use List
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Select
                id="state"
                {...register("state")}
                options={STATES.map(s => ({ label: s, value: s }))}
                placeholder="Select State"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsManualState(true)}
                className="h-10 text-xs px-3.5 shrink-0"
              >
                Type
              </Button>
            </div>
          )}
        </div>

        {/* District Selection with Dropdown / Manual Toggle */}
        <div className="space-y-1.5">
          <Label htmlFor="district">District</Label>
          {showDistrictInput ? (
            <div className="flex gap-2 items-center">
              <Input
                id="district"
                placeholder="e.g. Sangrur"
                {...register("district")}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsManualDistrict(false);
                  setValue("district", availableDistricts[0] || "", { shouldValidate: true });
                }}
                className="h-10 text-xs px-3.5 shrink-0"
              >
                Use List
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Select
                id="district"
                {...register("district")}
                options={[
                  { label: "Select District...", value: "" },
                  ...availableDistricts.map(d => ({ label: d, value: d }))
                ]}
                placeholder="Select District"
                disabled={!selectedState}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsManualDistrict(true)}
                className="h-10 text-xs px-3.5 shrink-0"
                disabled={!selectedState}
              >
                Type
              </Button>
            </div>
          )}
          {errors.district && (
            <p className="text-xs text-red-500">{errors.district.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="village">Village / Locality Name</Label>
          <Input
            id="village"
            placeholder="e.g. Lehra Gaga"
            {...register("village")}
          />
          {errors.village && (
            <p className="text-xs text-red-500">{errors.village.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="taluka">Tehsil / Taluka</Label>
          <Input
            id="taluka"
            placeholder="e.g. Lehra"
            {...register("taluka")}
          />
          {errors.taluka && (
            <p className="text-xs text-red-500">{errors.taluka.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="areaClassification">Area Classification</Label>
          <Input
            id="areaClassification"
            placeholder="e.g. Middle Class Area"
            {...register("areaClassification")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="areaType">Urbanization Classification</Label>
          <Input
            id="areaType"
            placeholder="e.g. Semi Urban / Rural"
            {...register("areaType")}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="municipalityType">Local Government Jurisdiction</Label>
          <Input
            id="municipalityType"
            placeholder="e.g. Municipal Council Lehra Gaga / Gram Panchayat"
            {...register("municipalityType")}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="propertyDescription">Brief Description of the Property (Item 5 GENERAL)</Label>
          <Textarea
            id="propertyDescription"
            rows={2}
            placeholder="e.g. Residential plot with built-up double story brick structure..."
            {...register("propertyDescription")}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="govtEnactments">Government Enactments (e.g. Urban Land Ceiling / Agency area status)</Label>
          <Textarea
            id="govtEnactments"
            rows={2}
            placeholder="e.g. Not covered under ULC Act, not under agency/scheduled area limits..."
            {...register("govtEnactments")}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="agriculturalConversion">Agricultural Land Conversion Details (Contemplated/Completed)</Label>
          <Input
            id="agriculturalConversion"
            placeholder="e.g. N.A. (Residential site within municipal zone)"
            {...register("agriculturalConversion")}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="postalAddress">Full Postal Address (as for envelopes)</Label>
            <Button
              type="button"
              variant="ghost"
              onClick={handleGenerateAddress}
              className="h-6 text-[10px] text-[#1c281a] dark:text-[#b8c070] hover:text-[#2a3c27] hover:bg-[#1c281a]/5 px-2 flex items-center gap-1 font-semibold"
            >
              <Wand2 className="h-3 w-3" /> Auto-Construct Address
            </Button>
          </div>
          <Textarea
            id="postalAddress"
            rows={2}
            placeholder="Full mailing address of the property..."
            {...register("postalAddress")}
          />
          {errors.postalAddress && (
            <p className="text-xs text-red-500">{errors.postalAddress.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// STEP 4: Site Details
export function Step4SiteDetails() {
  const { register, setValue, formState: { errors } } = useFormContext<ValuationFormValues>();
  const [mapUrl, setMapUrl] = React.useState("");
  const [gpsError, setGpsError] = React.useState("");
  const [gpsSuccess, setGpsSuccess] = React.useState("");

  const handleExtractGPS = () => {
    setGpsError("");
    setGpsSuccess("");
    if (!mapUrl) {
      setGpsError("Please paste a Google Maps URL first.");
      return;
    }
    const result = parseGmapsUrlOrCoords(mapUrl);
    if (result.success) {
      setValue("latitude", result.latitude);
      setValue("longitude", result.longitude);
      setGpsSuccess(`Extracted: Lat ${result.latitude}, Lng ${result.longitude}`);
    } else {
      setGpsError(result.message);
    }
  };

  return (
    <div className="space-y-4">


      {/* GPS Extraction Helper */}
      <div className="mt-2 mb-6 border border-[#1c281a] rounded-none overflow-hidden shadow-sm">
        <div className="bg-[#ede9df] px-4 py-2.5 border-b border-[#1c281a] flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#1c281a]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200">
            Fetch GPS Coordinates Automatically
          </h4>
        </div>
        <div className="p-5 space-y-4 bg-[#ede9df]/10 dark:bg-slate-950">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="Paste Google Maps URL here (e.g. https://www.google.com/maps/place/...)"
              className="flex-1 rounded-none border-[#c8c5bc]"
            />
            <Button
              type="button"
              variant="default"
              onClick={handleExtractGPS}
              className="flex items-center justify-center gap-1.5 text-xs h-10 px-5 shrink-0 rounded-none bg-[#1c281a] hover:bg-[#2a3c27] text-white font-black tracking-widest uppercase border border-[#1c281a]"
            >
              <Sparkles className="h-4 w-4" /> Extract GPS
            </Button>
          </div>
          {gpsError && <p className="text-xs text-red-500 font-medium">{gpsError}</p>}
          {gpsSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-none w-fit">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {gpsSuccess}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" placeholder="e.g. 29.9984" {...register("latitude")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" placeholder="e.g. 75.7951" {...register("longitude")} />
        </div>
      </div>

      {/* Boundaries Table */}
      <div className="mt-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200 mb-2">Boundaries of the Property</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#ede9df]/10 dark:bg-slate-900/20 p-3 rounded-none border border-[#1c281a]/20 dark:border-slate-800">
          <div className="hidden sm:block text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Side</div>
          <div className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">As per Sale Deed 1</div>
          <div className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">As per Sale Deed 2 (Optional)</div>
          <div className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">As per Site</div>

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">North</div>
          <Input className="h-8 text-xs" {...register("boundaryNorthDeed")} />
          <Input className="h-8 text-xs" {...register("boundaryNorthDeed2")} />
          <Input className="h-8 text-xs" {...register("boundaryNorthSite")} />

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">South</div>
          <Input className="h-8 text-xs" {...register("boundarySouthDeed")} />
          <Input className="h-8 text-xs" {...register("boundarySouthDeed2")} />
          <Input className="h-8 text-xs" {...register("boundarySouthSite")} />

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">East</div>
          <Input className="h-8 text-xs" {...register("boundaryEastDeed")} />
          <Input className="h-8 text-xs" {...register("boundaryEastDeed2")} />
          <Input className="h-8 text-xs" {...register("boundaryEastSite")} />

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">West</div>
          <Input className="h-8 text-xs" {...register("boundaryWestDeed")} />
          <Input className="h-8 text-xs" {...register("boundaryWestDeed2")} />
          <Input className="h-8 text-xs" {...register("boundaryWestSite")} />
        </div>
      </div>

      {/* Dimensions Table */}
      <div className="mt-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200 mb-2">Dimensions (A / B / C Columns)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#ede9df]/10 dark:bg-slate-900/20 p-3 rounded-none border border-[#1c281a]/20 dark:border-slate-800">
          <div className="hidden sm:block text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Measurement Side</div>
          <div className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Column A: As per Deed 1</div>
          <div className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Column B: As per Deed 2</div>
          <div className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Column C: Actuals (Site)</div>

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">North Side</div>
          <Input className="h-8 text-xs" {...register("dimensionNorthDeed")} />
          <Input className="h-8 text-xs" {...register("dimensionNorthDeed2")} />
          <Input className="h-8 text-xs" {...register("dimensionNorthSite")} />

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">South Side</div>
          <Input className="h-8 text-xs" {...register("dimensionSouthDeed")} />
          <Input className="h-8 text-xs" {...register("dimensionSouthDeed2")} />
          <Input className="h-8 text-xs" {...register("dimensionSouthSite")} />

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">East Side</div>
          <Input className="h-8 text-xs" {...register("dimensionEastDeed")} />
          <Input className="h-8 text-xs" {...register("dimensionEastDeed2")} />
          <Input className="h-8 text-xs" {...register("dimensionEastSite")} />

          <div className="font-bold text-xs text-[#1c281a] dark:text-slate-300 flex items-center uppercase tracking-wider">West Side</div>
          <Input className="h-8 text-xs" {...register("dimensionWestDeed")} />
          <Input className="h-8 text-xs" {...register("dimensionWestDeed2")} />
          <Input className="h-8 text-xs" {...register("dimensionWestSite")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="space-y-1.5">
          <Label htmlFor="plotArea">Plot Area (Sq Yards)</Label>
          <Input
            id="plotArea"
            type="number"
            placeholder="e.g. 300"
            {...register("plotArea", { valueAsNumber: true })}
          />
          {errors.plotArea && (
            <p className="text-xs text-red-500">{errors.plotArea.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coveredArea">Total Covered Area (Sq Ft)</Label>
          <Input
            id="coveredArea"
            type="number"
            placeholder="e.g. 2400"
            {...register("coveredArea", { valueAsNumber: true })}
          />
          {errors.coveredArea && (
            <p className="text-xs text-red-500">{errors.coveredArea.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="numberOfFloors">Number of Floors</Label>
          <Input
            id="numberOfFloors"
            type="number"
            placeholder="e.g. 2"
            {...register("numberOfFloors", { valueAsNumber: true })}
          />
          {errors.numberOfFloors && (
            <p className="text-xs text-red-500">{errors.numberOfFloors.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="extentSite">Extent of the site (Item 15)</Label>
          <Input id="extentSite" placeholder="e.g. 300 Sq. Yards" {...register("extentSite")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="extentValuation">Extent considered for valuation (Item 16)</Label>
          <Input id="extentValuation" placeholder="e.g. 300 Sq. Yards (least of deed vs actual)" {...register("extentValuation")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="occupancyDetails">Occupancy & Rent details (Item 17)</Label>
          <Input id="occupancyDetails" placeholder="e.g. Self-occupied, no rent" {...register("occupancyDetails")} />
        </div>
      </div>
    </div>
  );
}

// STEP 5: Site Characteristics (20 items)
export function Step5SiteCharacteristics() {
  const { register } = useFormContext<ValuationFormValues>();

  const characteristicsFields = [
    { key: "charLocality", label: "1. Locality Classification" },
    { key: "charDevelopment", label: "2. Development of Surrounding Area" },
    { key: "charFlooding", label: "3. Possibility of frequent flooding" },
    { key: "charCivicAmenities", label: "4. Distance to Civic Amenities (School, Hospital, Bus, Market)" },
    { key: "charLandLevel", label: "5. Level of land / Topography" },
    { key: "charLandShape", label: "6. Shape of land block" },
    { key: "charTypeUse", label: "7. Permissible Type of use" },
    { key: "charUsageRestriction", label: "8. Usage Restrictions (if any)" },
    { key: "charTownPlanning", label: "9. In Town Planning Approved Layout?" },
    { key: "charCornerPlot", label: "10. Corner plot or Intermittent plot?" },
    { key: "charRoadFacilities", label: "11. Road access facilities" },
    { key: "charRoadType", label: "12. Type of road surface" },
    { key: "charRoadWidth", label: "13. Width of road frontage" },
    { key: "charLandLocked", label: "14. Is it a Land-Locked land?" },
    { key: "charWaterPotential", label: "15. Ground water potentiality" },
    { key: "charSewerage", label: "16. Underground sewerage connectivity" },
    { key: "charPowerSupply", label: "17. Electricity supply availability" },
    { key: "charAdvantages", label: "18. Key advantages of the site" },
    { key: "charDisadvantages", label: "19. Key disadvantages of the site" },
    { key: "charSpecialRemarks", label: "20. Special Remarks (acquisition threat, CRZ restrictions, etc.)" },
  ] as const;

  return (
    <div className="space-y-4">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characteristicsFields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input id={field.key} {...register(field.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// STEP 6: Building Details
export function Step6BuildingDetails() {
  const { register } = useFormContext<ValuationFormValues>();

  const specRows = [
    { key: "specFoundation", label: "1. Foundation Type" },
    { key: "specBasement", label: "2. Basement Construction" },
    { key: "specSuperstructure", label: "3. Superstructure Walls" },
    { key: "specJoinery", label: "4. Doors & Windows (Joinery)" },
    { key: "specRcc", label: "5. RCC works" },
    { key: "specPlastering", label: "6. Plastering finish" },
    { key: "specFlooring", label: "7. Flooring, Skirting, Dadoing" },
    { key: "specSpecialFinish", label: "8. Special finish (Marble/Granite/Wooden/Grills)" },
    { key: "specRoofing", label: "9. Roofing weathering course" },
  ] as const;

  return (
    <div className="space-y-4">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#1c281a]/12 pb-4 mb-4">
        <div className="space-y-1.5">
          <Label htmlFor="buildingType">Building Description (a)</Label>
          <Input id="buildingType" placeholder="e.g. Residential Villa" {...register("buildingType")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="constructionType">Structure Class (b)</Label>
          <Input id="constructionType" placeholder="e.g. RCC / Load bearing masonry" {...register("constructionType")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="yearOfConstruction">Year of Construction (c)</Label>
          <Input id="yearOfConstruction" placeholder="e.g. 2018" {...register("yearOfConstruction")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="plinthArea">Plinth Area floor-wise (e)</Label>
          <Input id="plinthArea" placeholder="e.g. Ground Floor: 1200 sft, First Floor: 1200 sft" {...register("plinthArea")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="conditionExterior">Exterior Maintenance State (f)</Label>
          <Input id="conditionExterior" placeholder="Excellent / Good / Normal / Poor" {...register("conditionExterior")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="conditionInterior">Interior Finish State (f)</Label>
          <Input id="conditionInterior" placeholder="Excellent / Good / Normal / Poor" {...register("conditionInterior")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="layoutApprovalDateValidity">Layout Approved Map Date / Validity (g)</Label>
          <Input id="layoutApprovalDateValidity" placeholder="e.g. Approved 12/04/2018, valid indefinitely" {...register("layoutApprovalDateValidity")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="layoutApprovalAuthority">Approved Plan Issuing Authority (h)</Label>
          <Input id="layoutApprovalAuthority" placeholder="e.g. Municipal Council Lehra Gaga" {...register("layoutApprovalAuthority")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="layoutApprovalGenuineness">Auth / Genuineness of Approved Plan verified? (i)</Label>
          <Input id="layoutApprovalGenuineness" placeholder="e.g. Verified from records, found genuine" {...register("layoutApprovalGenuineness")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="layoutApprovalComments">Other plan comments (j)</Label>
          <Input id="layoutApprovalComments" placeholder="e.g. Structural layout conforms to site boundaries" {...register("layoutApprovalComments")} />
        </div>
      </div>

      {/* Specifications Ground vs Other floors Table */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200 mb-2">Specifications of Construction (Floor-Wise)</h4>
        <div className="space-y-3 bg-[#ede9df]/10 dark:bg-slate-900/20 p-4 rounded-none border border-[#1c281a]/20 dark:border-slate-800">
          <div className="hidden md:grid md:grid-cols-3 gap-4 text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase pb-1 border-b border-[#1c281a]/20">
            <div>S.No / Description</div>
            <div>Ground Floor</div>
            <div>Other Floors</div>
          </div>
          {specRows.map((spec, i) => (
            <div key={spec.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center text-xs">
              <span className="font-bold text-xs text-[#1c281a] dark:text-slate-300 uppercase tracking-wider">{spec.label}</span>
              <Input className="h-8 text-xs" {...register(`${spec.key}Ground` as const)} />
              <Input className="h-8 text-xs" {...register(`${spec.key}Other` as const)} />
            </div>
          ))}
        </div>
      </div>

      {/* Compound, Electrical, Plumbing details */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#1c281a]/12 pt-4 dark:border-slate-800">
        {/* Compound Wall Column */}
        <div className="space-y-4 p-5 border border-[#1c281a]/20 rounded-none bg-[#fcfbfa] dark:bg-slate-900/40 dark:border-slate-800 shadow-none">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c281a] dark:text-slate-100">1. Compound Wall Details</h4>
          <div className="space-y-1.5">
            <Label htmlFor="compoundHeight" className="text-[11px] text-[#1c281a]/80 dark:text-slate-300">Height</Label>
            <Input id="compoundHeight" className="h-8 text-xs" {...register("compoundHeight")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="compoundLength" className="text-[11px]">Length</Label>
            <Input id="compoundLength" className="h-8 text-xs" {...register("compoundLength")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="compoundType" className="text-[11px]">Construction Type</Label>
            <Input id="compoundType" className="h-8 text-xs" {...register("compoundType")} />
          </div>
        </div>

        {/* Electrical Installation Column */}
        <div className="space-y-4 p-5 border border-[#1c281a]/20 rounded-none bg-[#fcfbfa] dark:bg-slate-900/10 dark:border-slate-800 shadow-none">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c281a]">2. Electrical Installation</h4>
          <div className="space-y-1.5">
            <Label htmlFor="electricalWiring" className="text-[11px]">Wiring Type</Label>
            <Input id="electricalWiring" className="h-8 text-xs" {...register("electricalWiring")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="electricalFitting" className="text-[11px]">Class of Fitting</Label>
            <Input id="electricalFitting" className="h-8 text-xs" {...register("electricalFitting")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="electricalLightPoints" className="text-[11px]">Light Points Count</Label>
            <Input id="electricalLightPoints" className="h-8 text-xs" {...register("electricalLightPoints")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="electricalFanPoints" className="text-[11px]">Fan Points Count</Label>
            <Input id="electricalFanPoints" className="h-8 text-xs" {...register("electricalFanPoints")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="electricalPlugs" className="text-[11px]">Spare Plug Points</Label>
            <Input id="electricalPlugs" className="h-8 text-xs" {...register("electricalPlugs")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="electricalOther" className="text-[11px]">Other Electrical Items</Label>
            <Input id="electricalOther" className="h-8 text-xs" {...register("electricalOther")} />
          </div>
        </div>

        {/* Plumbing Installation Column */}
        <div className="space-y-4 p-5 border border-[#1c281a]/20 rounded-none bg-[#fcfbfa] dark:bg-slate-900/10 dark:border-slate-800 shadow-none">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c281a]">3. Plumbing Installation</h4>
          <div className="space-y-1.5">
            <Label htmlFor="plumbingWaterClosets" className="text-[11px]">Water Closets (W.C. type/count)</Label>
            <Input id="plumbingWaterClosets" className="h-8 text-xs" {...register("plumbingWaterClosets")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plumbingWashBasins" className="text-[11px]">Wash Basins Count</Label>
            <Input id="plumbingWashBasins" className="h-8 text-xs" {...register("plumbingWashBasins")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plumbingUrinals" className="text-[11px]">Urinals Count</Label>
            <Input id="plumbingUrinals" className="h-8 text-xs" {...register("plumbingUrinals")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plumbingBathTubs" className="text-[11px]">Bath Tubs Count</Label>
            <Input id="plumbingBathTubs" className="h-8 text-xs" {...register("plumbingBathTubs")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plumbingWaterMeter" className="text-[11px]">Water Meter, Taps, etc.</Label>
            <Input id="plumbingWaterMeter" className="h-8 text-xs" {...register("plumbingWaterMeter")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plumbingOther" className="text-[11px]">Other Plumbing Fixtures</Label>
            <Input id="plumbingOther" className="h-8 text-xs" {...register("plumbingOther")} />
          </div>
        </div>
      </div>
    </div>
  );
}

// STEP 7: Valuation Engine
export function Step7ValuationEngine() {
  const { register, control, formState: { errors } } = useFormContext<ValuationFormValues>();

  const { fields: rowsFields, append: appendRow, remove: removeRow } = useFieldArray({
    control,
    name: "valuationDetailsRows",
  });

  // Watch form values for real-time updates
  const watchedValues = useWatch({ control }) as ValuationFormValues;
  const valuation = calculateValuation(watchedValues || {});

  return (
    <div className="space-y-4">


      {/* Main Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#1c281a]/12 pb-4">
        <div className="space-y-1.5">
          <Label htmlFor="marketRate">Land adopted rate (per Sq Yard)</Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">₹</span>
            <Input
              id="marketRate"
              type="number"
              className="pl-7 h-9 text-xs"
              placeholder="e.g. 15000"
              {...register("marketRate", { valueAsNumber: true })}
            />
          </div>
          {errors.marketRate && (
            <p className="text-xs text-red-500">{errors.marketRate.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="guidelineRate">Govt circle rate (per Sq Yard)</Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">₹</span>
            <Input
              id="guidelineRate"
              type="number"
              className="pl-7 h-9 text-xs"
              placeholder="e.g. 12000"
              {...register("guidelineRate", { valueAsNumber: true })}
            />
          </div>
          {errors.guidelineRate && (
            <p className="text-xs text-red-500">{errors.guidelineRate.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="constructionRate">Structural replacement rate (per Sq Ft)</Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">₹</span>
            <Input
              id="constructionRate"
              type="number"
              className="pl-7 h-9 text-xs"
              placeholder="e.g. 1600"
              {...register("constructionRate", { valueAsNumber: true })}
            />
          </div>
          {errors.constructionRate && (
            <p className="text-xs text-red-500">{errors.constructionRate.message}</p>
          )}
        </div>
      </div>

      {/* Building Valuation Table (useFieldArray) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200">Building Valuation Breakdown (Details table)</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendRow({
                particularOfItem: `Structure Floor ${rowsFields.length + 1}`,
                plinthArea: 1000,
                remainingAge: 50,
                depreciationPct: 8,
                replacementRate: 1500,
              })
            }
            className="flex items-center gap-1 text-xs h-7 py-1 px-2.5"
          >
            <Plus className="h-3 w-3" /> Add Floor
          </Button>
        </div>

        <div className="space-y-3">
          {rowsFields.map((field, idx) => (
            <Card key={field.id} className="border border-[#1c281a]/20 dark:border-slate-800 bg-[#fcfbfa] dark:bg-slate-900/20 p-4 relative rounded-none shadow-none">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(idx)}
                className="absolute right-2 top-2 h-7 w-7 text-[#1c281a]/40 hover:text-red-500 rounded-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pr-8">
                <div className="space-y-1">
                  <Label className="text-[10px]">Item / Floor Name</Label>
                  <Input className="h-8 text-xs" {...register(`valuationDetailsRows.${idx}.particularOfItem` as const)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Plinth Area (sft)</Label>
                  <Input type="number" className="h-8 text-xs" {...register(`valuationDetailsRows.${idx}.plinthArea` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Replacement Rate (₹/sft)</Label>
                  <Input type="number" className="h-8 text-xs" {...register(`valuationDetailsRows.${idx}.replacementRate` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Remaining Age (yrs)</Label>
                  <Input type="number" className="h-8 text-xs" {...register(`valuationDetailsRows.${idx}.remainingAge` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Depreciation (%)</Label>
                  <Input type="number" className="h-8 text-xs" {...register(`valuationDetailsRows.${idx}.depreciationPct` as const, { valueAsNumber: true })} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Extra Parts C, D, E, F amounts */}
      <div className="pt-2 border-t border-[#1c281a]/12 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200">Extra Valuation Items (Amount in Rs.)</h4>
        
        {/* Part C Extra Items */}
        <div className="bg-[#fcfbfa] dark:bg-slate-900/10 p-4 rounded-none border border-[#1c281a]/20 dark:border-slate-800 space-y-3 shadow-none">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#1c281a]">Part C - Extra Items</h5>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px]">1. Portico</Label>
              <Input type="number" className="h-8 text-xs" {...register("extraPortico", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">2. Ornamental Door</Label>
              <Input type="number" className="h-8 text-xs" {...register("extraOrnamentalDoor", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">3. Sitout Verandah</Label>
              <Input type="number" className="h-8 text-xs" {...register("extraSitOut", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">4. Overhead Water Tank</Label>
              <Input type="number" className="h-8 text-xs" {...register("extraOverheadTank", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">5. Extra Steel Gates</Label>
              <Input type="number" className="h-8 text-xs" {...register("extraSteelGates", { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        {/* Part D Amenities */}
        <div className="bg-[#fcfbfa] dark:bg-slate-900/10 p-4 rounded-none border border-[#1c281a]/20 dark:border-slate-800 space-y-3 shadow-none">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#1c281a]">Part D - Amenities</h5>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px]">1. Wardrobes</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityWardrobes", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">2. Glazed Tiles</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityGlazedTiles", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">3. Extra Sinks/Tubs</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityExtraSinks", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">4. Marble Flooring</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityMarbleFlooring", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">5. Interior Decor</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityInteriorDecor", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">6. Arch Elevation</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityArchElevation", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">7. Paneling Works</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityPaneling", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">8. Aluminum Works</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityAluminumWorks", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">9. Aluminum Rails</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityAluminumRails", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">10. False Ceiling</Label>
              <Input type="number" className="h-8 text-xs" {...register("amenityFalseCeiling", { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        {/* Part E Miscellaneous & Part F Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fcfbfa] dark:bg-slate-900/10 p-4 rounded-none border border-[#1c281a]/20 dark:border-slate-800 space-y-3 shadow-none">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1c281a]">Part E - Miscellaneous</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px]">1. Separate Toilet Room</Label>
                <Input type="number" className="h-8 text-xs" {...register("miscToiletRoom", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">2. Lumber Room</Label>
                <Input type="number" className="h-8 text-xs" {...register("miscLumberRoom", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">3. Water Tank / Sump</Label>
                <Input type="number" className="h-8 text-xs" {...register("miscWaterTank", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">4. Trees, Gardening</Label>
                <Input type="number" className="h-8 text-xs" {...register("miscTreesGardening", { valueAsNumber: true })} />
              </div>
            </div>
          </div>

          <div className="bg-[#fcfbfa] dark:bg-slate-900/10 p-4 rounded-none border border-[#1c281a]/20 dark:border-slate-800 space-y-3 shadow-none">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1c281a]">Part F - Services</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px]">1. Water Supply Arrangements</Label>
                <Input type="number" className="h-8 text-xs" {...register("serviceWaterSupply", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">2. Drainage Arrangements</Label>
                <Input type="number" className="h-8 text-xs" {...register("serviceDrainage", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">3. Compound Wall</Label>
                <Input type="number" className="h-8 text-xs" {...register("serviceCompoundWall", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">4. C.B. Deposits / Fittings</Label>
                <Input type="number" className="h-8 text-xs" {...register("serviceCbDeposits", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px]">5. Pavements</Label>
                <Input type="number" className="h-8 text-xs" {...register("servicePavement", { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place, Valuer & Bank Signatures */}
      <div className="pt-2 border-t border-[#1c281a]/12 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200">Signatures, Names & Wording Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="valuerName">Approved Valuer Name</Label>
            <Input id="valuerName" className="h-8 text-xs" {...register("valuerName")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="valuerRegNo">Valuer Registration Number</Label>
            <Input id="valuerRegNo" className="h-8 text-xs" {...register("valuerRegNo")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="valuerPlace">Place of Valuation (default Lehra Gaga)</Label>
            <Input id="valuerPlace" className="h-8 text-xs" {...register("valuerPlace")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bankVerificationDate">Bank Inspection Date</Label>
            <Input id="bankVerificationDate" type="date" className="h-8 text-xs" {...register("bankVerificationDate")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="valuerAddress">Approved Valuer Address</Label>
            <Input id="valuerAddress" className="h-8 text-xs" {...register("valuerAddress")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="valuationCalculationsText">Valuation approach & calculations text (Page 5 explanation)</Label>
            <Textarea id="valuationCalculationsText" rows={3} placeholder="Provide details of methodology..." {...register("valuationCalculationsText")} />
          </div>
        </div>
      </div>

      {/* 11 Valuer comments table inputs */}
      <div className="pt-2 border-t border-[#1c281a]/12 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200">Valuer Comments table (11 points, Page 6-7)</h4>
        <div className="space-y-3 bg-[#ede9df]/10 dark:bg-slate-900/10 p-4 rounded-none border border-[#1c281a]/20 dark:border-slate-800">
          {[
            "1. Background information of the asset being valued",
            "2. Purpose of valuation and appointing authority",
            "3. Identity of the valuer and any other experts involved",
            "4. Disclosure of valuer interest or conflict, if any",
            "5. Date of appointment, valuation date and date of report",
            "6. Inspections and/or investigations undertaken",
            "7. Nature and sources of the information used or relied upon",
            "8. Procedures adopted and valuation standards followed",
            "9. Restrictions on use of the report, if any",
            "10. Major factors taken into account during the valuation",
            "11. Caveats, limitations and disclaimers"
          ].map((label, index) => (
            <div key={index} className="space-y-1 text-xs">
              <Label htmlFor={`commentsValuer.${index}`} className="font-bold text-xs text-[#1c281a] dark:text-slate-300 uppercase tracking-wider">{label}</Label>
              <Input id={`commentsValuer.${index}`} className="h-8 text-xs" {...register(`commentsValuer.${index}` as const)} />
            </div>
          ))}
        </div>
      </div>

      {/* Auto Calculations Summary Panel */}
      <div className="mt-6 border-2 border-[#1c281a] rounded-none overflow-hidden shadow-sm">
        <div className="bg-[#ede9df] px-4 py-3 border-b-2 border-[#1c281a]">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1c281a] dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#1c281a] dark:text-[#b8c070]" />
            Automatic Valuation Results Summary
          </h4>
        </div>
        <div className="p-4 space-y-4 bg-[#fcfbfa] dark:bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#1c281a]/12 pb-4">
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Computed Land Value (Part A)</p>
              <p className="text-lg font-black text-[#1c281a] dark:text-slate-100 mt-1">
                {formatIndianCurrency(valuation.landValue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Computed Building Value (Part B-F)</p>
              <p className="text-lg font-black text-[#1c281a] dark:text-slate-100 mt-1">
                {formatIndianCurrency(valuation.buildingValue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#1c281a]/70 uppercase">Total Raw Security Value</p>
              <p className="text-lg font-black text-[#1c281a] dark:text-slate-100 mt-1">
                {formatIndianCurrency(valuation.totalPropertyValue)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="bg-[#e8e4da]/40 dark:bg-slate-900/20 border border-[#1c281a]/20 p-3 rounded-none">
              <p className="text-[10px] font-black tracking-wider text-[#1c281a]/80 dark:text-slate-400 uppercase">Fair Market Value (FMV)</p>
              <p className="text-xl font-black text-[#1c281a] dark:text-[#b8c070] mt-1">
                {formatIndianCurrency(valuation.fairMarketValue)}
              </p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">
                {valuation.fairMarketValueWords}
              </p>
            </div>
            <div className="bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-600/30 p-3 rounded-none">
              <p className="text-[10px] font-black tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">Realizable Value (85%)</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {formatIndianCurrency(valuation.realizableValue)}
              </p>
              <p className="text-[10px] text-emerald-600/80 italic mt-0.5">
                {valuation.realizableValueWords}
              </p>
            </div>
            <div className="bg-red-50/10 dark:bg-red-950/10 border border-red-600/30 p-3 rounded-none">
              <p className="text-[10px] font-black tracking-wider text-red-800 dark:text-red-400 uppercase">Distressed Value (72%)</p>
              <p className="text-xl font-black text-red-700 dark:text-red-400 mt-1">
                {formatIndianCurrency(valuation.distressedValue)}
              </p>
              <p className="text-[10px] text-red-600/80 italic mt-0.5">
                {valuation.distressedValueWords}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// STEP 8: File Uploads
export function Step8FileUploads() {
  const { register, setValue, watch } = useFormContext<ValuationFormValues>();

  const uploadFields = [
    { key: "photoFront", label: "Property Front Elevation Photo" },
    { key: "photoInterior", label: "Property Interior Photo" },
    { key: "gmapsScreenshot", label: "Google Maps Route Screenshot" },
    { key: "circleRateDoc", label: "Govt Circle Rate PDF / Image" },
    { key: "layoutPlan", label: "Approved Site Layout Plan" },
    { key: "otherDoc", label: "Supporting Deed Document" },
  ] as const;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: typeof uploadFields[number]["key"]) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (key: typeof uploadFields[number]["key"]) => {
    setValue(key, "");
  };

  return (
    <div className="space-y-4">


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {uploadFields.map((field) => {
          const val = watch(field.key);
          const hasFile = !!val;
          return (
            <div key={field.key} className="border border-dashed border-[#1c281a]/20 dark:border-slate-800 rounded-none p-4 flex flex-col justify-between items-center bg-[#e8e4da]/10 dark:bg-slate-900/10 min-h-[140px] text-center relative group">
              {hasFile ? (
                <div className="w-full flex flex-col items-center justify-center space-y-2 h-full py-2">
                  {val.startsWith("data:image/") ? (
                    <img src={val} alt={field.label} className="h-16 w-24 object-cover rounded border border-slate-200 dark:border-slate-800 shadow-sm" />
                  ) : (
                    <FileText className="h-10 w-10 text-[#1c281a]/70" />
                  )}
                  <span className="text-xs font-semibold text-[#1c281a] dark:text-[#b8c070] line-clamp-1 px-4">{field.label} uploaded</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(field.key)}
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 py-1 h-7"
                  >
                    Delete File
                  </Button>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-lg p-2 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mb-2 group-hover:text-[#1c281a]/70 transition-colors" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{field.label}</span>
                  <span className="text-[10px] text-slate-400 mt-1">Click to select files</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field.key)}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
