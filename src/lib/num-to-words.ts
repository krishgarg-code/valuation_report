export function numberToWordsIndian(amount: number): string {
  const roundedAmount = Math.floor(amount);
  if (roundedAmount === 0) return "Zero Only";
  
  const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const doubleDigits = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  
  const convertBelowThousand = (n: number): string => {
    let str = "";
    if (n >= 100) {
      str += singleDigits[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n < 20) {
      str += teens[n - 10] + " ";
    } else {
      if (n >= 20) {
        str += doubleDigits[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        str += singleDigits[n] + " ";
      }
    }
    return str.trim();
  };

  let numVal = roundedAmount;
  let crores = 0;
  let lakhs = 0;
  let thousands = 0;
  let remaining = 0;

  if (numVal >= 10000000) {
    crores = Math.floor(numVal / 10000000);
    numVal %= 10000000;
  }
  if (numVal >= 100000) {
    lakhs = Math.floor(numVal / 100000);
    numVal %= 100000;
  }
  if (numVal >= 1000) {
    thousands = Math.floor(numVal / 1000);
    numVal %= 1000;
  }
  remaining = numVal;

  let result = "";
  if (crores > 0) {
    result += convertBelowThousand(crores) + " Crore ";
  }
  if (lakhs > 0) {
    result += convertBelowThousand(lakhs) + " Lakh ";
  }
  if (thousands > 0) {
    result += convertBelowThousand(thousands) + " Thousand ";
  }
  if (remaining > 0) {
    result += convertBelowThousand(remaining) + " ";
  }

  return (result.trim() + " Only").replace(/\s+/g, " ");
}
