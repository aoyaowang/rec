<?php
namespace Admin\Controller;
use Think\Controller;
use Org\Util\Rbac;
class PublicController extends Controller {
// 检查用户是否登录

	protected function checkUser() {
		if (!isset($_SESSION[C('USER_AUTH_KEY')])) {
			
			$this->assign('jumpUrl', 'Public/login');
			$this->error('没有登录');
		}
	}
	
	public function cleancache(){
		

        //清文件缓存
        $dirs	=	array('./Runtime/');

        //清理缓存
         foreach($dirs as $value) {
         	if($this->rmdirr($value)){
         		 $data['info'].='文件夹'.$value.'删除成功;</br>';
         		 @mkdir($value,0777,true);
         	}
	         
	        
         }

        
		$data['status']=200;
		$result['forwardUrl'] = __SELF__;
		$data['callbackType']='forward';
		
		$this->dwzajaxReturn($data);
		
	}
	
    public function rmdirr($dirname) {
	if (!file_exists($dirname)) {
		return false;
	}
	if (is_file($dirname) || is_link($dirname)) {
		return unlink($dirname);
	}
	$dir = dir($dirname);
	if($dir){
		while (false !== $entry = $dir->read()) {
			if ($entry == '.' || $entry == '..') {
				continue;
			}
			$this->rmdirr($dirname . DIRECTORY_SEPARATOR . $entry);
		}
	}
	$dir->close();
	return rmdir($dirname);
    }
   // 用户登录页面
	public function login() {
		
		if (!isset($_SESSION[C('USER_AUTH_KEY')])) {
			
			$this->display();
		} else {
			$this->redirect('Index/index');
		}
	}

	public function index() {
		//如果通过认证跳转到首页
		redirect(__APP__);
	}

	// 用户登出
	public function logout() {
		$this->sysLogs("用户退出", '成功');
		if (isset($_SESSION[C('USER_AUTH_KEY')])) {
			unset($_SESSION[C('USER_AUTH_KEY')]);
			unset($_SESSION);
			session_destroy();
			
			$this->redirect('Public/login');
		} else {
			$this->error('已经退出！');
		}
	}

// 登录检测
	public function checkLogin() {
		
		$username=I('post.username');
        $password=I('post.password');
        $verify=I('post.verify');
		//生成认证条件
		$map = array();
		// 支持使用绑定帐号登录
		$map['account'] = $username;
		$map["status"] = array('gt', 0);
		if(!$this->check_verify($verify)){
            $this->error('验证码输入错误！');
        } 
		
		$authInfo = RBAC::authenticate($map);
		
		//使用用户名、密码和状态的方式进行认证
		if (false === $authInfo || NULL  === $authInfo) {
			
			$this->error('帐号不存在或已禁用！');
		} else {
			if ($authInfo['password'] != md5($_POST['password'])) {
				$this->error('密码错误！');
			}
			
			$_SESSION[C('USER_AUTH_KEY')] = $authInfo['id'];
			/*$_SESSION['userid'] = $authInfo['id'];
			$_SESSION['email'] = $authInfo['email'];
			$_SESSION['loginUserName'] = $authInfo['nickname'];
			$_SESSION['lastLoginTime'] = $authInfo['last_login_time'];
			$_SESSION['lastLoginIp'] = $authInfo['last_login_ip'];
			$_SESSION['login_count'] = $authInfo['login_count'];
			$_SESSION['login_account'] = $authInfo['account'];*/
			
			
			session('userid',$authInfo['id']);
			session('email',$authInfo['email']);
			session('loginUserName',$authInfo['nickname']);
			session('lastLoginTime',$authInfo['last_login_time']);
			session('lastLoginIp',$authInfo['last_login_ip']);
			session('login_count',$authInfo['login_count']);
			session('login_account',$authInfo['account']);
			
			if ($authInfo['id'] == 1) {
				//session(C('USER_AUTH_KEY'),true);
				$_SESSION[C('ADMIN_AUTH_KEY')] = true;
			}
			//保存登录信息
			$User = M('User');
			$ip = get_client_ip();
			$time = time();
			$data = array();
			$data['id'] = $authInfo['id'];
			$data['last_login_time'] = $time;
			$data['login_count'] = array('exp', 'login_count+1');
			$data['last_login_ip'] = $ip;
			$User->save($data);

			// 缓存访问权限
			RBAC::saveAccessList();
			//$this->success('登录成功！');
			$this->sysLogs("用户登录", '成功');
			$this->success('登陆成功',U('Index/index'));
		}
	}

// 更换密码
	public function changePwd() {
		$this->checkUser();
		
		$map = array();
		if(I('post.password')!=I('post.repassword'))
		{
			$data['status']=300;
			$data['info']='两次输入密码不一致！';
			//$this->error('两次输入密码不一致！');
		}
		$map['password'] = pwdHash(I('post.oldpassword'));
		
		$password=I('post.password');
		
		
		if (isset($_POST['account'])) {
			$map['account'] = $_POST['account'];
		} elseif (isset($_SESSION[C('USER_AUTH_KEY')])) {
			$map['id'] = $_SESSION[C('USER_AUTH_KEY')];
		}
		//检查用户
		$User = M("User");
		if (!$User->where($map)->field('id')->find()) {
			
			$data['status']=300;
			$data['info']='旧密码不符或者用户名错误！';
			
		} else {
			if (empty($password) || strlen($password) < 6) {
				$data['status']=300;
			    $data['info']='密码长度必须大于6个字符！';
			
			}else{
				$User->password = pwdHash($password);
			$User->save();
			$data['status']=200;
			$data['info']='密码修改成功！';
			$data['navTabId']=$_REQUEST['navTabId'];
			$data['callbackType']='closeCurrent';
			
			}
			
		}
		
		
		$this->dwzajaxReturn($data);
	}
 protected function dwzajaxReturn($data, $type='') {
        // 保证AJAX返回后也能保存日志
        
        $result = array();
       
        $result['statusCode'] = $data['status']; // dwzjs
        $result['navTabId'] = $data['navTabId']; // dwzjs
        $result['callbackType'] = $data['callbackType']; // dwzjs
        $result['message'] = $data['info']; // dwzjs
        $result['forwardUrl'] = $data['forwardUrl'];
        $result['rel'] = $data['rel'];
        
        $result['status'] = $data['status'];
        $result['info'] = $data['info'];
       
        if (empty($type))
            $type = C('DEFAULT_AJAX_RETURN');
        if (strtoupper($type) == 'JSON') {
            // 返回JSON数据格式到客户端 包含状态信息
            header("Content-Type:text/html; charset=utf-8");
            exit(json_encode($result));
        } elseif (strtoupper($type) == 'XML') {
            // 返回xml格式数据
            header("Content-Type:text/xml; charset=utf-8");
            exit(xml_encode($result));
        } elseif (strtoupper($type) == 'EVAL') {
            // 返回可执行的js脚本
            header("Content-Type:text/html; charset=utf-8");
            exit($data);
        } else {
            // TODO 增加其它格式
        }
    }


