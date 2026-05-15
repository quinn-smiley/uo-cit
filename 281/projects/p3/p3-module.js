function coinCombo(amount) {
    // Define the possible US coin denominations in cents
    const coinValues = [1, 5, 10, 25, 50, 100];  // pennies, nickels, dimes, quarters, halves, dollars
    const coinNames = ["pennies", "nickels", "dimes", "quarters", "halves", "dollars"];
    
    // To store all combinations
    let combinations = [];

    // Iterate through all possible numbers of coins for each denomination
    for (let dollars = 0; dollars <= Math.floor(amount / 100); dollars++) {
        for (let halves = 0; halves <= Math.floor((amount - dollars * 100) / 50); halves++) {
            for (let quarters = 0; quarters <= Math.floor((amount - dollars * 100 - halves * 50) / 25); quarters++) {
                for (let dimes = 0; dimes <= Math.floor((amount - dollars * 100 - halves * 50 - quarters * 25) / 10); dimes++) {
                    for (let nickels = 0; nickels <= Math.floor((amount - dollars * 100 - halves * 50 - quarters * 25 - dimes * 10) / 5); nickels++) {
                        let pennies = amount - (dollars * 100 + halves * 50 + quarters * 25 + dimes * 10 + nickels * 5);
                        
                        // If the remaining pennies are non-negative, we have a valid combination
                        if (pennies >= 0) {
                            combinations.push({
                                pennies: pennies,
                                nickels: nickels,
                                dimes: dimes,
                                quarters: quarters,
                                halves: halves,
                                dollars: dollars
                            });
                        }
                    }
                }
            }
        }
    }

    // Return the object with the original amount and combinations
    return {
        amount: amount,
        combinations: combinations,
        totalCombinations: combinations.length
    };
}

// Example usage: 
//console.log(coinCombo(30));

function coinValue(coinCounts) {
    // Destructuring the coinCounts object to separate out the individual coin values
    const { pennies = 0, nickels = 0, dimes = 0, quarters = 0, halves = 0, dollars = 0} = coinCounts;

    // Calculate the total value in cents
    const totalCents = pennies * 1 + nickels * 5 + dimes * 10 + quarters * 25 + halves * 50 + dollars * 100;

    // Calculate the total value in dollars, formatted to two decimal places
    const totalDollars = (totalCents / 100).toFixed(2);

    // Return the result as an object
    return {
        coins: { pennies, nickels, dimes, quarters, halves, dollars },
        totalCents,
        totalDollars
    };
}

// Example usage:
const coinCounts = { pennies: 3, nickels: 2, dimes: 1, quarters: 1, halves: 1, dollars: 1 };
const result = coinValue(coinCounts);
//console.log(result);

// ----------------------------
// Manual Test Cases
// ----------------------------
if (require.main === module) {

    console.log('\n===== Manual Tests for coinCombo() =====');
    const testCombo1 = coinCombo(5);
    console.log(`Test 1 - coinCombo(5)`);
    console.log(`Expected combinations > 0, Actual: ${testCombo1.totalCombinations}`);
    console.log('Sample:', testCombo1.combinations.slice(0, 3));
  
    const testCombo2 = coinCombo(0);
    console.log(`\nTest 2 - coinCombo(0)`);
    console.log(`Expected: 1 combination with all zeros`);
    console.log('Actual:', testCombo2.combinations);
  
    const testCombo3 = coinCombo(-5);
    console.log(`\nTest 3 - coinCombo(-5)`);
    console.log(`Expected: 0 combinations`);
    console.log('Actual:', testCombo3.totalCombinations);
  
    console.log('\n===== Manual Tests for coinValue() =====');
    const testValue1 = coinValue({ pennies: 4, nickels: 1, dimes: 2, quarters: 1, halves: 0, dollars: 1 });
    console.log(`Test 1 - coinValue({4p,1n,2d,1q,0h,1$})`);
    console.log(`Expected cents: 4 + 5 + 20 + 25 + 0 + 100 = 154`);
    console.log('Actual:', testValue1.totalCents, `($${testValue1.totalDollars})`);
  
    const testValue2 = coinValue({});
    console.log(`\nTest 2 - coinValue({})`);
    console.log(`Expected: 0 cents`);
    console.log('Actual:', testValue2.totalCents, `($${testValue2.totalDollars})`);
  
    const testValue3 = coinValue({ pennies: '10', nickels: '2', dollars: '1' });
    console.log(`\nTest 3 - coinValue(string inputs)`);
    console.log(`Expected: 10 + 10 + 100 = 120`);
    console.log('Actual:', testValue3.totalCents, `($${testValue3.totalDollars})`);
}

module.exports = {
    coinCombo, 
    coinValue
}