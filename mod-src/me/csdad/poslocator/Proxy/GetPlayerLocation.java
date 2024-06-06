package me.csdad.poslocator.Proxy;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import net.minecraft.client.Minecraft;

public class GetPlayerLocation implements HttpHandler {
  public void handle(HttpExchange exc) throws IOException {
    byte[] response = null;
    JSONFactory factory = new JSONFactory();
    factory.putMultiple(new String[] { "success", "true", "x", 
          
          Double.toString(Minecraft.getInstance().player.posX), "y", 
          Double.toString(Minecraft.getInstance().player.posY), "z", 
          Double.toString(Minecraft.getInstance().player.posZ) });
    response = factory.stringify().getBytes();
    exc.sendResponseHeaders(200, response.length);
    OutputStream stream = exc.getResponseBody();
    stream.write(response);
    stream.close();
  }
}