	// 检测输入的验证码是否正确，$code为用户输入的验证码字符串	  
	public function check_verify($code, $id = ''){
		$verify = new \Think\Verify();
		return $verify->check($code, $id);
	}	
	
	//生成  验证码 图片的方法
	public function verify() {             
        //3.2.1  中的生成 验证码 图片的方法        
        $Verify = new \Think\Verify();
        
        //$Verify->codeSet = rand_string(4,9); 
        $Verify->length   = 4;
       
        $Verify->entry();                      
    }	

	
	function UploadModel($files) {
		$upload = new \Think\Upload();
        //$info   = $Upload->upload($files);
		//$upload = new UploadFile();
		
		//$upload->saveRule = 'time';
		$result = $upload->upload($files);

		if (!$result) {
			return $upload->getError();
		} else {
			
			return $result;
		}
	}

	function DeleteImages($imagename) {
		$dir = '../Public/upload/';
		unlink($dir . $imagename);
	}
	public function uploadpicture()
	{
		
		$uploadfile = $_FILES['Picture']['tmp_name'];
		if ($uploadfile != "") {

			$uploadList = $this->UploadModel($_FILES);
			
			$result  =  array();
			$result['status']  =  1;
			$result['data'] = $uploadList;
			// 返回JSON数据格式到客户端 包含状态信息
			//header("Content-Type:text/html; charset=utf-8");
			//echo json_encode($result);
			$this->ajaxReturn($result);
		}

	}
	public function uploadvedio(){
		if (isset($_REQUEST['PHPSESSID'])) session_id($_REQUEST['PHPSESSID']);
		session_start();
		if (isset($_REQUEST['user_id'])) $_SESSION[C('USER_AUTH_KEY')] =  $_REQUEST['user_id'];
		$uploadfile = $_FILES['Filedata']['tmp_name'];
		if ($uploadfile != "") {

			$uploadList = $this->UploadModel();
			$filepath = $uploadList[0]['savename'];
			$filesize = $uploadList[0]['size'];
			$data  =  array();
			$data['filepath'] = $filepath;
			$data['filesize'] = $filesize;
			$result  =  array();
			$result['status']  =  1;
			$result['statusCode']  =  1;	// zhanghuihua@msn.com
			$result['navTabId']  =  $_REQUEST['navTabId'];	// zhanghuihua@msn.com
			$result['message'] =  "";
			$result['data'] = $data;
			// 返回JSON数据格式到客户端 包含状态信息
			header("Content-Type:text/html; charset=utf-8");
			exit(json_encode($result));
		}
	}


	function sysLogs($opname='未知', $message='未知') {
		$syslogs = D("Syslogs");
		$data = array();
		$ip = get_client_ip();
		$data['modulename'] = '公共模块';
		$data['actionname'] = $opname;
		$data['opname'] = $opname;
		$data['message'] = $message;
		$data['username'] = session('loginUserName') . "(" . session('login_account') . ")";
		$data['userid'] = $_SESSION[C('USER_AUTH_KEY')];
		$data['userip'] = $ip;
		$data['create_time'] = time();
		$result = $syslogs->add($data);
	}



}

?>