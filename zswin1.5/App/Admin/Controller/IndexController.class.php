<?php
namespace Admin\Controller;
class IndexController extends CommonController {

    // 框架首页
    public function index() {
    	
    	
    	
        if (isset($_SESSION [C('USER_AUTH_KEY')])) {
        	
        	
        	
        	
        	
        	$groups=M("Group")->where(array('status'=>1,'show'=>1))->order("sort asc")->select();
			//获得大的菜单项
        	
            //显示菜单项
            $menu = array();

            //读取数据库模块列表生成菜单项
            $node = M("Node");
            $where ['level'] = 2;
            $where ['status'] = 1;
            $where ['pid'] = 1;
            $list = $node->where($where)->field('id,name,group_id,title,remark,icon')->order('sort asc')->select();
            //获得所有第二级别，并且是pid为1的菜单项
             
            if(!$_SESSION[C('ADMIN_AUTH_KEY')])
            {
            
            $accessList = $_SESSION ['_ACCESS_LIST'];//获得授权的列表
            }
            
            foreach ($list as $key => $module) {
            	
            	if (isset($accessList [strtoupper('admin')] [strtoupper($module ['name'])]) || $_SESSION[C('ADMIN_AUTH_KEY')]) {
                    //设置模块访问权限
                    $module ['access'] = 1;
                    $menu[$module['group_id']][$key] = $module;
                }
            }
           
            foreach ($groups as $key=>$value){
				
			    foreach($menu[$value['id']] as $subkey=> $menuvo){
			    	
					$url='';
					
					if($menuvo['remark'] != NULL){
						$url=U('Admin/'.$menuvo['name'].'/'.$menuvo['remark']);
						$rel=$menuvo['remark'];
					}else{
						$url=U('Admin/'.$menuvo['name'].'/index');
						$rel=$menuvo['name'];
					}
					
					
					$menu[$value['id']][$subkey]['rel']=$rel;
					$menu[$value['id']][$subkey]['url']=$url;
				   
				    
				}
				if(!count($menu[$value['id']])){
					
					unset($groups[$key]);
				}
			  //$groups[$key]['sub']=$menu[$key];
				
			}
		
		
		$AdminList=D('Addons')->getAdminList();
			
        foreach($AdminList as $key=> $vo){
			    	
		$url='';
		$url=U('Admin/'.$vo['url']);
		$adminliststr[$key]['url']=$url;
		$adminliststr[$key]['rel']=$vo['name'];
		$adminliststr[$key]['id']='135'.$key;
		$adminliststr[$key]['title']=	$vo['title'];		
		}
		$menu[3][3]['sub']=$adminliststr;
        $menu[3][3]['hassub']=1;
		
		
		
		$this->assign('menu', $menu);
         $this->assign('groups', $groups);  
            
                      
            
            
        }
       $syslog=D('syslogs')->order('id desc')->limit(10)->select();
        
        $this->assign ( 'syslog', $syslog);
       
      
        $this->display();
    }

}

?>