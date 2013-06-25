require_once ('SforcePartnerClient.php');
$mySforceConnection = login("john@sunible.com","s0largeek0Gi8L8ziEHWufHVH5R6NbVEz");
 
 
function login($username, $password) {
        global $mySforceConnection;
        $wsdl = 'wsdl.xml';
        $mylogin = null;
        try {
                $mySforceConnection = new SforcePartnerClient();
                $mySforceConnection->createConnection($wsdl);
                $mylogin = $mySforceConnection->login($username, $password);
 
        } catch (Exception $e) {
                global $errors;
                $errors = $e->faultstring;
                echo $errors;
        }
 
        return $mySforceConnection;
}
