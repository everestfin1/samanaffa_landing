import { validateInternationalPhone } from '../src/lib/utils';

// Test data with various phone numbers and their expected validity
const testCases = [
  // Senegal (+221)
  { phone: '+221771234567', country: 'sn', expected: true, description: 'Valid Senegal mobile (77)' },
  { phone: '+221781234567', country: 'sn', expected: true, description: 'Valid Senegal mobile (78)' },
  { phone: '+221761234567', country: 'sn', expected: true, description: 'Valid Senegal mobile (76)' },
  { phone: '+221701234567', country: 'sn', expected: true, description: 'Valid Senegal mobile (70)' },
  { phone: '+221751234567', country: 'sn', expected: true, description: 'Valid Senegal mobile (75)' },
  { phone: '+221331234567', country: 'sn', expected: true, description: 'Valid Senegal fixed (33)' },
  { phone: '+221321234567', country: 'sn', expected: true, description: 'Valid Senegal fixed (32)' },
  { phone: '+221311234567', country: 'sn', expected: true, description: 'Valid Senegal fixed (31)' },
  { phone: '+221791234567', country: 'sn', expected: false, description: 'Invalid Senegal prefix (79)' },
  { phone: '+22177123456', country: 'sn', expected: false, description: 'Invalid Senegal (too short)' },
  { phone: '+2217712345678', country: 'sn', expected: false, description: 'Invalid Senegal (too long)' },

  // France (+33)
  { phone: '+33123456789', country: 'fr', expected: true, description: 'Valid France mobile' },
  { phone: '+331234567890', country: 'fr', expected: true, description: 'Valid France landline' },
  { phone: '+3312345678', country: 'fr', expected: false, description: 'Invalid France (too short)' },

  // USA (+1)
  { phone: '+12345678901', country: 'us', expected: true, description: 'Valid USA number' },
  { phone: '+1234567890', country: 'us', expected: false, description: 'Invalid USA (too short)' },
  { phone: '+12345678901234', country: 'us', expected: false, description: 'Invalid USA (too long)' },

  // UK (+44)
  { phone: '+441234567890', country: 'gb', expected: true, description: 'Valid UK number (10 digits)' },
  { phone: '+4412345678901', country: 'gb', expected: true, description: 'Valid UK number (11 digits)' },
  { phone: '+44123456789', country: 'gb', expected: false, description: 'Invalid UK (too short)' },

  // Canada (+1)
  { phone: '+12345678901', country: 'ca', expected: true, description: 'Valid Canada number' },
  { phone: '+1234567890', country: 'ca', expected: false, description: 'Invalid Canada (too short)' },

  // Germany (+49)
  { phone: '+491234567890', country: 'de', expected: true, description: 'Valid Germany number (10 digits)' },
  { phone: '+4912345678901', country: 'de', expected: true, description: 'Valid Germany number (11 digits)' },
  { phone: '+49123456789', country: 'de', expected: false, description: 'Invalid Germany (too short)' },

  // Italy (+39)
  { phone: '+39123456789', country: 'it', expected: true, description: 'Valid Italy number (9 digits)' },
  { phone: '+391234567890', country: 'it', expected: true, description: 'Valid Italy number (10 digits)' },
  { phone: '+3912345678', country: 'it', expected: false, description: 'Invalid Italy (too short)' },

  // Spain (+34)
  { phone: '+34123456789', country: 'es', expected: true, description: 'Valid Spain number' },
  { phone: '+3412345678', country: 'es', expected: false, description: 'Invalid Spain (too short)' },
  { phone: '+341234567890', country: 'es', expected: false, description: 'Invalid Spain (too long)' },

  // Generic country (unknown)
  { phone: '+85123456789', country: 'unknown', expected: true, description: 'Valid generic number' },
  { phone: '+8512345', country: 'unknown', expected: false, description: 'Invalid generic (too short)' },
];

console.log('🧪 Testing Phone Number Validation\n');
console.log('=' .repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = validateInternationalPhone(testCase.phone, testCase.country);
  const success = result === testCase.expected;
  
  if (success) {
    passed++;
    console.log(`✅ Test ${index + 1}: ${testCase.description}`);
    console.log(`   Phone: ${testCase.phone} | Country: ${testCase.country} | Result: ${result}`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: ${testCase.description}`);
    console.log(`   Phone: ${testCase.phone} | Country: ${testCase.country}`);
    console.log(`   Expected: ${testCase.expected} | Got: ${result}`);
  }
  console.log('');
});

console.log('=' .repeat(80));
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! Phone validation is working correctly.');
} else {
  console.log('💥 Some tests failed. Please check the validation logic.');
  process.exit(1);
}
