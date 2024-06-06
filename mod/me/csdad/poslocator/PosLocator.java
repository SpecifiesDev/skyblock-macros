package me.csdad.poslocator;

import me.csdad.poslocator.Proxy.DataServer;
import net.minecraft.command.ICommand;
import net.minecraftforge.client.ClientCommandHandler;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;

// in new versions of this mod, I'm going to change all of these indicators.
@Mod(modid = "posloc", name = "PositionLocator", version = "1.0", acceptedMinecraftVersions = "[1.8.9]")
public class PosLocator {

  // by default fishing status should be toggled off
  public static boolean FishingStatus = false;
  
  // method to set the fishing status outside of this class
  public static void setFishingStatus(boolean status) {
    FishingStatus = status;
  }
  
  // on preinit, register the entity move event. This is actually a sound listening event, will be changed in new versions to reflect the name.
  // I want to keep this src on-par with the compiled version.
  @EventHandler
  public static void preInit(FMLPreInitializationEvent event) {
    MinecraftForge.EVENT_BUS.register(new EntityMoveEvent());
  }


  // on init, register the toggle fishing command.
  @EventHandler
  public static void init(FMLInitializationEvent event) {
    ClientCommandHandler.instance.registerCommands(new ToggleFishing());
  }
  
  // on postinit, start the data server.
  @EventHandler
  public static void postInit(FMLPostInitializationEvent event) {
    DataServer server = new DataServer(8080);
  }
}