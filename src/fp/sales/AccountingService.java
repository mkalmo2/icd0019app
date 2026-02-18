package fp.sales;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class AccountingService {

    private int callCount = 0;

    public double getProfitMargin(String productId) {
        // simulates fairly expensive call that we do not want to make too often.

        callCount++;

        return stringToDoubleWithSHA(productId) * 0.2 + 0.1;
    }

    public int getCallCount() {
        return callCount;
    }

    private double stringToDoubleWithSHA(String input) {
        MessageDigest digest = getDigest();
        byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));

        long hashValue = 0;
        for (int i = 0; i < Math.min(8, hashBytes.length); i++) {
            hashValue = (hashValue << 8) | (hashBytes[i] & 0xFF);
        }

        // Convert to value between 0 and 1
        int largePrime = 1000000007; // covers most of the integer range
        return Math.abs(hashValue) % largePrime / (double) largePrime;
    }

    private static MessageDigest getDigest() {
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

}
