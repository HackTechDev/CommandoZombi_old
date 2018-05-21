<?php

$mapPath = "../assets/tilemaps/Level 0/ados/";
$mapName = "city.json";

$file = fopen($mapPath . $mapName, "r") or exit("Unable to open file!");

$fileAssetPack = "asset.json";

unlink($mapPath . $fileAssetPack);


$dataAssetPack = "{\n\t\"level\": [";

$process = false;

while(!feof($file)) {
  	$line =  fgets($file);
	
	if( $process ) {
  		if ( preg_match("/\"image\"/", $line)) {
			$image1 = explode(":", $line);
			$image2 = substr($image1[1], 1, -3);
			$image3 = str_replace("\\", "", $image2);
			$image4 = str_replace("../../", "assets/", $image3);
		}
		
		if ( preg_match("/\"name\"/", $line)) {
	    	$name1 = explode(":", $line);		
			$name2 = substr($name1[1], 1, -3);
			$name3 = str_replace("\\", "", $name2);
			$name4 = str_replace(" ", "_", $name3);
			$name5 = str_replace("../../", "", $name4);
			$name6 = str_replace("/", "_", $name5);
			
			$dataAssetPack .= "
\t\t{
\t\t\t\"type\": \"image\", 
\t\t\t\"key\": \"" . $name6 . "\",
\t\t\t\"url\": \"" . $image4 . "\",
\t\t\t\"tiled\": \"" . $name2 . "\",
\t\t\t\"overwrite\": false
\t\t},";

		}
	}

	if (preg_match("/blend_roof/", $line)) {
		$process = true;
	}

}

$dataAssetPack = substr($dataAssetPack, 0, -1); 

$dataAssetPack .= "
\t]
}
";

file_put_contents($mapPath . $fileAssetPack,  $dataAssetPack, FILE_APPEND | LOCK_EX);

fclose($file);
?>
