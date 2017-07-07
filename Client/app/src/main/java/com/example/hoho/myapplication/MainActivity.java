package com.example.hoho.myapplication;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ScrollView;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;



public class MainActivity extends AppCompatActivity {

    Button b1;
    EditText url;
    BackgroundTask task;
    String address, result;
    TextView tv;
    ScrollView sv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        b1 = (Button)findViewById(R.id.button1);
        url = (EditText)findViewById(R.id.editText1);
        tv = (TextView)findViewById(R.id.textView1);
        sv = (ScrollView)findViewById(R.id.scrollView1);
        address = ""; result = "";

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                task = new BackgroundTask();
                task.execute();
            }
        });


        mSocket.on("newMessage", onNewMessage);
        mSocket.on("news", onNews);
        mSocket.connect();
        mSocket.on(Socket.EVENT_CONNECT, onConnect);
    }

    private  Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject obj = new JSONObject();
                    try {
                        obj.put("username", "testMyName");
                        obj.put("message", "testHoho");
                        mSocket.emit("new message", obj);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    };

    private  Emitter.Listener onNews = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {

            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // tv.setText("test Listen");
                    JSONObject data = (JSONObject) args[0];
                    String hello;

                    try {
                        hello = data.getString("hello");
                        tv.append("hello: " + hello + "\n");
                    } catch (JSONException e) {
                        return;
                    }
                }
            });
        }
    };


    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {

            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                   // tv.setText("test Listen");
                    JSONObject data = (JSONObject) args[0];
                    String username = "username";
                    String message = "message";
                    try {

                        username = data.getString("username");
                        message = data.getString("message");
                        tv.append("username: " + username + " message:" + message + "\n");
                    } catch (JSONException e) {

//                        tv.append("onNewMessage");
                        return;
                    }


                  //  tv.setText("test Listen");
                    // add the message to view
                    //addMessage(username, message);
                }
            });

        }
    };

    public MainActivity getActivity() {
        return this;
    }


    class BackgroundTask extends AsyncTask<Integer, Integer, Integer> {
        protected void onPreExecute() {
            address = url.getText().toString();
        }

        @Override
        protected Integer doInBackground(Integer... arg0) {
            // TODO Auto-generated method stub
            result = request(address);
            return null;
        }

        protected void onPostExecute(Integer a) {
            tv.setText(result);
        }

    }

    private String request(String urlStr) {
        StringBuilder output = new StringBuilder();
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            if (conn != null) {
                conn.setConnectTimeout(10000);
                conn.setRequestMethod("GET");
                conn.setDoInput(true);
//                conn.setDoOutput(true);

                int resCode = conn.getResponseCode();

                output.append("Success. GET \n" + String.valueOf(resCode) + "/n" );
                if (resCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream())) ;
                    String line = null;
                    while(true) {
                        line = reader.readLine();
                        if (line == null) {
                            break;
                        }
                        output.append(line + "\n");
                    }

                    reader.close();
                    conn.disconnect();
                }
                else {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream())) ;
                    String line = null;
                    while(true) {
                        line = reader.readLine();
                        if (line == null) {
                            break;
                        }
                        output.append(line + "\n");
                    }

                    reader.close();
                    conn.disconnect();
                }
            }
        } catch(Exception ex) {
            Log.e("SampleHTTP", "Exception in processing response.", ex);
            ex.printStackTrace();

            ex.toString();

            output.append("Error: Exception in processing response. \n" + ex.toString() + "\n");
        }

        return output.toString();
    }

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://172.30.1.33:3000");
        } catch (URISyntaxException e) {}
    }


}
