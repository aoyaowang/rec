<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
       //dump(IP('127.0.0.1'));
       $hooks = M('Hooks')->field(array('name'=>'label','description'=>'value'))->select();
        dump($hooks);
    	$this->display();
    	
    }
}