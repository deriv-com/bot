
/**
 * Palindrome Checker and Generator
 * Multiple implementations for strings, numbers, and arrays
 */

// Simple string palindrome check (case-sensitive)
function isPalindromeSimple(str) {
    if (typeof str !== 'string') return false;
    return str === str.split('').reverse().join('');
}

// Case-insensitive palindrome check with special character handling
function isPalindrome(str) {
    if (typeof str !== 'string') return false;

    // Remove non-alphanumeric characters and convert to lowercase
    const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleaned === cleaned.split('').reverse().join('');
}

// Optimized palindrome check (two-pointer approach)
function isPalindromeOptimized(str) {
    if (typeof str !== 'string') return false;

    const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0;
    let right = cleaned.length - 1;

    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

// Check if a number is a palindrome
function isPalindromeNumber(num) {
    if (typeof num !== 'number' || num < 0) return false;

    const str = num.toString();
    return str === str.split('').reverse().join('');
}

// Check if an array is a palindrome
function isPalindromeArray(arr) {
    if (!Array.isArray(arr)) return false;

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        if (arr[left] !== arr[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

// Find the longest palindromic substring
function longestPalindrome(str) {
    if (typeof str !== 'string' || str.length === 0) return '';

    let longest = '';

    // Helper function to expand around center
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < str.length && str[left] === str[right]) {
            const current = str.substring(left, right + 1);
            if (current.length > longest.length) {
                longest = current;
            }
            left--;
            right++;
        }
    }

    for (let i = 0; i < str.length; i++) {
        // Odd length palindromes (center is a single character)
        expandAroundCenter(i, i);
        // Even length palindromes (center is between two characters)
        expandAroundCenter(i, i + 1);
    }

    return longest;
}

// Generate palindromes of a given length
function generatePalindromes(length, useNumbers = false) {
    if (length <= 0) return [];

    const palindromes = [];
    const chars = useNumbers ? '0123456789' : 'abcdefghijklmnopqrstuvwxyz';
    const halfLength = Math.ceil(length / 2);

    function generateHelper(current) {
        if (current.length === halfLength) {
            let palindrome = current;
            const reversed = current.split('').reverse().join('');

            if (length % 2 === 0) {
                palindrome += reversed;
            } else {
                palindrome += reversed.substring(1);
            }

            palindromes.push(palindrome);
            return;
        }

        for (let char of chars) {
            generateHelper(current + char);
        }
    }

    // Limit generation to prevent memory issues
    if (halfLength <= 3) {
        generateHelper('');
    }

    return palindromes;
}

// Check if string can be rearranged to form a palindrome
function canFormPalindrome(str) {
    if (typeof str !== 'string') return false;

    const charCount = {};

    // Count character frequencies
    for (let char of str.toLowerCase()) {
        if (/[a-zA-Z0-9]/.test(char)) {
            charCount[char] = (charCount[char] || 0) + 1;
        }
    }

    // Count characters with odd frequencies
    let oddCount = 0;
    for (let count of Object.values(charCount)) {
        if (count % 2 === 1) {
            oddCount++;
        }
    }

    // For a palindrome, at most one character can have odd frequency
    return oddCount <= 1;
}

// Find all palindromic substrings
function findAllPalindromes(str) {
    if (typeof str !== 'string') return [];

    const palindromes = new Set();

    function expandAroundCenter(left, right) {
        while (left >= 0 && right < str.length && str[left] === str[right]) {
            palindromes.add(str.substring(left, right + 1));
            left--;
            right++;
        }
    }

    for (let i = 0; i < str.length; i++) {
        // Odd length palindromes
        expandAroundCenter(i, i);
        // Even length palindromes
        expandAroundCenter(i, i + 1);
    }

    return Array.from(palindromes).sort((a, b) => b.length - a.length);
}

// Create a palindrome by adding minimum characters to the beginning
function makePalindrome(str) {
    if (typeof str !== 'string') return '';
    if (isPalindrome(str)) return str;

    for (let i = 0; i < str.length; i++) {
        const candidate = str.substring(i) + str.substring(0, i).split('').reverse().join('');
        if (isPalindrome(candidate)) {
            return candidate;
        }
    }

    return str + str.split('').reverse().join('');
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isPalindromeSimple,
        isPalindrome,
        isPalindromeOptimized,
        isPalindromeNumber,
        isPalindromeArray,
        longestPalindrome,
        generatePalindromes,
        canFormPalindrome,
        findAllPalindromes,
        makePalindrome,
    };
}

// Example usage and testing
console.log('=== Palindrome Checker Demo ===');
console.log('');

// Test strings
const testStrings = [
    'racecar',
    'A man a plan a canal Panama',
    'race a car',
    'hello',
    'Madam',
    'Was it a car or a cat I saw?',
    'No lemon, no melon',
];

console.log('String Palindrome Tests:');
testStrings.forEach(str => {
    console.log(`"${str}" -> ${isPalindrome(str) ? 'Palindrome' : 'Not palindrome'}`);
});
console.log('');

// Test numbers
const testNumbers = [121, 1221, 12321, 123, 0, 7, 1001];
console.log('Number Palindrome Tests:');
testNumbers.forEach(num => {
    console.log(`${num} -> ${isPalindromeNumber(num) ? 'Palindrome' : 'Not palindrome'}`);
});
console.log('');

// Test arrays
const testArrays = [[1, 2, 3, 2, 1], [1, 2, 3, 4, 5], ['a', 'b', 'a'], [1], []];

console.log('Array Palindrome Tests:');
testArrays.forEach(arr => {
    console.log(`[${arr.join(', ')}] -> ${isPalindromeArray(arr) ? 'Palindrome' : 'Not palindrome'}`);
});
console.log('');

// Longest palindrome tests
const longestTests = ['babad', 'cbbd', 'abcdef', 'raceacar'];
console.log('Longest Palindrome Tests:');
longestTests.forEach(str => {
    console.log(`"${str}" -> "${longestPalindrome(str)}"`);
});
console.log('');

// Can form palindrome tests
const rearrangeTests = ['aab', 'abc', 'aabbcc', 'listen'];
console.log('Can Form Palindrome Tests:');
rearrangeTests.forEach(str => {
    console.log(`"${str}" -> ${canFormPalindrome(str) ? 'Can form palindrome' : 'Cannot form palindrome'}`);
});
console.log('');

// Generate small palindromes
console.log('Generated 3-character palindromes (first 10):');
const generated = generatePalindromes(3).slice(0, 10);
console.log(generated);
console.log('');

// Performance comparison
console.log('=== Performance Test ===');
const longString = 'racecar'.repeat(1000);

console.time('Simple Check');
isPalindromeSimple(longString);
console.timeEnd('Simple Check');

console.time('Optimized Check');
isPalindromeOptimized(longString);
console.timeEnd('Optimized Check');

console.log('');
console.log('Find all palindromes in "abccba":');
console.log(findAllPalindromes('abccba'));

console.log('');
console.log('Make palindrome from "hello":');
console.log(`"hello" -> "${makePalindrome('hello')}"`);
