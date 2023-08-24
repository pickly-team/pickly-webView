package com.ww8007.pickly;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri; 
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class CustomShareModule extends ReactContextBaseJavaModule {

    public CustomShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "CustomShareModule";
    }

    @ReactMethod
    public void getSharedText(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "No activity found");
            return;
        }

        Intent intent = currentActivity.getIntent();
        String action = intent.getAction();
        String type = intent.getType();

        Uri data = intent.getData();
        if (data != null) {
            Log.d("CustomShareModule", "Received URL: " + data.toString());
        }

        if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null) {
                promise.resolve(sharedText);  
            } else {
                promise.reject("SHARED_TEXT_NULL", "Shared text is null");
            }
        } else {
            promise.reject("NO_VALID_ACTION", "No valid action");
        }
    }
    
    @ReactMethod
    public void clearSharedText() {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            Intent intent = currentActivity.getIntent();
            intent.removeExtra(Intent.EXTRA_TEXT);
        }
    }

}
