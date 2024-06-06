package me.csdad.poslocator;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import net.minecraftforge.client.event.sound.PlaySoundEvent;
import net.minecraftforge.fml.common.eventhandler.SubscribeEvent;
import net.minecraftforge.fml.relauncher.Side;
import net.minecraftforge.fml.relauncher.SideOnly;

public class EntityMoveEvent {

    @SideOnly(Side.CLIENT)
    @SubscribeEvent
    public void onFishReady(PlaySoundEvent e) {
        if (PosLocator.FishingStatus) {
            String sound = e.name;
            if (e.name.contains("pling"))
                try {
                    // pretty sure when I programmed this, I was in a rush and used copilot to do this
                    // and it named the vars for me. Once an update is pushed I will update these var names
                    // but I want to stay on-par with the compiled version.
                    URL yahoo = new URL("http://localhost:7070/fish");
                    URLConnection yc = yahoo.openConnection();
                    BufferedReader in = new BufferedReader(new InputStreamReader(yc.getInputStream()));
                    String inputLine;
                    while ((inputLine = in.readLine()) != null)
                        System.out.println(inputLine);
                    in.close();
                } catch (Exception err) {
                    err.printStackTrace();
                }
        }
    }
}