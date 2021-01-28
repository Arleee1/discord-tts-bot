package pog.arleee.ttsmod;

import net.minecraftforge.client.event.ClientChatEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

@Mod("arleee_tts_mod")
public class TTSMod {
    private boolean TTSOn = false;
    private final String DISC_ENDPOINT = "http://192.168.1.197:8000/disc_tts/";

    public TTSMod() {
        MinecraftForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void onClientChat(ClientChatEvent event) {
        if(event.getMessage().equals(".tts")){
            this.TTSOn = !this.TTSOn;
            System.out.println("tts turned on");
            event.setCanceled(true);
        }
        if(this.TTSOn && !event.getMessage().equals(".tts")){
            String request_url = this.DISC_ENDPOINT + EncodingUtil.encodeURIComponent(event.getMessage());
            System.out.println("Requesting URL: " + request_url);
            HttpClient client = new DefaultHttpClient();
            HttpPost post = new HttpPost(request_url);
            try {
                  //Post Parameters
//                List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
//                nameValuePairs.add(new BasicNameValuePair("registrationid",
//                        "123456789"));
//                post.setEntity(new UrlEncodedFormEntity(nameValuePairs));

                //Use if you dont want a response
                client.execute(post);
                //Use if you want a response
                //HttpResponse response = client.execute(post);

                  //Reads Response Data
//                BufferedReader rd = new BufferedReader(new InputStreamReader(
//                        response.getEntity().getContent()));
//                String line = "";
//                while ((line = rd.readLine()) != null) {
//                    System.out.println(line);
//                }

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
