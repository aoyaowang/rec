<?php
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

	header('Location: ./index.php/Admin/');
	exit;
