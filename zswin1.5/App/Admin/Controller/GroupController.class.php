<?php
namespace Admin\Controller;
class GroupController extends CommonController {
	
public function _after_list($list){
	
	//对show进行处理
	 return int_to_string($list, array('show'=>array(1=>'显示',0=>'隐藏')));

}
	
}

?>