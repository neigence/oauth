<?php
    $ch = curl_init('https://52.26.97.126:8888/oauth/token');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/x-www-form-urlencoded',
    ));
    curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,0);

    $post_data =  array(
        'client_id' => 'TOv0A7q8XhZdIhJlTe6ILvzwI5FjRldi',
        'client_secret' => '6CgjqDWMARyNoR7wcVaCU7ehAoGBAMjAHzucFlA49xO1fsVwzRrbxN7NQ9hmuTYB',
        'grant_type' => 'client_credentials',
        'scope' => 'application:user-profile',
    );

    curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    $result = curl_exec($ch);
    var_dump($result);
    // curl -H "Authorization: Bearer 33048805e8a774282ae11d00c92c009f73d35756" http://52.26.97.126:8888/
?>
