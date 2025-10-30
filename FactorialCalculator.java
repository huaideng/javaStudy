public class FactorialCalculator {
    // This class calculates the factorial of a number

    /**
     * Calculates the factorial of a given non-negative integer.
     *
     * @param n the number to calculate the factorial for
     * @return the factorial of n
     * @throws IllegalArgumentException if n is negative
     */
    public static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Number must be non-negative.");
        }
        long result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}