<?php

if(!empty($_GET['string'])){
  $string = $_GET['string'];
  $action = 'dec';
  $secret_key = 'my_simple_secret_key';
  $secret_iv = 'my_simple_secret_iv';
  $output = false;
  $encrypt_method = "AES-256-CBC";
  $key = hash( 'sha256', $secret_key );
  $iv = substr( hash( 'sha256', $secret_iv ), 0, 16 );
  if( $action == 'enc' ) {
      //encrypt string
      $output = base64_encode( openssl_encrypt( $string, $encrypt_method, $key, 0, $iv ) );
  }
  else if( $action == 'dec' ){
      //decrypt string
      $output = openssl_decrypt( base64_decode( $string ), $encrypt_method, $key, 0, $iv );
  }
  echo "<b>".$output."</b>";
} else {
  echo "Please enter valid string";
}
exit;