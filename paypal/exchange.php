<?php

function obtenerValorDolar(){

$json=file_get_contents("https://open.er-api.com/v6/latest/USD");

$data=json_decode($json,true);

return $data["rates"]["CLP"];

}
