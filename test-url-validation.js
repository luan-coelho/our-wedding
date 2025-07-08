// Simple test to verify URL validation logic
// This can be run with: node test-url-validation.js

const isValidImageUrl = url => {
  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false
    }
  } catch {
    return false
  }

  // Check if URL ends with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const lowercaseUrl = url.toLowerCase()

  // Check for direct image extensions
  if (imageExtensions.some(ext => lowercaseUrl.endsWith(ext))) {
    return true
  }

  // Check for image extensions with query parameters
  const urlWithoutQuery = lowercaseUrl.split('?')[0]
  return imageExtensions.some(ext => urlWithoutQuery.endsWith(ext))
}

// Test cases
const testCases = [
  // Valid URLs
  { url: 'https://example.com/image.jpg', expected: true, description: 'Valid HTTPS JPG' },
  { url: 'http://example.com/image.png', expected: true, description: 'Valid HTTP PNG' },
  { url: 'https://example.com/image.jpeg', expected: true, description: 'Valid JPEG' },
  { url: 'https://example.com/image.gif', expected: true, description: 'Valid GIF' },
  { url: 'https://example.com/image.webp', expected: true, description: 'Valid WebP' },
  { url: 'https://example.com/image.svg', expected: true, description: 'Valid SVG' },
  { url: 'https://example.com/image.jpg?v=123', expected: true, description: 'Valid with query params' },

  // Invalid URLs
  { url: 'ftp://example.com/image.jpg', expected: false, description: 'Invalid protocol (FTP)' },
  { url: 'https://example.com/document.pdf', expected: false, description: 'Not an image file' },
  { url: 'not-a-url', expected: false, description: 'Invalid URL format' },
  { url: 'https://example.com/', expected: false, description: 'No file extension' },
  { url: '', expected: false, description: 'Empty string' },
  { url: 'https://example.com/image', expected: false, description: 'No extension' },
]

console.log('🧪 Testing URL validation logic...\n')

let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
  const result = isValidImageUrl(testCase.url)
  const success = result === testCase.expected

  if (success) {
    console.log(`✅ Test ${index + 1}: ${testCase.description}`)
    passed++
  } else {
    console.log(`❌ Test ${index + 1}: ${testCase.description}`)
    console.log(`   Expected: ${testCase.expected}, Got: ${result}`)
    console.log(`   URL: ${testCase.url}`)
    failed++
  }
})

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)

if (failed === 0) {
  console.log('🎉 All tests passed! URL validation is working correctly.')
} else {
  console.log('⚠️  Some tests failed. Please review the validation logic.')
}
