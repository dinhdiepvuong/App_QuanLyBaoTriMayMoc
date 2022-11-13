package edu.iuh.dhktpm15a_nhom12_qlbaotrimaymoc.activity;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import edu.iuh.dhktpm15a_nhom12_qlbaotrimaymoc.R;

public class SigUp extends AppCompatActivity {
    private Button btnSigIn, btnSigUp;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sig_up);

        btnSigIn = findViewById(R.id.btnSignIn_SignUp);
        btnSigUp = findViewById(R.id.btnSignUp_SignUp);

        btnSigUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(SigUp.this, SigIn.class);
                startActivity(intent);
            }
        });
        btnSigIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(SigUp.this, SigIn.class);
                startActivity(intent);
            }
        });
    }
}