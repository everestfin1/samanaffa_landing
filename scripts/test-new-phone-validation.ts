import { isValidPhoneNumber, isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

// Test data with various phone numbers and their expected validity
const testCases = [
  // Senegal (+221)
  { phone: '+221771234567', expected: true, description: 'Valid Senegal mobile (77)' },
  { phone: '+221781234567', expected: true, description: 'Valid Senegal mobile (78)' },
  { phone: '+221761234567', expected: true, description: 'Valid Senegal mobile (76)' },
  { phone: '+221701234567', expected: true, description: 'Valid Senegal mobile (70)' },
  { phone: '+221751234567', expected: true, description: 'Valid Senegal mobile (75)' },
  { phone: '+221331234567', expected: true, description: 'Valid Senegal fixed (33)' },
  { phone: '+221321234567', expected: true, description: 'Valid Senegal fixed (32)' },
  { phone: '+221311234567', expected: true, description: 'Valid Senegal fixed (31)' },
  { phone: '+221791234567', expected: false, description: 'Invalid Senegal prefix (79)' },
  { phone: '+22177123456', expected: false, description: 'Invalid Senegal (too short)' },
  { phone: '+2217712345678', expected: false, description: 'Invalid Senegal (too long)' },

  // France (+33)
  { phone: '+33123456789', expected: true, description: 'Valid France mobile' },
  { phone: '+331234567890', expected: true, description: 'Valid France landline' },
  { phone: '+3312345678', expected: false, description: 'Invalid France (too short)' },

  // USA (+1)
  { phone: '+12345678901', expected: true, description: 'Valid USA number' },
  { phone: '+1234567890', expected: false, description: 'Invalid USA (too short)' },

  // UK (+44)
  { phone: '+441234567890', expected: true, description: 'Valid UK number (10 digits)' },
  { phone: '+4412345678901', expected: true, description: 'Valid UK number (11 digits)' },
  { phone: '+44123456789', expected: false, description: 'Invalid UK (too short)' },

  // Test national format parsing with default country
  { phone: '771234567', country: 'SN', expected: true, description: 'Valid Senegal national format' },
  { phone: '791234567', country: 'SN', expected: false, description: 'Invalid Senegal national format (79 prefix)' },
];

console.log('🧪 Testing New Phone Number Validation with libphonenumber-js\n');
console.log('=' .repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((testCase: typeof testCases[number], index: number) => {
  let result: boolean;
  
  if (testCase.country) {
    // Test with default country for national format
    result = isValidPhoneNumber(testCase.phone, testCase.country as any);
  } else {
    // Test international format
    result = isValidPhoneNumber(testCase.phone);
  }
  
  const success = result === testCase.expected;
  
  if (success) {
    passed++;
    console.log(`✅ Test ${index + 1}: ${testCase.description}`);
    console.log(`   Phone: ${testCase.phone}${testCase.country ? ` (Country: ${testCase.country})` : ''} | Result: ${result}`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: ${testCase.description}`);
    console.log(`   Phone: ${testCase.phone}${testCase.country ? ` (Country: ${testCase.country})` : ''}`);
    console.log(`   Expected: ${testCase.expected} | Got: ${result}`);
    
    // Additional debugging info
    try {
      const phoneNumber = parsePhoneNumber(testCase.phone, testCase.country as any);
      if (phoneNumber) {
        console.log(`   Parsed: Country=${phoneNumber.country}, Number=${phoneNumber.number}`);
        console.log(`   isPossible: ${phoneNumber.isPossible()}, isValid: ${phoneNumber.isValid()}`);
      }
    } catch (error) {
      console.log(`   Parse error: ${error}`);
    }
  }
  console.log('');
});

console.log('=' .repeat(80));
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

// Additional tests for edge cases
console.log('\n🔍 Testing Edge Cases:');

const edgeCases = [
  { phone: '', description: 'Empty string' },
  { phone: '+', description: 'Just plus sign' },
  { phone: '+999999999999999999', description: 'Very long invalid number' },
  { phone: '123', description: 'Very short number' },
  { phone: '+221 77 123 45 67', description: 'Senegal with spaces' },
  { phone: '+221-77-123-45-67', description: 'Senegal with dashes' },
  { phone: '+221 (77) 123-45-67', description: 'Senegal with mixed formatting' },
];

edgeCases.forEach((testCase: typeof edgeCases[number], index: number) => {
  try {
    const isValid = isValidPhoneNumber(testCase.phone);
    const isPossible = isPossiblePhoneNumber(testCase.phone);
    console.log(`${index + 1}. ${testCase.description}: "${testCase.phone}"`);
    console.log(`   isPossible: ${isPossible}, isValid: ${isValid}`);
  } catch (error) {
    console.log(`${index + 1}. ${testCase.description}: "${testCase.phone}"`);
    console.log(`   Error: ${error}`);
  }
  console.log('');
});

if (failed === 0) {
  console.log('🎉 All validation tests passed! The new implementation is working correctly.');
} else {
  console.log('💥 Some tests failed. Please check the validation logic.');
  process.exit(1);
}
