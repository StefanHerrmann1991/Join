<?php
header("Access-Control-Allow-Origin: *"); // Set CORS header
echo file_get_contents('resetPassword.html'); // Read and output the content of resetPassword.html
?>
