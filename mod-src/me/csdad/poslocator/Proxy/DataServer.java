package me.csdad.poslocator.Proxy;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

public class DataServer {
    private final int port;

    private HttpServer proxy;

    public DataServer(int port) {
        this.port = port;
        try {
            startProxy();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void startProxy() throws Exception {
        this.proxy = HttpServer.create(new InetSocketAddress(this.port), 0);
        this.proxy.createContext("/position", new GetPlayerLocation());
        this.proxy.setExecutor(null);
        this.proxy.start();
    }

    public void stopProxy() throws Exception {
        this.proxy.stop(0);
    }
}