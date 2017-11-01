<?php
namespace Admin\Controller;
// 后台用户模块
class UserController extends CommonController {
	
	function _filter(&$map) {
		//$map['id'] = array('egt', 2);
		$map['account'] = array('like', "%" . $_POST['account'] . "%");
	}

    //重置密码
	public function resetPwd() {
		$id = I('post.id');
		$password = I('post.password');
		if (empty($password) || strlen($password) < 6) {
			$this->mtReturn(300, '密码长度必须大于6个字符！');
			
		}
		if ('' == trim($password)) {
			$this->mtReturn(300, '密码不能为空！');
			
		}
		$User = M('User');
		$User->password = md5($password);
		$User->id = $id;
		$result = $User->save();
		if (false !== $result) {
			
			$this->mtReturn(201, "修改密码成功");
			
		} else {
			
			$this->mtReturn(300, '修改密码失败！');
			
		}
	}
	public function password()
	{
		$this->display();
	}

    public function outxls(){
    
     	
     	
       
	   $filename='用户列表';
       $map=$this->_search();
       
       if($_REQUEST ['ids']!='all'){
       	 $map['id'] = array('in', explode(',', $_REQUEST ['ids']));
       }
        $volist = D('User')->where($map)->field('nickname,account,create_time')->select();
       foreach ($volist as $key =>$vo){
			
			
			$volist[$key]['create_time']=date("Y-m-d",$vo['create_time']);
			
			
		}
		
		$headArr=array("名称","账号","创建日期");
    
		$this->xlsout($filename,$headArr,$volist);
        
		
    }

	
	
	protected function addRole($userId,$roleId) {
		//新增用户自动加入相应权限组
		$RoleUser = M("RoleUser");
		$RoleUser->user_id = $userId;
		$RoleUser->role_id = $roleId;
		$RoleUser->add();
	}
	protected function editRole($userId,$roleId) {
		//新增用户自动加入相应权限组
		$RoleUser = M("RoleUser");
		$RoleUser->role_id = $roleId;
		if(!$RoleUser->where("user_id=$userId")->save()){
			$RoleUser->user_id = $userId;
			$RoleUser->add();
		}
	}

	public function _before_add() {
		$role = D("Role");
		$classTree = $role->field('id,name,pid')->select();
		$list = list_to_tree($classTree,'id','pid','_child',0);
		$this->assign('list', $list);
		
	}
public function rolelist(){
	
	    $role = D("Role");

        $map=$this->_search('Role');
	    
	   
	    $map['status']=1;
	   
		$this->_list($role,$map);
		$this->display();
	
}


	function edit() {
		
		$model = M('User');
		$id = $_REQUEST [$model->getPk()];
		$vo = $model->getById($id);
		$role = D("Role");
		$classTree = $role->field('id,name,pid')->select();
		$list = list_to_tree($classTree,'id','pid','_child',0);
		$RoleUser = M("RoleUser");
		$roleidList = $RoleUser->where('user_id='.$id)->find();
		$roleid = $roleidList['role_id'];
		$vo['roleid'] = $roleid;
		$this->assign('list', $list);
		$this->assign('vo', $vo);
		$this->display();
	}
    public function _after_insert($result){
		
		$roleId = isset($_REQUEST['roleId'])?$_REQUEST['roleId']:0;
		$this->addRole($result,$roleId);
	}
	
	function _after_update($userid) {
		
		$roleId = isset($_REQUEST['roleId'])?$_REQUEST['roleId']:0;
		$this->editRole($userid,$roleId);
		
	}

	function _before_foreverdelete($ids){
		
	        if (D('user')->hasRole($ids)){
	        	
	        	
				$this->mtReturn(300, '请在角色管理中先解除权限组与所删除用户的关联关系！');

			}
		
	}
    
	function _before_selectedDelete($ids){
		
	        if (D('user')->hasRole($ids)){
				$this->mtReturn(300, '请在角色管理中先解除权限组与所删除用户的关联关系！');

			}
		
	}
	
	


}

?>