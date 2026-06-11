export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", 
    "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", 
    "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", 
    "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", 
    "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", 
    "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", 
    "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", 
    "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", 
    "North East Delhi", "North West Delhi", "Shahdara", 
    "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Chandigarh": ["Chandigarh"],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", 
    "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", 
    "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", 
    "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", 
    "Srinagar", "Udhampur"
  ],
  "Ladakh": ["Kargil", "Leh"],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", 
    "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", 
    "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", 
    "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", 
    "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", 
    "Tonk", "Udaipur"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", 
    "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", 
    "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", 
    "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", 
    "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", 
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", 
    "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", 
    "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", 
    "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", 
    "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", 
    "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", 
    "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", 
    "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", 
    "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", 
    "Udham Singh Nagar", "Uttarkashi"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", 
    "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka", 
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", 
    "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", 
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
    "Tapi", "Vadodara", "Valsad"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", 
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", 
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", 
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", 
    "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", 
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", 
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", 
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", 
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", 
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", 
    "Vijayapura", "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", 
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", 
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", 
    "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", 
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", 
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", 
    "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", 
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", 
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", 
    "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", 
    "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", 
    "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", 
    "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", 
    "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", 
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", 
    "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", 
    "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", 
    "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", 
    "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", 
    "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", 
    "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", 
    "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", 
    "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", 
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", 
    "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", 
    "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", 
    "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", 
    "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", 
    "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", 
    "Vidisha"
  ],

  "Arunachal Pradesh": [
    "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", 
    "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", 
    "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", 
    "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", 
    "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", 
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", 
    "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", 
    "Kamrup Rural", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", 
    "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", 
    "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", 
    "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", 
    "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", 
    "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", 
    "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
  ],
  "Goa": ["North Goa", "South Goa"],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", 
    "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", 
    "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", 
    "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", 
    "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", 
    "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", 
    "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", 
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"
  ],
  "Nagaland": [
    "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak", 
    "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", 
    "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", 
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", 
    "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", 
    "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
  ],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", 
    "Unakoti", "West Tripura"
  ],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};
