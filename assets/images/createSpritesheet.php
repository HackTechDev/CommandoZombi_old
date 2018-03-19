<?php

$src = imagecreatefrompng("nightguardswordnpc.png");



$img = imagecreatetruecolor(576, 64);
imagesavealpha($img, true);
$color = imagecolorallocatealpha($img, 0, 0, 0, 127);
imagefill($img, 0, 0, $color);

imagecopy($img, $src, 0, 0, 0, 0, 144, 64);

imagecopy($img, $src, 144, 0, 0, 64, 144, 64);
imagecopy($img, $src, 288, 0, 0, 128, 144, 64);
imagecopy($img, $src, 432, 0, 0, 192, 144, 64);

imagepng($img, 'test.png');


imagepng($img);
imagedestroy($img);
?>
