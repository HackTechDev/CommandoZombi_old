<?php
$file = fopen("../assets/tilemaps/Level 0/ados/city.json", "r") or exit("Unable to open file!");

$process = false;

while(!feof($file)) {
  	$line =  fgets($file);

	
	if( $process ) {
  		if ( preg_match("/\"image\"/", $line)) {
			$image1 = explode(":", $line);
			$image2 = substr($image1[1], 1, -3);
			$image3 = str_replace("\\", "", $image2);
			//echo "i: " . $image3 . "\n";
		}
		
		if ( preg_match("/\"name\"/", $line)) {
	    	$name1 = explode(":", $line);		
			$name2 = substr($name1[1], 1, -3);
			$name3 = str_replace("\\", "", $name2);
			$name4 = str_replace(" ", "_", $name3);
			$name5 = str_replace("../../", "", $name4);
			$name6 = str_replace("/", "_", $name5);
			//echo "n: " . $name3 . "\n";
			echo "\t\tthis.map.addTilesetImage('" . $name2 . "', '" . $name6 . "');\n";
		}
	}


	if (preg_match("/blend_roof/", $line)) {
		$process = true;
	}


}
fclose($file);
?>
