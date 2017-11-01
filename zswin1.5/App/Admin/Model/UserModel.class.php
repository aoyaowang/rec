<?php
namespace Admin\Model;
use Think\Model;

// 用户模型
class UserModel extends CommonModel {
    public $_validate	=	array(
        array('password','require','密码必须'),
        array('nickname','require','昵称必须'),
        array('account','','帐号已经存在',0,'unique',3),
        );

    public $_auto		=	array(
        array('password','pwdHash',self::MODEL_BOTH,'callback'),
        array('create_time','time',self::MODEL_INSERT,'function'),
        array('update_time','time',self::MODEL_UPDATE,'function'),
        );

    protected function pwdHash() {
        if(isset($_POST['password'])) {
            return pwdHash($_POST['password']);
        }else{
            return false;
        }
    }
    function hasRole($ids) {
 	
 	    $map['user_id']=array('in',$ids);
 	    $rs = D('role_user')->where($map)->getField('role_id');
        
        if (isset($rs)) {
            return true;
        }
        return false;
    }
}
?>