<?php
    $ch = curl_init('http://52.26.97.126:8888/oauth/token');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/x-www-form-urlencoded',
    ));

    $post_data =  array(
        'client_id' => 'TOv0A7q8XhZdIhJlTe6ILvzwI5FjRldi',
        'client_secret' => '6CgjqDWMARyNoR7wcVaCU7ehAoGBAMjAHzu+FlA49xO1fsVwzRrbxN7NQ9hmuTYB',
        'grant_type' => 'refresh_token',
        'refresh_token' => '3ccfdc5bec4ebbfc127d055368edf9bd7120cd62',
    );

    curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    $result = curl_exec($ch);
    var_dump($result);
    // curl -H "Authorization: Bearer 33048805e8a774282ae11d00c92c009f73d35756" http://52.26.97.126:8888/
?>
