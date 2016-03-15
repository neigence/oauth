<?php
    $ch = curl_init('https://52.26.97.126:8888/oauth/authorise?response_type=code&client_id=TOv0A7q8XhZdIhJlTe6ILvzwI5FjRldi&redirect_uri=https://10.32.97.126:8888/oauth/redirect_uri?');
    //curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/x-www-form-urlencoded',
    ));

    curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,0);

    $post_data = array(

    );

    //curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    $result = curl_exec($ch);
    var_dump($result);

?>
