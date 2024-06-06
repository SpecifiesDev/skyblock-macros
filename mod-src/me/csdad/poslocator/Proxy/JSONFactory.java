package me.csdad.poslocator.Proxy;

import java.util.HashMap;
import java.util.Map;

public class JSONFactory {
  private Map<String, String> values = new HashMap<String, String>();
  
  public void put(String key, String value) {
    this.values.put(key, value);
  }
  
  public void putMultiple(String[] arr) {
    if (arr.length % 2 == 0)
      for (int i = 0; i < arr.length; i += 2)
        this.values.put(arr[i], arr[i + 1]);  
  }
  
  public void remove(String key) {
    this.values.remove(key);
  }
  
  public String stringify() {
    String returnString = "{";
    int position = 0;
    for (Map.Entry<String, String> entry : this.values.entrySet()) {
      String key = entry.getKey();
      String value = entry.getValue();
      if (position == this.values.size() - 1) {
        returnString = returnString + "\"" + key + "\": \"" + value + "\" }";
      } else {
        returnString = returnString + "\"" + key + "\": \"" + value + "\",";
      } 
      position++;
    } 
    return returnString;
  }
}