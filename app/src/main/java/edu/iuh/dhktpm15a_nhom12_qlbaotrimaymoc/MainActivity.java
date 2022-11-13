package edu.iuh.dhktpm15a_nhom12_qlbaotrimaymoc;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import edu.iuh.dhktpm15a_nhom12_qlbaotrimaymoc.activity.SigIn;

public class MainActivity extends AppCompatActivity {

    private Button btnGetStart;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btnGetStart = findViewById(R.id.btn_GetStart);

        btnGetStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, SigIn.class);
                startActivity(intent);
            }
        });
    }
}