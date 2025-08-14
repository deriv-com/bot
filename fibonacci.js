
/**
 * Fibonacci Number Calculator
 * Multiple implementations for educational purposes
 */

// Recursive implementation (simple but inefficient for large numbers)
function fibonacciRecursive(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// Iterative implementation (efficient)
function fibonacciIterative(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;

    let a = 0,
        b = 1;
    for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

// Memoized recursive implementation (efficient with caching)
function fibonacciMemoized(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 0) return 0;
    if (n === 1) return 1;

    memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
    return memo[n];
}

// Generate Fibonacci sequence up to n terms
function fibonacciSequence(n) {
    const sequence = [];
    for (let i = 0; i < n; i++) {
        sequence.push(fibonacciIterative(i));
    }
    return sequence;
}

// Find the largest Fibonacci number less than or equal to limit
function fibonacciUpToLimit(limit) {
    const sequence = [];
    let a = 0,
        b = 1;

    while (a <= limit) {
        sequence.push(a);
        const temp = a + b;
        a = b;
        b = temp;
    }

    return sequence;
}

// Check if a number is a Fibonacci number
function isFibonacci(num) {
    if (num < 0) return false;

    let a = 0,
        b = 1;
    if (num === a || num === b) return true;

    while (b < num) {
        const temp = a + b;
        a = b;
        b = temp;
        if (b === num) return true;
    }

    return false;
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fibonacciRecursive,
        fibonacciIterative,
        fibonacciMemoized,
        fibonacciSequence,
        fibonacciUpToLimit,
        isFibonacci,
    };
}

// Example usage and testing
console.log('=== Fibonacci Calculator Demo ===');
console.log('');

const testNumber = 10;
console.log(`Fibonacci(${testNumber}):`);
console.log(`Recursive: ${fibonacciRecursive(testNumber)}`);
console.log(`Iterative: ${fibonacciIterative(testNumber)}`);
console.log(`Memoized: ${fibonacciMemoized(testNumber)}`);
console.log('');

console.log(`First ${testNumber} Fibonacci numbers:`);
console.log(fibonacciSequence(testNumber));
console.log('');

console.log('Fibonacci numbers up to 100:');
console.log(fibonacciUpToLimit(100));
console.log('');

console.log('Testing isFibonacci function:');
const testNumbers = [0, 1, 2, 3, 4, 5, 8, 13, 21, 22, 34, 55];
testNumbers.forEach(num => {
    console.log(`${num} is ${isFibonacci(num) ? '' : 'not '}a Fibonacci number`);
});

// Performance comparison for larger numbers
console.log('');
console.log('=== Performance Test (n=30) ===');

const n = 30;

console.time('Iterative');
const iterativeResult = fibonacciIterative(n);
console.timeEnd('Iterative');

console.time('Memoized');
const memoizedResult = fibonacciMemoized(n);
console.timeEnd('Memoized');

console.log(`Results: Iterative=${iterativeResult}, Memoized=${memoizedResult}`);

// Note: Recursive implementation would be too slow for n=30, so we skip it
console.log('Note: Recursive implementation skipped for n=30 due to exponential time complexity');
