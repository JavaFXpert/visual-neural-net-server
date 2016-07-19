package com.javafxpert.neuralnetviz.util;

/**
 * Created by jamesweaver on 7/18/16.
 */
public class AppUtils {
  /**
   * Input a comma separated list of numeric values, which could appear like the following:
   * 42, 3.14159, 747
   * and output a double array similar to the following:
   * [42, 3.14159, 747]
   *
   * Throws unchecked exception NumberFormatException if (noted here for documentation purposes)
   */
  public static double[] commaSeparatedNumbersToArray(String values) {
    String[] valuesStringArray = values.split(",");
    double[] valuesArray = new double[valuesStringArray.length];
    String argStr = "";
    for (int i = 0; i < valuesStringArray.length; i++) {
      valuesArray[i] = Double.parseDouble(valuesStringArray[i].trim());
    }
    return valuesArray;
  }
}
