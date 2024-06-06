package me.csdad.poslocator;

import net.minecraft.client.Minecraft;
import net.minecraft.command.CommandBase;
import net.minecraft.command.CommandException;
import net.minecraft.command.ICommandSender;
import net.minecraft.util.ChatComponentText;
import net.minecraft.util.IChatComponent;

public class ToggleFishing extends CommandBase {

    // over ride the getCommandName method to return the command name
    @Override
    public String getCommandName() {
        return "togglefishing";
    }

    // over ride the getCommandUsage method to return the command usage
    @Override
    public String getCommandUsage(ICommandSender sender) {
        return "/togglefishing";
    }

    // override getRequiredPermissionLevel to return the required permission level
    @Override
    public int getRequiredPermissionLevel() {
        return 0;
    }

    // over ride the processCommand method to process the command
    @Override
    public void processCommand(ICommandSender sender, String[] args) throws CommandException {
        if (!PosLocator.FishingStatus) {
            Minecraft.getMinecraft().thePlayer.addChatMessage(new ChatComponentText("Fishing has been turned on."));
            PosLocator.setFishingStatus(true);
        } else {
            Minecraft.getMinecraft().thePlayer.addChatMessage(new ChatComponentText("Fishing has been turned off."));
            PosLocator.setFishingStatus(false);
        }
    }

}